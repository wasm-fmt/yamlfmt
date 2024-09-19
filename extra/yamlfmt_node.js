import fs from "node:fs/promises";
import initAsync from "./yamlfmt.js";

const wasm = new URL("./yamlfmt_bg.wasm", import.meta.url);

export default function __wbg_init(init = { module_or_path: fs.readFile(wasm) }) {
    return initAsync(init);
}

export * from "./yamlfmt.js";
