const os = require("os");
const ReviewsModel = require("./reviews");
const DAO = require("../db/DAO");

jest.mock("../db/DAO"); // SoundPlayer is now a mock constructor

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    DAO.mockClear();
});

describe("Review model: ", () => {
    it("should return all reviews", async () => {
        const review = `
{"review":"Pero deberia de poder cambiarle el idioma a alexa","author":"WarcryxD","review_source":"iTunes","rating":4,"title":"Excelente","product_name":"Amazon Alexa","reviewed_date":"2018-01-12T02:27:03.000Z"}
        `;
        const mockRead = jest.fn();

        DAO.prototype.read = mockRead;

        mockRead.mockReturnValue(Promise.resolve(review));

        const reviewModel = new ReviewsModel(new DAO());
        const result = await reviewModel.findAll();

        const mockDAO = DAO.mock.instances[0];
        expect(mockDAO.read).toHaveBeenCalled();

        expect(result.length).toEqual(1);
        expect(result[0].author).toEqual("WarcryxD");
    });
    it("should return save a review", async () => {
        const expectedReviews = `
{"review":"Pero deberia de poder cambiarle el idioma a alexa","author":"WarcryxD","review_source":"iTunes","rating":4,"title":"Excelente","product_name":"Amazon Alexa","reviewed_date":"2018-01-12T02:27:03.000Z"}
        `;

        const newReview = {
            rating: 1,
            review: "football",
            review_source: "iTunes",
            reviewed_date: "2018-01-12T02:27:03.000Z",
        };
        const mockRead = jest.fn();
        const mockInsert = jest.fn();

        DAO.prototype.read = mockRead;
        DAO.prototype.insert = mockInsert;

        mockRead.mockReturnValue(Promise.resolve(expectedReviews));
        mockRead.mockReturnValue(
            Promise.resolve(
                `${expectedReviews}${os.EOL}${JSON.stringify(newReview)}`
            )
        );

        const reviewModel = new ReviewsModel(new DAO());
        await reviewModel.save(newReview);
        const result = await reviewModel.findAll();

        const mockDAO = DAO.mock.instances[0];
        expect(mockDAO.insert).toHaveBeenCalledWith(
            JSON.stringify(newReview) + os.EOL
        );
        expect(result.length).toEqual(2);
        expect(result[1]).toEqual(newReview);
    });
});
