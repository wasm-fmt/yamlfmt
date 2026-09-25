use pretty_yaml::config::{self, FormatOptions};
use serde::Deserialize;

#[bridge::config]
#[derive(Clone, Default)]
pub struct YamlConfig {
    options: FormatOptions,
}

impl bridge::Config for YamlConfig {
    fn decode(bytes: &[u8]) -> Result<Self, String> {
        if bytes.is_empty() {
            return Ok(Self::default());
        }

        let mut options =
            serde_json::from_slice::<FormatOptions>(bytes).map_err(|err| err.to_string())?;
        let layout =
            serde_json::from_slice::<LayoutConfig>(bytes).map_err(|err| err.to_string())?;
        options.layout = layout.into();

        Ok(Self { options })
    }
}

impl YamlConfig {
    pub fn options(&self) -> &FormatOptions {
        &self.options
    }
}

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
