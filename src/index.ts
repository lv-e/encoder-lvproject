#!/usr/bin/env node
'use strict'

import meow from "meow";
import semver, { SemVer } from "semver";
import { readFileSync, writeFileSync } from "fs";
import { LVCodeFile } from "./types";
import { fail } from "assert";
import { encoded } from "@lv-game-editor/lv-cli"
import { createSubdirs } from "./helpers"

const version   = new SemVer("1.2.0")
const baseline  = new SemVer("1.0.0")

let cli = meow("",{ flags: {
    input:  { type: 'string', alias: 'i'},
    output: { type: 'string', alias: 'o'}
}})

// STEP: parse file, validating format

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
