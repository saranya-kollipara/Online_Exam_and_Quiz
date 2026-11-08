import { errorResponse } from '../utils/apiResponse.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed; // Replace with sanitized/coerced data
      next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return errorResponse(res, 'Input validation failed', 400, formattedErrors);
      }
      return errorResponse(res, 'Malformed input provided', 400);
    }
  };
}

