use pretty_yaml::format_text;

mod config;
use config::YamlConfig;

/// Formats a YAML string with optional configuration.
#[bridge::formatter]
fn format(source: &str, config: &YamlConfig) -> Result<String, String> {
    format_text(source, config.options()).map_err(|err| err.to_string())
}
