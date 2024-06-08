import { generateToken, hashPassword } from "@/lib";
import { UserBody, UserQuery } from "@/types";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
// import { matchedData } from "express-validator";

/**
  @desc    REGISTER USER
  @route   /api/users/register
  @method  POST
  @access  public
*/
export const registerUser = expressAsyncHandler(
  async (req: Request<any, any, UserBody, any>, res: Response) => {
    req.body;
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get All Users'

    // get data using express-validator
    // const { password, ...data } = matchedData<User>(req);

    // get data using zod
    const { password, ...data } = req.body;

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
  async (req: Request<any, any, any, UserQuery>, res: Response) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get Current User'

    // get data using express-validator
    // const data = matchedData<CurrentUser>(req);

    // get data using zod
    const data = req.query;

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
    // #swagger.tags = ['Users']
    // #swagger.description = "Logout and clear cookie of logged in user"
    res.cookie("access_token", "", {
      httpOnly: (process.env.NODE_ENV as string) === "production",
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "You have successfully logged out",
    });
  }
);
