import express from "express";
import userControllers from "../controllers/user-controllers.js";
const publicRouter = express.Router();

publicRouter.post("/api/users", userControllers.register);
publicRouter.post("/api/users/login", userControllers.login);

export { publicRouter };
