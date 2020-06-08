import * as lv from "@lv-game-editor/lv-cli"
import rimraf from 'rimraf'
import fs from 'fs'
import shell from "shelljs"

export const defaultWorkingDir = "encode-lvproject_lv-engine"

export function findRepoName(repo:string) : string {
    const regex = /.*\/(.*)\.git/
    const data = repo.match(regex)
    if (data == null)
        throw new Error("can't get a lock on engine's name!")
    return data[1]
}

export function downloadEngine(def:lv.engineDefinition, workingDirName:string){

    const repoName       = findRepoName(def.repo)
    const workingDirPath = `/tmp/${workingDirName}/`
    const repoPath       = `/tmp/${workingDirName}/${repoName}/`

    function checkoutTag(flavor:{then:string}){
        shell.exec("git reset --hard -q")
        shell.exec("git fetch --all --tags -q")
        shell.exec("git checkout -q " + def.tag)
        console.log(`${flavor.then}! now on ${def.tag}`)
    }

    function cloneRepo(){
        shell.mkdir("-p", workingDirPath)
        shell.cd(workingDirPath)
    
        console.log(`cloning the engine from ${def.repo}`)
        shell.exec("git clone --no-checkout -q " + def.repo)
        shell.cd(repoName)
    
        console.log("configuring sparse checkout to look into /lv-engine/*")
        shell.exec("git config core.sparseCheckout true")
        shell.exec("echo \"lv-engine/*\"> .git/info/sparse-checkout")
    }

    if (fs.existsSync(repoPath)) {
        try {
            
            shell.cd(repoPath)
            console.log("checking if current checkout can be used...")
            const actualRepoName = shell.exec("git config --get remote.origin.url").stdout.trim()

            if (actualRepoName != def.repo){
                console.log("repo name doesn't match!")
                console.log(`-> actual: ${actualRepoName} required: ${def.repo}`)
                console.log("starting from scratch...")
                throw new Error()
            }
            checkoutTag({then:"yep"})
            return

        } catch (Error) {
            console.log("can't reuse engine. will restarting everything...")
            rimraf.sync(repoPath)
        }
    } 

    cloneRepo()
    checkoutTag({then:"done"})
}