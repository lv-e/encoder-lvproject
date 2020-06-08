"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadEngine = exports.findRepoName = exports.workingDirName = void 0;
const rimraf_1 = __importDefault(require("rimraf"));
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
exports.workingDirName = "encode-lvproject_lv-engine";
function findRepoName(repo) {
    const regex = /.*\/(.*)\.git/;
    const data = repo.match(regex);
    if (data == null)
        throw new Error("can't get a lock on engine's name!");
    return data[1];
}
exports.findRepoName = findRepoName;
function downloadEngine(def) {
    const repoName = findRepoName(def.repo);
    const workingDirPath = `/tmp/${exports.workingDirName}/`;
    const repoPath = `/tmp/${exports.workingDirName}/${repoName}/`;
    function checkoutTag(flavor) {
        shelljs_1.default.exec("git reset --hard -q");
        shelljs_1.default.exec("git fetch --all --tags -q");
        shelljs_1.default.exec("git checkout -q " + def.tag);
        console.log(`${flavor.then}! now on ${def.tag}`);
    }
    function cloneRepo() {
        shelljs_1.default.mkdir("-p", workingDirPath);
        shelljs_1.default.cd(workingDirPath);
        console.log(`cloning the engine from ${def.repo}`);
        shelljs_1.default.exec("git clone --no-checkout -q " + def.repo);
        shelljs_1.default.cd(repoName);
        console.log("configuring sparse checkout to look into /lv-engine/*");
        shelljs_1.default.exec("git config core.sparseCheckout true");
        shelljs_1.default.exec("echo \"lv-engine/*\"> .git/info/sparse-checkout");
    }
    if (fs_1.default.existsSync(repoPath)) {
        try {
            shelljs_1.default.cd(repoPath);
            console.log("checking if current checkout can be used...");
            const actualRepoName = shelljs_1.default.exec("git config --get remote.origin.url").stdout.trim();
            if (actualRepoName != def.repo) {
                console.log("repo name doesn't match!");
                console.log(`-> actual: ${actualRepoName} required: ${def.repo}`);
                console.log("starting from scratch...");
                throw new Error();
            }
            checkoutTag({ then: "yep" });
            return;
        }
        catch (Error) {
            console.log("can't reuse engine. will restarting everything...");
            rimraf_1.default.sync(repoPath);
        }
    }
    cloneRepo();
    checkoutTag({ then: "done" });
}
exports.downloadEngine = downloadEngine;
