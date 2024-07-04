use pretty_yaml::{
    config::{self, FormatOptions},
    format_text,
};
use serde::Deserialize;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn format(input: &str, _filename: &str, config: Option<Config>) -> Result<String, String> {
    let mut options = config
        .as_ref()
        .map(|x| serde_wasm_bindgen::from_value::<FormatOptions>(x.into()))
        .transpose()
        .map_err(|e| e.to_string())?
        .unwrap_or_default();

    options.layout = config
        .as_ref()
        .map(|x| serde_wasm_bindgen::from_value::<LayoutConfig>(x.into()))
        .transpose()
        .map_err(|e| e.to_string())?
        .unwrap_or_default()
        .into();

    format_text(input, &options).map_err(|e| e.to_string())
}

#[wasm_bindgen(typescript_custom_section)]
const TS_Config: &'static str = r#"
interface LayoutConfig {
	indent_style?: "tab" | "space";
	indent_width?: number;
	line_width?: number;
	line_ending?: "lf" | "crlf";
}"#;

#[wasm_bindgen(typescript_custom_section)]
const TS_Config: &'static str = r#"
export interface Config extends LayoutConfig {
	/**
	 *  See {@link https://github.com/g-plane/pretty_yaml/blob/main/docs/config.md}
	 */
	[other: string]: any;
}"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Config")]
    pub type Config;
}

#[derive(Deserialize, Clone, Default)]
pub struct LayoutConfig {
    #[serde(alias = "indentStyle")]
    indent_style: Option<IndentStyle>,
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
enum IndentStyle {
    Tab,
    #[default]
    Space,
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

        if let Some(indent_style) = value.indent_style {
            layout.use_tabs = matches!(indent_style, IndentStyle::Tab);
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
