const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(5000),
    

    }).required();

module.exports.reviewSchema = Joi.object({
    comments:Joi.string().required().trim(),
    ratings:Joi.number().min(1).max(5).required(),
    createdAt:Joi.date(),
}).required();