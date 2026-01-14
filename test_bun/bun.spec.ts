#!/usr/bin/env bun test
import { Glob } from "bun";
import { expect, test } from "bun:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

import init, { format } from "../pkg/yamlfmt_web.js";

await init();

const specs_root = fileURLToPath(new URL("../test_data", import.meta.url));

for await (const spec_path of new Glob("**/*.yaml").scan({ cwd: specs_root })) {
	if (spec_path.startsWith(".")) {
		test.skip(spec_path, () => {});
		continue;
	}

	const full_path = path.join(specs_root, spec_path);

	const [input, expected] = await Promise.all([Bun.file(full_path).text(), Bun.file(full_path + ".snap").text()]);

	test(spec_path, () => {
		const actual = format(input);
		expect(actual).toBe(expected);
	});
}
