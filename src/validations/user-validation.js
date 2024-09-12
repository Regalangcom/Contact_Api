import Joi from "joi";

const registerValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
  name: Joi.string().max(20).required(),
});

const loginValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

// GET USER API
const getUserValidation = Joi.string().max(100).required();

// UPDATE USER
const updateUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).optional(),
  name: Joi.string().max(100).required(),
});

export {
  registerValidation,
  loginValidation,
  getUserValidation,
  updateUserValidation,
};
