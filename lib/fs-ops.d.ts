import * as lv from "@lv-game-editor/lv-cli";
export declare function createDirs(dir: string): void;
export declare function readProjectFile(path: string): lv.projectContent;
export declare function moveEngine(def: lv.engineDefinition, destination: string, workingDir: string): void;
