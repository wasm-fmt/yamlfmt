import { defineBindings } from "@wasm-fmt/bindgen";

export default defineBindings({
	name: "yamlfmt",
	wasm: "target/wasm32-unknown-unknown/release/yamlfmt.wasm",
	wasmFile: "yamlfmt_bg.wasm",
	adapter: "bindings/yamlfmt_binding.js",
	types: {
		main: "bindings/yamlfmt.d.ts",
	},
	assets: [
		"package.json",
		"jsr.jsonc",
		"README.md",
		"LICENSE-MIT",
		"LICENSE-APACHE",
		"bindings/.npmignore",
		"bindings/yamlfmt_config.d.ts",
	],
	outDir: "pkg",
	clean: true,
});
