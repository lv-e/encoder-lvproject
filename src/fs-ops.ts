import * as lv from "@lv-game-editor/lv-cli"
import { workingDirName, findRepoName } from './git-ops'
import fs from 'fs'
import shell from "shelljs"

export function createDirs(dir:string) {
    if (fs.existsSync(dir)) return
    fs.mkdirSync(dir, { recursive: true })
}

export function readProjectFile(path:string):lv.projectContent{
    let json = fs.readFileSync(path, "utf-8")
    const project:lv.projectContent = JSON.parse(json)
    return project
}

export function moveEngine(def:lv.engineDefinition, destination:string) {
    const repoName = findRepoName(def.repo)
    const engineSourcePath = `/tmp/${workingDirName}/${repoName}/lv-engine/`
    
    createDirs(destination)
    shell.cd(engineSourcePath)
    shell.exec(`cp -r . ${destination}`)
}