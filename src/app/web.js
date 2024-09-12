import express from "express";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/errormiddleWare.js";
import { authRouter } from "../routes/auth-api.js";

export const Web = express();
Web.use(express.json());
Web.use(publicRouter);
Web.use(authRouter);
Web.use(errorMiddleware);
