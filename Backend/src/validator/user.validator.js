import Joi from "joi";

function userRegistrationValidation(data) {
  const userSchema = Joi.object({
    firstname: Joi.string().min(3).required().messages({
      "string.min": "Firstname must be atleast 3 characters long",
      "any.required": "Firstname is required",
    }),
    lastname: Joi.string().min(3).messages({
      "string.min": "Lastname must be atleast 3 characters long",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be an valid email",
    }),
    phone: Joi.string().max(12).required().messages({
      "string.max": "Phone must be 12 in length",
      "any.required": " Phone Number is required",
    }),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#).",
        "string.empty": "Password cannot be empty.",
        "any.required": "Password is required.",
      }),
  });

  let { error } = userSchema.validate(data);

  return error ? error.details : null;
}

function userLoginValidation(data) {
  const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be an valid email",
    }),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#).",
        "string.empty": "Password cannot be empty.",
        "any.required": "Password is required.",
      }),
  });

  let { error } = loginSchema.validate(data);

  return error ? error.details : null;
}

function emailValidation(data) {
  const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be an valid email",
    }),
  });

  let { error } = emailSchema.validate(data);

  return error ? error.details : null;
}

function passwordValidation(data) {
  const passwordSchema = Joi.object({
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#).",
        "string.empty": "Password cannot be empty.",
        "any.required": "Password is required.",
      }),
  });

  let { error } = passwordSchema.validate(data);

  return error ? error.details : null;
}

export {
  userRegistrationValidation,
  userLoginValidation,
  emailValidation,
  passwordValidation,
};
