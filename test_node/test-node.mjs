import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import init, { format } from "../pkg/yamlfmt_node.js";
import { fileURLToPath } from "node:url";

await init();

const test_root = fileURLToPath(new URL("../test_data", import.meta.url));

for await (const test_file of fs.glob("**/*.yaml", {
	cwd: test_root,
})) {
	if (test_file.startsWith(".")) {
		continue;
	}

	const input_path = path.join(test_root, test_file);

	const [input, expected] = await Promise.all([
		fs.readFile(input_path, { encoding: "utf-8" }),
		fs.readFile(input_path + ".snap", { encoding: "utf-8" }),
	]);

	test(test_file, () => {
		const actual = format(input, test_file);
		assert.equal(actual, expected);
	});
}
