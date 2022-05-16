const ReviewService = require("./reviews.service");
const ReviewsModel = require("../models/reviews");
const DAO = require("../db/DAO");

jest.mock("../models/reviews"); // SoundPlayer is now a mock constructor
jest.mock("../db/DAO"); // SoundPlayer is now a mock constructor

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    ReviewsModel.mockClear();
});

describe("Review service: ", () => {
    it("getAllReviews should retrieve reviews from model", async () => {
        const reviewService = new ReviewService(new ReviewsModel(new DAO()));
        await reviewService.getAllReviews({});

        const mockReviewModel = ReviewsModel.mock.instances[0];

        expect(mockReviewModel.findAll).toHaveBeenCalled();
    });

    it("getAverageMonthlyRatingsByStore should return average monthly ratings per store", async () => {
        const expectedReviews = [
            {
                review: "Pero deberia de poder cambiarle el idioma a alexa",
                author: "WarcryxD",
                review_source: "iTunes",
                rating: 4,
                title: "Excelente",
                product_name: "Amazon Alexa",
                reviewed_date: "2018-01-12T02:27:03.000Z",
            },
            {
                rating: 1,
                review: "football",
                review_source: "iTunes",
                reviewed_date: "2018-01-12T02:27:03.000Z",
            },
            {
                rating: 4,
                review: "football",
                review_source: "iTunes",
                reviewed_date: "2018-11-12T02:27:03.000Z",
            },
            {
                rating: 2,
                review: "football",
                review_source: "iTunes",
                reviewed_date: "2018-11-12T02:27:03.000Z",
            },
            {
                rating: 1,
                review: "test Rrevie",
                review_source: "GooglePlayStore",
                reviewed_date: "2018-11-12T02:27:03.000Z",
            },
            {
                rating: 5,
                review: "test Rrevie",
                review_source: "GooglePlayStore",
                reviewed_date: "2018-01-12T02:27:03.000Z",
            },
        ];
        const mockFindAll = jest.fn();

        ReviewsModel.prototype.findAll = mockFindAll;

        mockFindAll.mockReturnValue(Promise.resolve(expectedReviews));

        const reviewService = new ReviewService(new ReviewsModel(new DAO()));
        const result = await reviewService.getAverageMonthlyRatingsByStore();

        const mockReviewModel = ReviewsModel.mock.instances[0];
        expect(mockReviewModel.findAll).toHaveBeenCalled();

        expect(Object.keys(result).sort()).toEqual(
            ["itunes", "GooglePlayStore"].sort()
        );

        expect(result.itunes[0]).toEqual(2.5);
        expect(result.GooglePlayStore[0]).toEqual(5);
        expect(result.GooglePlayStore[10]).toEqual(1);
        expect(result.itunes[10]).toEqual(3);
    });

    it("createNewReview should add a new review", async () => {
        const reviews = [
            {
                rating: 1,
                review: "football",
                review_source: "iTunes",
                reviewed_date: "2018-11-12T02:27:03.000Z",
            },
        ];

        const newReview = {
            rating: 3,
            review: "Test Review",
            review_source: "iTunes",
        };

        const mockFindAll = jest.fn();
        const mockSave = jest.fn();

        ReviewsModel.prototype.findAll = mockFindAll;
        ReviewsModel.prototype.save = mockSave;

        mockFindAll.mockReturnValue(Promise.resolve(reviews));
        mockSave.mockReturnValue(Promise.resolve(reviews.push(newReview)));

        const reviewService = new ReviewService(new ReviewsModel(new DAO()));

        await reviewService.createNewReview(newReview);
        const results = await reviewService.getAllReviews({});

        const mockReviewModel = ReviewsModel.mock.instances[0];
        expect(mockReviewModel.save).toHaveBeenCalled();
        expect(mockReviewModel.save).toHaveBeenCalledWith(newReview);
        expect(results[1]).toEqual(newReview);
    });

    it("should get count of each of rating per store", async () => {
        const expectedReviews = [
            {
                review: "Pero deberia de poder cambiarle el idioma a alexa",
                author: "WarcryxD",
                review_source: "iTunes",
                rating: 4,
                title: "Excelente",
                product_name: "Amazon Alexa",
                reviewed_date: "2018-01-12T02:27:03.000Z",
            },
            {
                rating: 1,
                review: "football",
                review_source: "iTunes",
                reviewed_date: "2018-01-12T02:27:03.000Z",
            },
            {
                rating: 4,
                review: "football",
                review_source: "iTunes",
                reviewed_date: "2018-11-12T02:27:03.000Z",
            },
            {
                rating: 2,
                review: "football",
                review_source: "iTunes",
                reviewed_date: "2018-11-12T02:27:03.000Z",
            },
            {
                rating: 1,
                review: "test Rrevie",
                review_source: "GooglePlayStore",
                reviewed_date: "2018-11-12T02:27:03.000Z",
            },
            {
                rating: 5,
                review: "test Rrevie",
                review_source: "GooglePlayStore",
                reviewed_date: "2018-01-12T02:27:03.000Z",
            },
        ];
        const mockFindAll = jest.fn();

        ReviewsModel.prototype.findAll = mockFindAll;

        mockFindAll.mockReturnValue(Promise.resolve(expectedReviews));

        const reviewService = new ReviewService(new ReviewsModel(new DAO()));
        const result = await reviewService.getCountOfRatingsByStore();

        const mockReviewModel = ReviewsModel.mock.instances[0];
        expect(mockReviewModel.findAll).toHaveBeenCalled();

        expect(Object.keys(result).sort()).toEqual(
            ["totalPlayStore", "totaliTunes"].sort()
        );

        expect(result.totalPlayStore[1]).toEqual(1);
        expect(result.totalPlayStore[2]).toEqual(0);
        expect(result.totalPlayStore[3]).toEqual(0);
        expect(result.totalPlayStore[4]).toEqual(0);
        expect(result.totalPlayStore[5]).toEqual(1);

        expect(result.totaliTunes[1]).toEqual(1);
        expect(result.totaliTunes[2]).toEqual(1);
        expect(result.totaliTunes[3]).toEqual(0);
        expect(result.totaliTunes[4]).toEqual(2);
        expect(result.totaliTunes[5]).toEqual(0);
    });
});
