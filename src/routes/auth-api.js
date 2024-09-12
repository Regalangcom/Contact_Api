import express from "express";
import userControllers from "../controllers/user-controllers.js";
import { authMiddleware } from "../middleware/authmiddleWare.js";
const authRouter = express.Router();
authRouter.use(authMiddleware);
authRouter.get("/api/users/current", userControllers.getUserApi);
authRouter.put("/api/users/current", userControllers.updateUser);
authRouter.delete("/api/users/current", userControllers.logoutUser);

export { authRouter };
