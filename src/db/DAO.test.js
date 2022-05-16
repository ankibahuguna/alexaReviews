const DAO = require("./DAO");
describe("DAO", () => {
    it("should throw when filename is not supplied", () => {
        expect(() => {
            new DAO();
        }).toThrow(Error);
    });

    it("should store filename in instance variable", () => {
        const dao = new DAO("package.json");

        expect(dao.filepath).toEqual("package.json");
    });
});
