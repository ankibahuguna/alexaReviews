const Hapi = require("@hapi/hapi");
// Start application before running the test case

// Stop application after running the test case

describe("Handlers : ", () => {
    test("should fetch all reviews", async function () {
        const server = Hapi.server({
            port: 3000,
            host: "localhost",
        });

        // eslint-disable-next-line global-require
        const Reviews = require("../routes/reviews")();

        server.route(Reviews);
        const options = {
            method: "GET",
            url: "/reviews",
        };
        const data = await server.inject(options);
        expect(data.statusCode).toBe(200);
        expect(Array.isArray(data.result)).toEqual(true);
        const review = data.result.pop();

        expect(typeof review).toEqual("object");
        expect(typeof review.rating).toBe("number");
        expect(typeof review.review).toBe("string");
    });

    test("should fetch count of reviews by stores", async function () {
        const server = Hapi.server({
            port: 3000,
            host: "localhost",
        });

        // eslint-disable-next-line global-require
        const Reviews = require("../routes/reviews")();

        server.route(Reviews);
        const options = {
            method: "GET",
            url: "/total-ratings-by-store",
        };
        const data = await server.inject(options);
        expect(data.statusCode).toBe(200);
        expect(typeof (data.result)).toEqual("object");

        expect(typeof data.result.totalPlayStore).toEqual("object");
        expect(typeof data.result.totaliTunes).toBe("object");
    });


    test("should fetch montly average reviews by store", async function () {
        const server = Hapi.server({
            port: 3000,
            host: "localhost",
        });

        // eslint-disable-next-line global-require
        const Reviews = require("../routes/reviews")();

        server.route(Reviews);
        const options = {
            method: "GET",
            url: "/average-rating-by-month",
        };
        const data = await server.inject(options);
        expect(data.statusCode).toBe(200);
        expect(typeof (data.result)).toEqual("object");

        expect(typeof data.result.itunes).toEqual("object");
        expect(typeof data.result.GooglePlayStore).toBe("object");
    });

    test("should fail if the review doesn't contain rating", async function () {

        const server = Hapi.server({
            port: 3000,
            host: "localhost",
        });

        // eslint-disable-next-line global-require
        const Reviews = require("../routes/reviews")();

        server.route(Reviews);
        const newReview = {
            review_source: 'iTunes',
            author: 'Ankit',
            title: 'Cool'
        }
        const options = {
            method: "POST",
            url: "/reviews",
            payload: JSON.stringify(newReview)
        };
        const data = await server.inject(options);
        expect(data.statusCode).toBe(400);

    });

});
