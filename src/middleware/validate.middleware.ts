import { NextFunction, Request, Response } from "express";
import {
  ValidationChain,
  ValidationError,
  validationResult,
} from "express-validator";
import { RequestHandler } from "express";
import { ZodError, z, ZodSchema, ZodTypeAny, ZodRawShape } from "zod";

// EXPRESS VALIDATION MIDDLEWARE

/**
 *
 * @param validations An array of ExpressValidator validation chains.
 * @returns A middleware function that validates the request based on the provided validations.
 */
export const validateRequestWithExpressValidator = (
  validations: ValidationChain[]
) => {
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

// ZOD VALIDATION MIDDLEWARE
const types = ["query", "params", "body"] as const;

/**
 * A ZodSchema type guard.
 * @param schema The Zod schema to check.
 * @returns Whether the provided schema is a ZodSchema.
 */
function isZodSchema(schema: any): schema is ZodSchema {
  return schema && typeof schema.safeParse === "function";
}

/**
 * Generates a middleware function for Express.js that validates request params, query, and body.
 * This function uses Zod schemas to perform validation against the provided schema definitions.
 *
 * @param schemas - An object containing Zod schemas for params, query, and body.
 * @returns An Express.js middleware function that validates the request based on the provided schemas.
 *          It attaches validated data to the request object and sends error details if validation fails.
 * @template TParams - Type definition for params schema.
 * @template TQuery - Type definition for query schema.
 * @template TBody - Type definition for body schema.
 */
export function validateRequestWithZod<
  TParams extends Validation = {},
  TQuery extends Validation = {},
  TBody extends Validation = {}
>(
  schemas: ExtendedValidationSchemas<TParams, TQuery, TBody>
): RequestHandler<
  ZodOutput<TParams>,
  any,
  ZodOutput<TBody>,
  ZodOutput<TQuery>
> {
  // Create validation objects for each type
  const validation = {
    params: isZodSchema(schemas.params)
      ? schemas.params
      : z.object(schemas.params ?? {}).strict(),
    query: isZodSchema(schemas.query)
      ? schemas.query
      : z.object(schemas.query ?? {}).strict(),
    body: isZodSchema(schemas.body)
      ? schemas.body
      : z.object(schemas.body ?? {}).strict(),
  };

  return (req, res, next) => {
    const errors: Array<ErrorListItem> = [];

    // Validate all types (params, query, body)
    for (const type of types) {
      const parsed = validation[type].safeParse(req[type]);
      if (parsed.success) {
        req[type] = parsed.data;
      } else {
        errors.push({ type, errors: parsed.error });
      }
    }

    // Return all errors if there are any
    if (errors.length > 0) {
      const errorsArray = Array.from(
        new Set(
          errors
            .map((error) => {
              return error.errors.issues.map((issue) => issue.message);
            })
            .flat()
        )
      );

      return res.status(400).json({
        errors: errorsArray,
        message: "Validation Error",
        data: null,
        success: false,
      });
    }

    return next();
  };
}

/**
 * Describes the types of data that can be validated: 'query', 'params', or 'body'.
 */
type DataType = typeof types[number];

/**
 * Defines the structure of an error item, containing the type of validation that failed (params, query, or body)
 * and the associated ZodError.
 */
interface ErrorListItem {
  type: DataType;
  errors: ZodError<any>;
}

/**
 * Represents a generic type for route validation, which can be applied to params, query, or body.
 * Each key-value pair represents a field and its corresponding Zod validation schema.
 */
type Validation = ZodTypeAny | ZodRawShape;

/**
 * Defines the structure for the schemas provided to the validate middleware.
 * Each property corresponds to a different part of the request (params, query, body)
 * and should be a record of Zod types for validation.
 *
 * @template TParams - Type definition for params schema.
 * @template TQuery - Type definition for query schema.
 * @template TBody - Type definition for body schema.
 */
interface ExtendedValidationSchemas<TParams, TQuery, TBody> {
  params?: TParams;
  query?: TQuery;
  body?: TBody;
}

/**
 * Represents the output type of a Zod validation schema.
 * This is used to infer the TypeScript type from a Zod schema,
 * providing typesafe access to the validated data.
 *
 * @template T - The validation type (params, query, or body).
 */
type ZodOutput<T extends Validation> = T extends ZodRawShape
  ? z.ZodObject<T>["_output"]
  : T["_output"];
