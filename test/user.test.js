import supertest from "supertest";
import { Web } from "../src/app/web";
import { logger } from "../src/app/logging";
import bcrypt from "bcrypt";
import { removeTestUser, createTestUser, getTestUsers } from "./test-util";

describe("POST /api/users", function () {
  // setiap selesai mengambil data maka kita hapus ""AFTEREACH
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(Web).post("/api/users").send({
      username: "test",
      password: "test2",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(Web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info("result body :", result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already registered", async () => {
    let result = await supertest(Web).post("/api/users").send({
      username: "test",
      password: "test2",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(Web).post("/api/users").send({
      username: "test",
      password: "test2",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can login users", async () => {
    const result = await supertest(Web).post("/api/users/login").send({
      username: "test",
      password: "test2",
    });

    logger.info("result2:", result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test2");
  });

  it("should reject login if request is invalid", async () => {
    const result = await supertest(Web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info("result2:", result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if  password wrong", async () => {
    const result = await supertest(Web).post("/api/users/login").send({
      username: "test",
      password: "test3",
    });

    logger.info("result:", result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if  username wrong", async () => {
    const result = await supertest(Web).post("/api/users/login").send({
      username: "test1",
      password: "test2",
    });

    logger.info("result:", result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  // setiap selesai mengambil data maka kita hapus ""AFTEREACH
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can current user", async () => {
    const result = await supertest(Web)
      .get("/api/users/current")
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
  });
});

describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  // setiap selesai mengambil data maka kita hapus ""AFTEREACH
  afterEach(async () => {
    await removeTestUser();
  });

  it("should update user", async () => {
    const result = await supertest(Web)
      .put("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "galangjs",
        password: "rahasia",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("galangjs");

    const user = await getTestUsers();
    expect(await bcrypt.compare("rahasia", user.password)).toBe(true);
  });
});

describe("DELETE /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  // setiap selesai mengambil data maka kita hapus ""AFTEREACH
  afterEach(async () => {
    await removeTestUser();
  });

  it("should logout user", async () => {
    const result = await supertest(Web)
      .delete("/api/users/current")
      .set("Authorization", "test");
    // .send({
    //   name: "galangjs",
    //   password: "rahasia",
    // });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("User logged out successfully");

    const user = await getTestUsers();
    expect(user.token).toBeNull();
  });

  it("should reject logout user", async () => {
    const result = await supertest(Web)
      .delete("/api/users/current")
      .set("Authorization", "tests");

    logger.info(result.body);

    expect(result.status).toBe(401);
  });
});
