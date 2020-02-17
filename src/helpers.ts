import path = require("path");
import { existsSync, mkdirSync } from "fs";

export function createDirs(filePath:string) {
    const dir = path.dirname(filePath);
    if (existsSync(dir)) return true;
    createDirs(dir);
    mkdirSync(dir);
}