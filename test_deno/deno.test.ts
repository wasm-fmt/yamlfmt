#!/usr/bin/env deno test --allow-read --parallel
import { assertEquals } from "jsr:@std/assert";
import { expandGlob } from "jsr:@std/fs";
import { fromFileUrl, relative } from "jsr:@std/path";

import { format } from "../pkg/yamlfmt_esm.js";

const specs_root = fromFileUrl(new URL("../test_data", import.meta.url));

for await (const { path: spec_path } of expandGlob("**/*.yaml", {
	root: specs_root,
})) {
	const relativePath = relative(specs_root, spec_path);
	if (relativePath.startsWith(".")) {
		Deno.test({ name: relativePath, ignore: true, fn: () => {} });
		continue;
	}

	const fileText = await Deno.readTextFile(spec_path);
	const expected = await Deno.readTextFile(spec_path + ".snap");

	Deno.test(relativePath, () => {
		const actual = format(fileText);
		assertEquals(actual, expected);
	});
}
