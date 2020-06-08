import * as lv from "@lv-game-editor/lv-cli"
import fs from 'fs';

import {createDirs, readProjectFile} from "./fs-ops";
import rimraf from "rimraf";

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
