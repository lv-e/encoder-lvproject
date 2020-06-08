#!/usr/bin/env node
'use strict'

import { readProjectFile, moveEngine} from "./fs-ops";
import { downloadEngine } from "./git-ops";
import { exit } from "process";
import { join } from "path";
import meow from "meow";

let cli = meow(`
    Usage
    $ lv-encoder-lvproject [verbose|help] -i <path-to-target-project> -o <path-to-copy-encoded-files>
`,{ flags: {
    input:  { type: 'string', alias: 'i'},
    output: { type: 'string', alias: 'o'}
}})

export let verbose = false

if (cli.input[0] == "help") {
    cli.showHelp()
    exit()
} else if (cli.input[0] == "verbose") {
    verbose = true
}

const project = readProjectFile(cli.flags.input)
const finalDestination = join(cli.flags.output, "lv-engine")

downloadEngine(project.header.engine)
moveEngine(project.header.engine, finalDestination)