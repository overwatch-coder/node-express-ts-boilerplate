import { body, query } from "express-validator";
import { z } from "zod";

//=======================================================
// ========== EXPRESS VALIDATOR SCHEMAS ================
// ======================================================
export const userSchemaWithExpressValidator = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isStrongPassword({
      minLength: 8,
    })
    .withMessage(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

export const userQuerySchemaWithExpressValidator = [
  query("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  query("name").trim().escape().notEmpty().withMessage("Name is required"),
];

//=======================================================
// ===================== ZOD SCHEMAS ====================
// ======================================================

export const userSchemaWithZod = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Email must be valid"),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const userQuerySchemaWithZod = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Email must be valid"),
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty"),
});
