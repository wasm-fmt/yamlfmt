import initAsync from "./yamlfmt.js";
import wasm_url from "./yamlfmt.wasm?url";

export default function (input = wasm_url) {
	return initAsync(input);
}

export * from "./yamlfmt.js";
