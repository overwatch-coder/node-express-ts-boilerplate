import { NextFunction, Request, Response } from "express";
import {
  ValidationChain,
  ValidationError,
  validationResult,
} from "express-validator";

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const errorsArray = errors.array().map((error: ValidationError) => {
      return error.msg as string;
    });

    res.status(400).json({
      errors: errorsArray,
      message: "Validation Error",
      data: null,
      success: false,
    });
  };
};
