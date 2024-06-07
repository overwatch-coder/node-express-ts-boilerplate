import { generateToken, hashPassword } from "@/lib";
import { CurrentUser, User } from "@/types";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { matchedData } from "express-validator";

/**
  @desc    REGISTER USER
  @route   /api/users/register
  @method  POST
  @access  public
*/
export const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get All Users'

    const { password, ...data } = matchedData<User>(req);

    const token = generateToken(res, data.email);

    res.status(200).json({
      message: "Get All Users",
      errors: null,
      data: {
        ...data,
        token,
      },
      success: true,
    });
  }
);

/**
  @desc     FIND CURRENT USER
  @route    /api/users/me
  @method   GET
  @access   public
*/
export const findCurrentUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get Current User'

    const data = matchedData<CurrentUser>(req);

    res.status(200).json({
      message: "Get Current User",
      errors: null,
      data: data,
      success: true,
    });
  }
);

/**
  @desc     LOGOUT A USER
  @route    /api/users/logout
  @method   POST
  @access   public
*/
export const logoutUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "You have successfully logged out",
    });
  }
);
