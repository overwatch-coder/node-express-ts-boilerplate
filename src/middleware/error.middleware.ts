import { logger } from "@/lib/logger";
import { Request, Response, NextFunction } from "express";
import { CastError } from "mongoose";
import {
  StatusCodes as HttpStatusCode,
  getReasonPhrase,
} from "http-status-codes";

// Custom HTTP error class
export class HttpError extends Error {
  statusCode: HttpStatusCode;
  kind?: CastError;

  constructor(statusCode: HttpStatusCode, message: string, kind?: CastError) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.kind = kind;
  }
}

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(
    HttpStatusCode.NOT_FOUND,
    `Not Found - ${req.originalUrl}`
  );
  res.status(HttpStatusCode.NOT_FOUND);
  next(error);
};

// Error handler function
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default status code is 500 (Internal Server Error)
  let statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;

  // Check if the error has a known HTTP status code
  if (
    (err as HttpError).statusCode &&
    Object.values(HttpStatusCode).includes((err as HttpError).statusCode)
  ) {
    statusCode = (err as HttpError).statusCode;
  }

  // If Mongoose not found error, set to 404 and change message
  if (
    (err as CastError).name === "CastError" &&
    (err as CastError).kind === "ObjectId"
  ) {
    statusCode = 500;
    err.message = "Resource not found - Invalid Object Id";
  }

  // Log the error
  logger.error(
    `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // Send the appropriate HTTP response
  res.status(statusCode).json({
    errors: [
      err.message || getReasonPhrase(statusCode) || "Internal Server Error",
    ],
    success: false,
    data: null,
    message: err.message || "Internal Server Error",
  });
};

// Custom HTTP error function
export const createHttpError = (
  message: string,
  statusCode?: HttpStatusCode
): HttpError => {
  if (!statusCode) {
    // Infer status code from the message
    statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  }

  const error: any = new HttpError(statusCode, message);

  return error;
};
