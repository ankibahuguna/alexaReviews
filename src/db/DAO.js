const fsp = require("fs").promises;
const fs = require("fs");


class DB {
    constructor(filepath) {
        if (!fs.existsSync(filepath)) {
            throw new Error(`${filepath} doens't exist`);
        }

        this.filepath = filepath;
    }

    async read() {
        return fsp.readFile(this.filepath, "utf8");
    }

    async insert(data) {
        console.log(`Inserting into ${this.filepath} : ${data}`);
        return fsp.appendFile(this.filepath, data);
    }
}

module.exports = DB;
