import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/responseError.js";
import {
  loginValidation,
  registerValidation,
  getUserValidation,
  updateUserValidation,
} from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (req) => {
  const user = validate(registerValidation, req);
  const countUsers = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });
  if (countUsers === 1) {
    throw new ResponseError(400, "Username already in exist");
  }

  user.password = await bcrypt.hash(user.password, 10);
  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (req) => {
  const loginRequest = validate(loginValidation, req);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Invalid username or password");
  }

  const token = uuid().toString();
  return await prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
      password: user.password,
    },
    select: {
      token: true,
    },
  });
};

const getUserApi = async (username) => {
  const userId = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: userId,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }
  return user;
};

const updateUser = async (req) => {
  const user = validate(updateUserValidation, req);

  const totalinDatabases = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (totalinDatabases !== 1) {
    return new ResponseError(404, "user not found");
  }

  const data = {};
  if (user.name) {
    data.name = user.name;
  }

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  return prismaClient.user.update({
    where: {
      username: user.username,
    },
    data: data,
    select: {
      username: true,
      name: true,
    },
  });
};

const logoutUser = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return await prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

export default { register, login, getUserApi, updateUser, logoutUser };
