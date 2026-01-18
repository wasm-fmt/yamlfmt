#!/usr/bin/env deno test --allow-read --parallel
import { assertEquals } from "jsr:@std/assert";
import { expandGlob } from "jsr:@std/fs";
import { basename, dirname, fromFileUrl, join, relative } from "jsr:@std/path";

import { format } from "../pkg/yamlfmt_esm.js";
import { parseConfigToml, stripInstaSnapshotHeader } from "../test_utils/fmt_utils.mjs";

const specs_root = fromFileUrl(import.meta.resolve("../tests/fmt"));

for await (const { path: spec_path } of expandGlob("**/*.yaml", {
	root: specs_root,
})) {
	const relativePath = relative(specs_root, spec_path);
	if (relativePath.startsWith(".")) {
		Deno.test({ name: relativePath, ignore: true, fn: () => {} });
		continue;
	}

	const fileText = await Deno.readTextFile(spec_path);
	const dirPath = dirname(spec_path);
	const fileStem = basename(spec_path, ".yaml");
	const configPath = join(dirPath, "config.toml");
	const configText = await Deno.readTextFile(configPath).catch(() => null);

	const cases = configText
		? [...parseConfigToml(configText).entries()].map(([optionName, config]) => ({
				optionName,
				config,
			}))
		: [{ optionName: null, config: null }];

	for (const { optionName, config } of cases) {
		const snapshotSuffix = optionName ? `.${optionName}` : "";
		const testSuffix = optionName ? `#${optionName}` : "";

		const expectedPath = join(dirPath, `${fileStem}${snapshotSuffix}.snap`);
		const expected = stripInstaSnapshotHeader(await Deno.readTextFile(expectedPath));

		Deno.test(`${relativePath}${testSuffix}`, () => {
			const actual = format(fileText, config);
			assertEquals(actual, expected);

			if (((config?.trimTrailingWhitespaces as boolean | undefined) ?? true) === true) {
				if (actual.includes(" \n")) {
					throw new Error(`'${relativePath}' has trailing whitespaces`);
				}
			}

			const second = format(actual, config);
			assertEquals(second, actual);
		});
	}
}
