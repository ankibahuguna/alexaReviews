const path = require("path");
const DB = require("../db/DAO");

module.exports = () => {
    const ReviewService = require("../services/reviews.service");
    const ReviewModel = require("../models/reviews");

    const filePath = path.join(__dirname, "..", "..", "data/alexa.json");
    const reviewService = new ReviewService(new ReviewModel(new DB(filePath)));

    return {
        getReviews: async (request) => {
            const { rating, store } = request.query;
            const reviews = await reviewService.getAllReviews({
                rating,
                store,
            });
            return reviews;
        },

        getMonthlyRatingsByStore: async () => {
            const ratings =
                await reviewService.getAverageMonthlyRatingsByStore();
            return ratings;
        },

        postNewReview: async (req) => {
            await reviewService.createNewReview(req.payload);
            return "Success";
        },

        getTotalRatingsByStore: async () => {
            return await reviewService.getCountOfRatingsByStore();
        },
    };
};
