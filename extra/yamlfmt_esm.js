/* @ts-self-types="./yamlfmt.d.ts" */
// prettier-ignore
import source wasmModule from "./yamlfmt_bg.wasm";

import * as import_bg from "./yamlfmt_bg.js";
const { __wbg_set_wasm, format, ...wasmImport } = import_bg;

function getImports() {
	return {
		__proto__: null,
		"./yamlfmt_bg.js": wasmImport,
	};
}

const instance = new WebAssembly.Instance(wasmModule, getImports());

/**
 * @import * as WASM from "./yamlfmt_bg.wasm"
 */

/**
 * @type {WASM}
 */
const wasm = instance.exports;
__wbg_set_wasm(wasm);

export { format };
