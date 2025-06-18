import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
    .message('Email must be a valid email address')
    .required(),

  password: Joi.string()
    .pattern(/((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*-]).{7,20})/)
    .message(
      'Password must be 7-20 characters long, include uppercase, lowercase, number and special character'
    )
    .required(),
});
