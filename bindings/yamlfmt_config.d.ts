export interface LayoutConfig {
	indent_width?: number;
	line_width?: number;
	line_ending?: "lf" | "crlf";
}

/** Configuration for the YAML formatter. */
export interface Config extends LayoutConfig {
	/**
	 * See {@link https://github.com/g-plane/pretty_yaml/blob/main/docs/config.md}.
	 */
	[other: string]: any;
}
