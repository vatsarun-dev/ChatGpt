import validRequest from "../utils/validationRequest.ts";
import { body } from "express-validator";
export const registerValidationRule = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .not()
    .isIn(["admin", "root", "superuser"])
    .withMessage("This name is reserved")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("designation").trim().optional(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),
  validRequest,
];
export const loginValidationRule = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be at least 6 characters"),
  validRequest,
];
