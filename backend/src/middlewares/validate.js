import { ValidationError } from '../utils/errors.js';

/**
 * Zod validation middleware factory.
 * Accepts either:
 * - A Zod schema and an optional source ('body' | 'query' | 'params', defaults to 'body')
 * - An object containing schemas: { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 */
export function validate(schemaOrSchemas, source = 'body') {
  return async (req, res, next) => {
    try {
      if (schemaOrSchemas && typeof schemaOrSchemas.safeParse === 'function') {
        // Single schema passed with a target source
        const result = schemaOrSchemas.safeParse(req[source]);
        if (!result.success) {
          const formattedErrors = result.error.errors.map((e) => ({
            field: e.path.join('.') || source,
            message: e.message,
          }));
          return next(new ValidationError('Validation failed', formattedErrors));
        }
        req[source] = result.data;
      } else if (typeof schemaOrSchemas === 'object' && schemaOrSchemas !== null) {
        // Multi-source schema object
        for (const [targetSource, schema] of Object.entries(schemaOrSchemas)) {
          if (schema && typeof schema.safeParse === 'function') {
            const result = schema.safeParse(req[targetSource]);
            if (!result.success) {
              const formattedErrors = result.error.errors.map((e) => ({
                field: e.path.join('.') || targetSource,
                message: e.message,
              }));
              return next(new ValidationError('Validation failed', formattedErrors));
            }
            req[targetSource] = result.data;
          }
        }
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
