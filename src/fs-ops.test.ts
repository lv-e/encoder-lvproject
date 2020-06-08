import * as lv from "@lv-game-editor/lv-cli"
import rimraf from "rimraf";
import fs from 'fs';
import crypto from 'crypto';

import {createDirs, readProjectFile, moveEngine} from "./fs-ops";
import { downloadEngine, defaultWorkingDir } from "./git-ops";

describe("createDirs", () =>{
    it("should be able to create subdirs",  () =>{
        const path = "/tmp/foo/bar/baz/"
        if (fs.existsSync(path)) fs.rmdirSync(path, { recursive: true})
        createDirs(path)
        expect(fs.existsSync(path)).toBe(true)
    })

    it("should not fail when dir already exists",  () =>{    
        expect( () => {
            const path = "/tmp/foo/bar/baz/"
            if (fs.existsSync(path)) fs.rmdirSync(path, { recursive: true})
            createDirs(path)
            createDirs(path)
        }).not.toThrowError()
    })
})

describe("readProjectFile", () =>{
    it("should be able to read",  () =>{

        const testPath = "/tmp/dummy-project.json"
        const dummy:lv.projectContent = {
            header: {
                version: "10.20.30",
                engine: {
                    repo: "https://github.com/lv-e/engine.git",
                    tag: "v3.2.1"
                },
                drivers: [],
                encoders: [],
            }
        }
        
        fs.writeFileSync(testPath, JSON.stringify(dummy))
        const read = readProjectFile(testPath)
        expect(read.header.version).toEqual(dummy.header.version)
        rimraf.sync(testPath)
    })

    it("should not fail when dir already exists",  () =>{    
        expect( () => {
            const path = "/tmp/foo/bar/baz/"
            if (fs.existsSync(path)) fs.rmdirSync(path, { recursive: true})
            createDirs(path)
            createDirs(path)
        }).not.toThrowError()
    })
})

describe("moveEngine", () =>{
    it("should copy all files, recursively",  () =>{

        const salt = crypto.randomBytes(16).toString('hex');
        const testWorkingDir = `${defaultWorkingDir}-${salt}`
        const testPath = `/tmp/${testWorkingDir}/engine/`
        const testDestination = `/tmp/test-destination-${salt}/`
        const testRepo = "https://github.com/lv-e/engine.git"
        const testTag  = "v0.0.17"
        
        let def = {repo: testRepo, tag: `tags/${testTag}`}
        downloadEngine(def, testWorkingDir)
        moveEngine(def, testDestination, testWorkingDir)

        rimraf.sync(testPath)
        rimraf.sync(testDestination)
    })
})