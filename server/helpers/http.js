export const response = ({ res, code = 200, message, data, errors }) =>
  res.status(code).json({ message, data, errors });

export class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/**
 * @description Checks if a value exists, or throw 404 error
 *
 * @param {any} data Item to check if is truthy
 * @param {String} message Error message to return upon failure
 *
 * @throws {CustomError}
 */
export const existsOr404 = (data, message) => {
  if (!data) {
    throw new CustomError(message, 404);
  }
};

/**
 * @description A try catch Higher Order Function handler
 *
 * @param {Func} action The function or method to be handled
 * @returns {Promise} Promise to resolve the action or return an error response
 */
const resolve  = (action) => async (req, res) => {
  try {
    return await action(req, res);
  } catch ({ message, code }) {
    return response({ res, code: code < 600 ? code : 500, errors: [message] });
  }
};

/**
 * @description Takes in controller and returns a clone
 * Whose methods use our custom error Handler
 *
 * @param {Object} controller
 * @returns {Object} Clone of the controller object with exception handling
 */
export const resolver = (controller) =>
  Object.entries(controller).reduce((result, [key, value]) => {
    result[key] = resolve(value);
    return result;
  }, {});
