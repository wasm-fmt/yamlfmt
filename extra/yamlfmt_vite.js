import initAsync from "./yamlfmt.js";
import wasm from "./yamlfmt_bg.wasm?url";

export default function __wbg_init(input = { module_or_path: wasm }) {
    return initAsync(input);
}

export * from "./yamlfmt.js";
