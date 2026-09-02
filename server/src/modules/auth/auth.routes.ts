import { Router } from "express";
import AuthController from "./auth.controller.ts";
import asyncHandler from "../../utils/asyncHandler.ts";
import * as validation from "../../validation/validationRule.ts";
import authMiddleware from "../../middlewares/auth.middleware.ts";
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

routes.post(
  "/refresh",
  asyncHandler(authController.refreshPageController.bind(authController)),
);

routes.get(
  "/me",
  authMiddleware,
  asyncHandler(authController.getMeController.bind(authController)),
);
export default routes;
