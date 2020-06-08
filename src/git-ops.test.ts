import * as lv from "@lv-game-editor/lv-cli"
import fs from 'fs';
import shell from "shelljs"
import rimraf from "rimraf";

import {findRepoName, downloadEngine, workingDirName} from "./git-ops";

describe("findRepoName", () =>{

    it("should be found when valid", () =>{
        const name = findRepoName("https://github.com/lv-e/engine.git")
        expect(name).toBe("engine")
    })

    it("should throw error when invalid", () =>{
        expect( () => {
            findRepoName("https://github.com/lv-e/engine.blitz")
        }).toThrowError()
    })
})

describe("downloadEngine", () =>{

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it("should fail with error for invalid data", () =>{
        expect( () => {
            downloadEngine({repo: "", tag: ""})
        }).toThrowError()
    })

    it("should checkout from github when a local copy is missing", () =>{
        
        const testPath = `/tmp/${workingDirName}/engine`
        const testRepo = "https://github.com/lv-e/engine.git"
        const testTag  = "v0.0.17"

        rimraf.sync(testPath)
        downloadEngine({repo: testRepo, tag: `tags/${testTag}`})

        shell.cd(testPath)
        const actualRepoName = shell.exec("git config --get remote.origin.url").stdout.trim()
        const actualTag = shell.exec("git describe --tags").stdout.trim()

        expect(actualRepoName).toEqual(testRepo)
        expect(actualTag).toEqual(testTag)
    })

    it("should be able to cache and just change tags", () =>{
        
        const testPath = `/tmp/${workingDirName}/engine`
        const testRepo = "https://github.com/lv-e/engine.git"

        const testTagBefore  = "v0.0.16"
        const testTagAfter   = "v0.0.17"

        function testTag(expected:string) {
            const actualTag = shell.exec("git describe --tags").stdout.trim()
            expect(actualTag).toEqual(expected)
        }

        rimraf.sync(testPath)
        downloadEngine({repo: testRepo, tag: `tags/${testTagBefore}`})
        const beforeGitStats = fs.statSync(`${testPath}/.git`)
        shell.cd(testPath)
        testTag(testTagBefore)

        downloadEngine({repo: testRepo, tag: `tags/${testTagAfter}`})
        const afterGitStats = fs.statSync(`${testPath}/.git`)
        shell.cd(testPath)
        testTag(testTagAfter)

        expect(beforeGitStats.birthtimeMs).not.toBeNull()
        expect(beforeGitStats.birthtimeMs).toEqual(afterGitStats.birthtimeMs)
    })


    it("should be able start from scrath when cached repo is unexpected", () =>{

        const testPath = `/tmp/${workingDirName}/engine/`
        rimraf.sync(testPath)

        shell.mkdir("-p", testPath)
        shell.cd(testPath)
        shell.exec("git init")

        const testRepo = "https://github.com/lv-e/engine.git"
        const testTag  = "v0.0.17"

        downloadEngine({repo: testRepo, tag: `tags/${testTag}`})
        const actualTag = shell.exec("git describe --tags").stdout.trim()
        expect(actualTag).toEqual(testTag)
    })
})