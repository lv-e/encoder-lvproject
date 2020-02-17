"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
function createDirs(filePath) {
    const dir = path.dirname(filePath);
    if (fs_1.existsSync(dir))
        return true;
    createDirs(dir);
    fs_1.mkdirSync(dir);
}
exports.createDirs = createDirs;
