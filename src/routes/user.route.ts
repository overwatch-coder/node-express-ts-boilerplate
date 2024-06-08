import express from "express";
import {
  registerUser,
  findCurrentUser,
  logoutUser,
} from "@/controllers/user.controller";
import {
  // userQuerySchemaWithExpressValidator,
  // userSchemaWithExpressValidator,
  userQuerySchemaWithZod,
  userSchemaWithZod,
} from "@/schema/user.schema";
import {
  // validateRequestWithExpressValidator,
  validateRequestWithZod,
} from "@/middleware/validate.middleware";

const router = express.Router();

router.post(
  "/register",
  validateRequestWithZod({
    body: userSchemaWithZod,
  }),
  registerUser
);
router.get(
  "/me",
  validateRequestWithZod({ query: userQuerySchemaWithZod }),
  findCurrentUser
);
router.post("/logout", logoutUser);

export default router;
