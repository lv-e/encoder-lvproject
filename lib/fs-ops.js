"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveEngine = exports.readProjectFile = exports.createDirs = void 0;
const git_ops_1 = require("./git-ops");
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
function createDirs(dir) {
    if (fs_1.default.existsSync(dir))
        return;
    fs_1.default.mkdirSync(dir, { recursive: true });
}
exports.createDirs = createDirs;
function readProjectFile(path) {
    let json = fs_1.default.readFileSync(path, "utf-8");
    const project = JSON.parse(json);
    return project;
}
exports.readProjectFile = readProjectFile;
function moveEngine(def, workingDir, destination) {
    const repoName = git_ops_1.findRepoName(def.repo);
    const engineSourcePath = `/tmp/${workingDir}/${repoName}/lv-engine/`;
    createDirs(destination);
    shelljs_1.default.cd(engineSourcePath);
    shelljs_1.default.exec(`cp -r . ${destination}`);
}
exports.moveEngine = moveEngine;
