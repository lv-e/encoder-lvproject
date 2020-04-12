"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function log(verbose, message) {
    if (verbose)
        console.log(message);
}
exports.log = log;
function createDirs(dir) {
    if (fs_1.existsSync(dir))
        return true;
    fs_1.mkdirSync(dir);
}
exports.createDirs = createDirs;
