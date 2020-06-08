#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verbose = void 0;
const fs_ops_1 = require("./fs-ops");
const git_ops_1 = require("./git-ops");
const process_1 = require("process");
const path_1 = require("path");
const meow_1 = __importDefault(require("meow"));
const testing = (process.env.NODE_ENV === 'test');
exports.verbose = testing ? true : false;
if (!testing) {
    let cli = meow_1.default(`
        Usage
        $ lv-encoder-lvproject [verbose|help] -i <path-to-target-project> -o <path-to-copy-encoded-files>
    `, { flags: {
            input: { type: 'string', alias: 'i' },
            output: { type: 'string', alias: 'o' }
        } });
    if (cli.input[0] == "help") {
        cli.showHelp();
        process_1.exit();
    }
    else if (cli.input[0] == "verbose") {
        exports.verbose = true;
    }
    const project = fs_ops_1.readProjectFile(cli.flags.input);
    const finalDestination = path_1.join(cli.flags.output, "lv-engine");
    git_ops_1.downloadEngine(project.header.engine, git_ops_1.defaultWorkingDir);
    fs_ops_1.moveEngine(project.header.engine, git_ops_1.defaultWorkingDir, finalDestination);
}
