#!/usr/bin/env node --test
import assert from "node:assert/strict";
import { glob, readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { format } from "../pkg/yamlfmt_node.js";

const specs_root = fileURLToPath(new URL("../test_data", import.meta.url));

for await (const spec_path of glob("**/*.yaml", { cwd: specs_root })) {
	if (spec_path.startsWith(".")) {
		continue;
	}

	const input_path = `${specs_root}/${spec_path}`;

	const [input, expected] = await Promise.all([
		readFile(input_path, "utf-8"),
		readFile(input_path + ".snap", "utf-8"),
	]);

	test(spec_path, () => {
		const actual = format(input);
		assert.strictEqual(actual, expected);
	});
}
