#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
let cli = meow_1.default("", { flags: {
        input: { type: 'string', alias: 'i' },
        output: { type: 'string', alias: 'o' }
    } });
// STEP: parse file, validating format
/*
const jsonString = readFileSync(cli.flags.input, "utf8")
const data:LVCodeFile = JSON.parse(jsonString)

// STEP: check header version

if (semver.gt(data.header.version, version)) {
    fail("file version (" + data.header.version + ")"
    + " is newer than this tool (need an updated editor version?)")
}

if (semver.lt(data.header.version, baseline)) {
    fail("file version (" + data.header.version + ")"
    + " is now deprecated (maybe use an older editor version?)")
}

// STEP: generate output based on flavor
let encode:encoded = {
    declarations: data.body.declarations.code,
    on_awake: data.body.on_awake.code,
    on_enter: data.body.on_enter.code,
    on_frame: data.body.on_frame.code,
    on_exit: data.body.on_exit.code,
}

// STEP: write response to file
let response = JSON.stringify(encode, null, " ") + "\n"
createSubdirs(cli.flags.output)
writeFileSync(cli.flags.output, response)
*/
console.log("encoding game project at " + cli.flags.input);
