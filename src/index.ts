#!/usr/bin/env node
'use strict'

import meow from "meow";
import shell, { exit } from "shelljs";
import { join, dirname } from "path";
import { mode, projectContent, rootFolders } from "@lv-game-editor/lv-cli"
import { readFileSync } from "fs";
import { createDirs, log } from "./helpers";

let cli = meow(`
    Usage
    $ lv-encoder-lvproject [verbose|help] -i <path-to-target-project> -o <path-to-copy-encoded-files>
`,{ flags: {
    input:  { type: 'string', alias: 'i'},
    output: { type: 'string', alias: 'o'}
}})

let vflag = false

if (cli.input[0] == "help") {
    cli.showHelp()
    exit(0)
} else if (cli.input[0] == "verbose") {
    vflag = true
}

let path = cli.flags.input
let json = readFileSync(path, "utf-8")
const project:projectContent = JSON.parse(json)

log(vflag, "project version is " + project.header.version)

const engineFolder      = "lv-source"
const engineRepo        = project.header.engine.repo
const engineRepoName    = "engine"
const enginePath        = join("/tmp", engineFolder, engineRepoName)

if (!shell.which('git')) {
    log(vflag, "can't find git!")
    exit(1)
}

function engineAvailable() : boolean {
    return shell.test('-e', join(enginePath, ".git"))
}

function downloadEngine(){
    log(vflag, "downloading engine from remote (" + engineRepo + ")")
    shell.cd("/tmp")
    shell.mkdir("-p", engineFolder)
    shell.cd(engineFolder)
    shell.exec("git clone --no-checkout -q " + engineRepo)
    shell.cd(engineRepoName)
    shell.exec("git config core.sparseCheckout true")
    shell.exec("echo \"lv-engine/*\"> .git/info/sparse-checkout")
}

function checkoutCorrectVersion(){
    log(vflag, "loading engine's correct version (" + project.header.engine.tag + ")")
    shell.cd(enginePath)
    shell.exec("git reset --hard -q")
    shell.exec("git fetch --all --tags -q")
    shell.exec("git checkout -q " + project.header.engine.tag)
}

function moveFiles(){
    const finalDir = join(cli.flags.output, "lv-engine")
    log(vflag, "moving engine files to -o folder (" + finalDir + ")")
    createDirs(finalDir)
    shell.cd(join(enginePath, "lv-engine"))
    shell.exec("cp -r . " + finalDir)
}

if(!engineAvailable()) 
    downloadEngine()
checkoutCorrectVersion()
moveFiles()

