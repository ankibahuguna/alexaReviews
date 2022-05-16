const DAO = require("./DAO");
describe("DAO", () => {
    it("should throw when filename is not supplied", () => {
        expect(() => {
            new DAO();
        }).toThrow(Error);
    });
});
