#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const shelljs_1 = __importDefault(require("shelljs"));
const path_1 = require("path");
const fs_1 = require("fs");
const helpers_1 = require("./helpers");
let cli = meow_1.default("", { flags: {
        input: { type: 'string', alias: 'i' },
        output: { type: 'string', alias: 'o' }
    } });
let path = cli.flags.input;
let json = fs_1.readFileSync(path, "utf-8");
const project = JSON.parse(json);
console.log("project version is " + project.header.version);
const engineFolder = "lv_source";
const engineRepo = project.header.engine.repo;
const engineRepoName = "engine";
const enginePath = path_1.join("/tmp", engineFolder, engineRepoName);
if (!shelljs_1.default.which('git')) {
    shelljs_1.default.echo("can't find git!");
    shelljs_1.default.exit(1);
}
function engineAvailable() {
    return shelljs_1.default.test('-e', path_1.join(enginePath, ".git"));
}
function downloadEngine() {
    shelljs_1.default.cd("/tmp");
    shelljs_1.default.mkdir("-p", engineFolder);
    shelljs_1.default.cd(engineFolder);
    shelljs_1.default.exec("git clone --no-checkout -q" + engineRepo);
    shelljs_1.default.cd(engineRepoName);
    shelljs_1.default.exec("git config core.sparseCheckout true");
    shelljs_1.default.exec("echo \"src/*\"> .git/info/sparse-checkout");
}
function checkoutCorrectVersion() {
    shelljs_1.default.cd(enginePath);
    shelljs_1.default.exec("git reset --hard -q");
    shelljs_1.default.exec("git fetch --all --tags -q");
    shelljs_1.default.exec("git checkout " + project.header.engine.tag);
}
function moveFiles() {
    const dir = path_1.dirname(cli.flags.output);
    helpers_1.createDirs(dir);
    shelljs_1.default.cd(path_1.join(enginePath, "src"));
    shelljs_1.default.exec("cp -r . " + dir);
}
if (!engineAvailable())
    downloadEngine();
checkoutCorrectVersion();
moveFiles();
