#!/usr/bin/env node
import process from "node:process";
import path from "node:path";
import fs from "node:fs";

const pkg_path = path.resolve(process.cwd(), process.argv[2]);
const pkg_text = fs.readFileSync(pkg_path, { encoding: "utf-8" });
const pkg_json = JSON.parse(pkg_text);

delete pkg_json.files;

pkg_json.main = pkg_json.module;
pkg_json.type = "module";
pkg_json.publishConfig = {
	access: "public",
};
pkg_json.exports = {
	// Deno
	// - 2.6 supports wasm source phase imports
	// - 2.1 support wasm instance phase imports
	// Node.js
	// - 24.5.0 unflag source phase imports for webassembly
	// - 24.0.0 supports source phase imports for webassembly
	// - 22.19.0 backport source/instance phase imports for webassembly
	".": {
		types: "./yamlfmt.d.ts",
		webpack: "./yamlfmt.js",
		deno: "./yamlfmt.js",
		// CJS supports
		"module-sync": "./yamlfmt_node.js",
		default: "./yamlfmt_esm.js",
	},
	"./esm": {
		types: "./yamlfmt.d.ts",
		default: "./yamlfmt_esm.js",
	},
	"./node": {
		types: "./yamlfmt.d.ts",
		default: "./yamlfmt_node.js",
	},
	"./bundler": {
		types: "./yamlfmt.d.ts",
		default: "./yamlfmt.js",
	},
	"./web": {
		types: "./yamlfmt_web.d.ts",
		default: "./yamlfmt_web.js",
	},
	"./vite": {
		types: "./yamlfmt_web.d.ts",
		default: "./yamlfmt_vite.js",
	},
	"./wasm": "./yamlfmt_bg.wasm",
	"./package.json": "./package.json",
	"./*": "./*",
};
pkg_json.sideEffects = ["./yamlfmt.js", "./yamlfmt_node.js", "./yamlfmt_esm.js"];

fs.writeFileSync(pkg_path, JSON.stringify(pkg_json, null, "\t"));

// JSR
const jsr_path = path.resolve(pkg_path, "..", "jsr.jsonc");
pkg_json.name = "@fmt/yamlfmt";
pkg_json.exports = {
	".": "./yamlfmt.js",
	"./esm": "./yamlfmt_esm.js",
	"./node": "./yamlfmt_node.js",
	"./bundler": "./yamlfmt.js",
	"./web": "./yamlfmt_web.js",
	// jsr does not support imports from wasm?init
	// "./vite": "./yamlfmt_vite.js",
};
pkg_json.exclude = ["!**", "*.tgz"];
fs.writeFileSync(jsr_path, JSON.stringify(pkg_json, null, "\t"));

const yamlfmt_path = path.resolve(path.dirname(pkg_path), "yamlfmt.js");
prependTextToFile('/* @ts-self-types="./yamlfmt.d.ts" */\n', yamlfmt_path);

const yamlfmt_d_ts_path = path.resolve(path.dirname(pkg_path), "yamlfmt.d.ts");
const doc_path = path.resolve(import.meta.dirname, "doc.d.ts");
const doc_text = fs.readFileSync(doc_path, { encoding: "utf-8" });
prependTextToFile(doc_text + "\n", yamlfmt_d_ts_path);

function prependTextToFile(text, filePath) {
	const originalContent = fs.readFileSync(filePath, { encoding: "utf-8" });
	const newContent = text + originalContent;
	fs.writeFileSync(filePath, newContent);
}
