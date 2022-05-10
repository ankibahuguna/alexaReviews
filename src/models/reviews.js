const os = require("os");

class ReviewModel {
    constructor(db) {
        this.db = db;
    }

    _formatReviews(review) {
        return review
            .split("\n")
            .filter((v) => v.trim() !== "")
            .map(JSON.parse);
    }

    async findAll() {
        const data = await this.db.read();

        return this._formatReviews(data);
    }

    async save(review) {
        const reviewString = JSON.stringify(review) + os.EOL;
        const data = await this.db.insert(reviewString);
        return;
    }
}
module.exports = ReviewModel;
