import { body } from "express-validator";
import validRequest from "../utils/validationRequest.ts";
export const chatValidation = [
  body("message").notEmpty().withMessage("Message is required"),
  body("conversation")
    .optional()
    .isString()
    .withMessage("Conversation must be a string")
    .isMongoId()
    .withMessage("Conversation must be a valid MongoDB ID"),
  validRequest,
];
