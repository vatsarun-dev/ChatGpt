import { Router } from "express";
import AuthController from "./auth.controller.ts";
import asyncHandler from "../../utils/asyncHandler.ts";
import * as validation from "../../validation/validationRule.ts";
const routes = Router();
const authController = new AuthController();
routes.post(
  "/login",
  validation.loginValidationRule,
  asyncHandler(authController.loginUserController.bind(authController)),
);
routes.post(
  "/register",
  validation.registerValidationRule,
  asyncHandler(authController.registerUserController.bind(authController)),
);

export default routes;
