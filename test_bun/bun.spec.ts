#!/usr/bin/env bun test
import { Glob } from "bun";
import { expect, test } from "bun:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

import init, { format } from "../pkg/yamlfmt_web.js";
import { parseConfigToml, stripInstaSnapshotHeader } from "../test_utils/fmt_utils.mjs";

await init();

const specs_root = fileURLToPath(new URL("../tests/fmt", import.meta.url));

for await (const spec_path of new Glob("**/*.yaml").scan({ cwd: specs_root })) {
	if (spec_path.startsWith(".")) {
		test.skip(spec_path, () => {});
		continue;
	}

	const full_path = path.join(specs_root, spec_path);

	const dir_path = path.dirname(full_path);
	const file_stem = path.basename(full_path, ".yaml");
	const config_path = path.join(dir_path, "config.toml");
	const [input, configText] = await Promise.all([
		Bun.file(full_path).text(),
		Bun.file(config_path)
			.text()
			.catch(() => null),
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
		const expected = stripInstaSnapshotHeader(await Bun.file(expectedPath).text());

		test(`${spec_path}${testSuffix}`, () => {
			const actual = format(input, config);
			expect(actual).toBe(expected);

			if (((config?.trimTrailingWhitespaces as boolean | undefined) ?? true) === true) {
				expect(actual.includes(" \n")).toBe(false);
			}

			const second = format(actual, config);
			expect(second).toBe(actual);
		});
	}
}
