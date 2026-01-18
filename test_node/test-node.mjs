#!/usr/bin/env node --test
import assert from "node:assert/strict";
import { glob, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { format } from "../pkg/yamlfmt_node.js";
import { parseConfigToml, stripInstaSnapshotHeader } from "../test_utils/fmt_utils.mjs";

const specs_root = fileURLToPath(import.meta.resolve("../tests/fmt"));

for await (const spec_path of glob("**/*.yaml", { cwd: specs_root })) {
	if (spec_path.startsWith(".")) {
		continue;
	}

	const input_path = path.join(specs_root, spec_path);
	const dir_path = path.dirname(input_path);
	const file_stem = path.basename(input_path, ".yaml");
	const config_path = path.join(dir_path, "config.toml");

	const [input, configText] = await Promise.all([
		readFile(input_path, "utf-8"),
		readFile(config_path, "utf-8").catch(() => null),
	]);

	const cases = configText
		? [...parseConfigToml(configText).entries()].map(([optionName, config]) => ({
				optionName,
				config,
			}))
		: [{ optionName: null, config: null }];

	for (const { optionName, config } of cases) {
		const snapshotSuffix = optionName ? `.${optionName}` : "";
		const testSuffix = optionName ? `#${optionName}` : "";

		const expectedPath = path.join(dir_path, `${file_stem}${snapshotSuffix}.snap`);
		const expected = stripInstaSnapshotHeader(await readFile(expectedPath, "utf-8"));

		test(`${spec_path}${testSuffix}`, () => {
			const actual = format(input, config);
			assert.strictEqual(actual, expected);

			if ((config?.trimTrailingWhitespaces ?? true) === true) {
				assert.ok(!actual.includes(" \n"), `'${spec_path}' has trailing whitespaces`);
			}

			const second = format(actual, config);
			assert.strictEqual(second, actual);
		});
	}
}
