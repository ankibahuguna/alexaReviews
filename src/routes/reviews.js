const Joi = require("joi");
const { join } = require("node:path");

module.exports = () => {
    // eslint-disable-next-line global-require
    const reviewHandler = require("../handlers/reviews")();
    return [
        {
            path: "/reviews",
            method: "GET",
            handler: reviewHandler.getReviews,
            options: {
                description: "Get all reviews",
                tags: ["api"],
                auth: false,
                validate: {
                    query: Joi.object({
                        store: Joi.string().optional(),
                        rating: Joi.number().integer().optional(),
                        date: Joi.date().optional(),
                    }),
                },
            },
        },
        {
            path: "/reviews",
            method: "POST",
            handler: reviewHandler.postNewReview,
            options: {
                description: "Post a new review",
                tags: ["api"],
                auth: false,
                validate: {
                    payload: Joi.object({
                        review: Joi.string().optional(),
                        rating: Joi.number().integer().required(),
                        product_name: Joi.string().required(),
                        author: Joi.string().required(),
                        title: Joi.string().optional(),
                        review_source: Joi.string()
                            .valid("iTunes", "GooglePlayStore")
                            .required(),
                    }),
                },
            },
        },
        {
            path: "/average-rating-by-month",
            method: "GET",
            handler: reviewHandler.getMonthlyRatingsByStore,
            options: {
                description: "Get ratings by month and store",
                tags: ["api"],
                auth: false,
            },
        },
        {

            path: "/total-ratings-by-store",
            method: "GET",
            handler: reviewHandler.getTotalRatingsByStore,
            options: {
                description: "Get ratings by store",
                tags: ["api"],
                auth: false,
            },
        }
    ];
};
