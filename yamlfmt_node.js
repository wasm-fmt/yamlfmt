import fs from "node:fs/promises";
import initAsync from "./yamlfmt.js";

const wasm = new URL("./yamlfmt.wasm", import.meta.url);

export default function (init = fs.readFile(wasm)) {
	return initAsync(init);
}

export * from "./yamlfmt.js";
