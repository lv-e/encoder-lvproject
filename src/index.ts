#!/usr/bin/env node
'use strict'

import meow from "meow";
import shell from "shelljs";
import { join, dirname } from "path";
import { mode, projectContent, rootFolders } from "@lv-game-editor/lv-cli"
import { readFileSync } from "fs";
import { createDirs } from "./helpers";

let cli = meow("",{ flags: {
    input:  { type: 'string', alias: 'i'},
    output: { type: 'string', alias: 'o'}
}})

let path = cli.flags.input
let json = readFileSync(path, "utf-8")
const project:projectContent = JSON.parse(json)

console.log("project version is " + project.header.version)

const engineFolder      = "lv_source"
const engineRepo        = project.header.engine.repo
const engineRepoName    = "engine"
const enginePath        = join("/tmp", engineFolder, engineRepoName)

if (!shell.which('git')) {
    shell.echo("can't find git!")
    shell.exit(1)
}

function engineAvailable() : boolean {
    return shell.test('-e', join(enginePath, ".git"))
}

function downloadEngine(){
    shell.cd("/tmp")
    shell.mkdir("-p", engineFolder)
    shell.cd(engineFolder)
    shell.exec("git clone --no-checkout -q " + engineRepo)
    shell.cd(engineRepoName)
    shell.exec("git config core.sparseCheckout true")
    shell.exec("echo \"src/*\"> .git/info/sparse-checkout")
}

function checkoutCorrectVersion(){
    shell.cd(enginePath)
    shell.exec("git reset --hard -q")
    shell.exec("git fetch --all --tags -q")
    shell.exec("git checkout " + project.header.engine.tag)
}

function moveFiles(){
    const dir = dirname(cli.flags.output)
    createDirs(dir)
    shell.cd(join(enginePath, "src"))
    shell.exec("cp -r . " + dir)
}

if(!engineAvailable()) downloadEngine()
checkoutCorrectVersion()
moveFiles()