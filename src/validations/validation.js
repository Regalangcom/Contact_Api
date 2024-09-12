import { ResponseError } from "../error/responseError.js";

const validate = (schema, req) => {
  const result = schema.validate(req, {
    // abortEarly: false,
    // // akan di reject jiak ada field yang tidak di ketahui
    // allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };
