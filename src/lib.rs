use pretty_yaml::{config::FormatOptions, format_text};
use wasm_bindgen::prelude::*;

mod config;
use config::LayoutConfig;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Config")]
    pub type Config;
}

/// Formats a YAML string with optional configuration.
#[wasm_bindgen]
pub fn format(
    #[wasm_bindgen(param_description = "The YAML code to format")] input: &str,
    #[wasm_bindgen(param_description = "Optional formatter config")] config: Option<Config>,
) -> Result<String, String> {
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
