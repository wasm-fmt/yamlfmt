use pretty_yaml::config;
use serde::Deserialize;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const TS_Config: &'static str = r#"
interface LayoutConfig {
	indent_width?: number;
	line_width?: number;
	line_ending?: "lf" | "crlf";
}

/** Configuration for the YAML formatter */
export interface Config extends LayoutConfig {
	/**
	 *  See {@link https://github.com/g-plane/pretty_yaml/blob/main/docs/config.md}
	 */
	[other: string]: any;
}"#;

#[derive(Deserialize, Clone, Default)]
pub struct LayoutConfig {
    #[serde(alias = "indentWidth")]
    indent_width: Option<usize>,
    #[serde(alias = "lineWidth")]
    line_width: Option<usize>,
    #[serde(alias = "lineEnding")]
    line_ending: Option<LineEnding>,
}

#[derive(Deserialize)]
#[serde(rename_all = "snake_case")]
#[derive(Clone, Copy, Default)]
pub enum LineEnding {
    #[default]
    Lf,
    Crlf,
}

impl From<LayoutConfig> for config::LayoutOptions {
    fn from(value: LayoutConfig) -> Self {
        let mut layout = config::LayoutOptions::default();

        if let Some(line_width) = value.line_width {
            layout.print_width = line_width;
        }

        if let Some(indent_width) = value.indent_width {
            layout.indent_width = indent_width;
        }

        if let Some(line_ending) = value.line_ending {
            layout.line_break = match line_ending {
                LineEnding::Lf => config::LineBreak::Lf,
                LineEnding::Crlf => config::LineBreak::Crlf,
            };
        }

        layout
    }
}
