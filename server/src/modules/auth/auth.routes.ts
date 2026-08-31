import { Router } from "express";
import AuthController from "./auth.controller.ts";
import asyncHandler from "../../utils/asyncHandler.ts";

const routes = Router();
const authController = new AuthController();
routes.post(
  "/login",
  asyncHandler(authController.loginUserController.bind(authController)),
);
routes.post(
  "/register",
  asyncHandler(authController.registerUserController.bind(authController)),
);

export default routes;
