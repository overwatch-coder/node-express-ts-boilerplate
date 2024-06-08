import {
  userQuerySchemaWithZod,
  userSchemaWithZod,
} from "@/schema/user.schema";
import { z } from "zod";

export type UserBody = z.infer<typeof userSchemaWithZod>;
export type UserQuery = z.infer<typeof userQuerySchemaWithZod>;
