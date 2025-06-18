import Joi from "joi";

export const newCardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string().pattern(/^05\d{8}$/).required(),
  email: Joi.string().email({ tlds: false }).required(),
  web: Joi.string().uri().allow("", null),
  image: Joi.object({
    url: Joi.string().uri().allow("", null),
    alt: Joi.string().min(2).max(256).allow("", null),
  }),
  address: Joi.object({
    state: Joi.string().min(2).max(256).required(),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().min(2).max(256).required(),
    zip: Joi.number().min(2).max(256).required(),
  }),
});
