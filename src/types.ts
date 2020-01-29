import { SemVer } from "semver";

export interface Header {
    content_type:"lvcode"
    flavor:("scene"|"support")
    version:SemVer
}

export interface CodeStrip {
    code:string
}

export interface Body {
    declarations:CodeStrip
    on_awake:CodeStrip
    on_enter:CodeStrip
    on_frame:CodeStrip
    on_exit:CodeStrip
}

export interface LVCodeFile {
    header:Header
    body:Body
}