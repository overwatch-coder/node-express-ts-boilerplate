import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// generate jwt token and send cookie
export const generateToken = (
  res: Response,
  data: any,
  expiry: number = 10
) => {
  const token = jwt.sign({ data }, process.env.JWT_SECRET as string, {
    expiresIn: `${expiry}d`,
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * expiry,
  });

  return token;
};

// hash password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

// compare password with db password
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

  return isPasswordMatch;
};
