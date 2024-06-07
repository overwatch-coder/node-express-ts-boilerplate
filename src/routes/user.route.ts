import express from "express";
import {
  registerUser,
  findCurrentUser,
  logoutUser,
} from "@/controllers/user.controller";
import { userQuerySchema, userSchema } from "@/schema/user.schema";
import { validateRequest } from "@/middleware/validate.middleware";

const router = express.Router();

router.post("/register", validateRequest(userSchema), registerUser);
router.get("/me", validateRequest(userQuerySchema), findCurrentUser);
router.post("/logout", logoutUser);

export default router;
