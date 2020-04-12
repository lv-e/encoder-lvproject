import path = require("path");
import { existsSync, mkdirSync } from "fs";

export function log(verbose:boolean, message:string) {
    if (verbose) console.log(message);
}

export function createDirs(dir:string) {
    if (existsSync(dir)) return true;
    mkdirSync(dir);
}