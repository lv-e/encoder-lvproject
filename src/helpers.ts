import path = require("path");
import { existsSync, mkdirSync } from "fs";

export function createSubdirs(filePath:string) {
    const dir = path.dirname(filePath);
    if (existsSync(dir)) return true;
    createSubdirs(dir);
    mkdirSync(dir);
}