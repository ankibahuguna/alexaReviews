const moment = require("moment");
const _ = require("lodash");

const { MONTH_MAP } = require("../constants");

class ReviewService {
    constructor(model) {
        this.model = model;
    }

    async getAllReviews({ rating, store, date }) {
        let reviews = await this.model.findAll();

        if (rating) {
            reviews = reviews.filter((review) => review.rating === rating);
        }

        if (store) {
            reviews = reviews.filter(
                (review) => review.review_source === store
            );
        }

        if (date) {
            reviews = reviews.filter(({ reviewed_date }) =>
                moment(reviewed_date).isSame(date)
            );
        }

        return reviews;
    }

    async getAverageMonthlyRatingsByStore() {
        let reviews = await this.model.findAll();

        const [google, iTunes] = [
            reviews.filter(
                ({ review_source }) => review_source === "GooglePlayStore"
            ),
            reviews.filter(({ review_source }) => review_source === "iTunes"),
        ];
        const monthMap = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
            11: [],
        };

        const map = { ...monthMap };

        const playStoreByMonth = google
            .map((review) => ({
                ...review,
                month: moment(review.reviewed_date).month(),
            }))
            .reduce(
                (acc, curr) => {
                    acc[curr.month] = acc[curr.month].concat(curr.rating);
                    return acc;
                },

                monthMap
            );

        const iTunesByMonth = iTunes
            .map((review) => ({
                ...review,
                month: moment(review.reviewed_date).month(),
            }))
            .reduce((acc, curr) => {
                acc[curr.month] = acc[curr.month].concat(curr.rating);
                return acc;
            }, map);

        for (let [k, v] of Object.entries(playStoreByMonth)) {
            const sumOfRatings = v.reduce((acc, curr) => acc + curr, 0);
            playStoreByMonth[k] = sumOfRatings / v.length;
        }
        for (let [k, v] of Object.entries(iTunesByMonth)) {
            const sumOfRatings = v.reduce((acc, curr) => acc + curr, 0);
            iTunesByMonth[k] = sumOfRatings / v.length;
        }
        return {
            GooglePlayStore: playStoreByMonth,
            itunes: iTunesByMonth,
        };
    }

    async getCountOfRatingsByStore() {
        let reviews = await this.model.findAll();

        const [google, iTunes] = [
            reviews.filter(
                ({ review_source }) => review_source === "GooglePlayStore"
            ),
            reviews.filter(({ review_source }) => review_source === "iTunes"),
        ];

        const totalRatings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        const totalPlayStore = google.reduce(
            (acc, curr) => {
                acc[curr.rating]++;
                return acc;
            },
            { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        );
        const totaliTunes = iTunes.reduce(
            (acc, curr) => {
                acc[curr.rating]++;
                return acc;
            },
            { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        );

        return {
            totalPlayStore,
            totaliTunes,
        };
    }

    async createNewReview(review) {
        review.reviewed_date = new Date().toISOString();
        return await this.model.save(review);
    }
}

module.exports = ReviewService;
