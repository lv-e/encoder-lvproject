#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const shelljs_1 = __importStar(require("shelljs"));
const path_1 = require("path");
const fs_1 = require("fs");
const helpers_1 = require("./helpers");
let cli = meow_1.default(`
    Usage
    $ lv-encoder-lvproject [verbose|help] -i <path-to-target-project> -o <path-to-copy-encoded-files>
`, { flags: {
        input: { type: 'string', alias: 'i' },
        output: { type: 'string', alias: 'o' }
    } });
let vflag = false;
if (cli.input[0] == "help") {
    cli.showHelp();
    shelljs_1.exit(0);
}
else if (cli.input[0] == "verbose") {
    vflag = true;
}
let path = cli.flags.input;
let json = fs_1.readFileSync(path, "utf-8");
const project = JSON.parse(json);
helpers_1.log(vflag, "project version is " + project.header.version);
const engineFolder = "lv-source";
const engineRepo = project.header.engine.repo;
const engineRepoName = "engine";
const enginePath = path_1.join("/tmp", engineFolder, engineRepoName);
if (!shelljs_1.default.which('git')) {
    helpers_1.log(vflag, "can't find git!");
    shelljs_1.exit(1);
}
function engineAvailable() {
    return shelljs_1.default.test('-e', path_1.join(enginePath, ".git"));
}
function downloadEngine() {
    helpers_1.log(vflag, "downloading engine from remote (" + engineRepo + ")");
    shelljs_1.default.cd("/tmp");
    shelljs_1.default.mkdir("-p", engineFolder);
    shelljs_1.default.cd(engineFolder);
    shelljs_1.default.exec("git clone --no-checkout -q " + engineRepo);
    shelljs_1.default.cd(engineRepoName);
    shelljs_1.default.exec("git config core.sparseCheckout true");
    shelljs_1.default.exec("echo \"src/*\"> .git/info/sparse-checkout");
}
function checkoutCorrectVersion() {
    helpers_1.log(vflag, "loading engine's correct version (" + project.header.engine.tag + ")");
    shelljs_1.default.cd(enginePath);
    shelljs_1.default.exec("git reset --hard -q");
    shelljs_1.default.exec("git fetch --all --tags -q");
    shelljs_1.default.exec("git checkout -q " + project.header.engine.tag);
}
function moveFiles() {
    const finalDir = path_1.join(cli.flags.output, "lv-engine");
    helpers_1.log(vflag, "moving engine files to -o folder (" + finalDir + ")");
    helpers_1.createDirs(finalDir);
    shelljs_1.default.cd(path_1.join(enginePath, "src"));
    shelljs_1.default.exec("cp -r . " + finalDir);
}
if (!engineAvailable())
    downloadEngine();
checkoutCorrectVersion();
moveFiles();
