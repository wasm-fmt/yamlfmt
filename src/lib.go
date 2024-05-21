package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/google/yamlfmt/formatters/basic"
)

func newFormatter(config *basic.Config) *basic.BasicFormatter {
	return &basic.BasicFormatter{
		Config:   config,
		Features: basic.ConfigureFeaturesFromConfig(config),
	}
}

func Format(inputString string, configString string) ([]byte, error) {
	inputBytes := []byte(inputString)
	configBytes := []byte(configString)

	config := basic.DefaultConfig()
	err := json.Unmarshal(configBytes, &config)
	if err != nil {
		return nil, err
	}

	f := newFormatter(config)
	return f.Format(inputBytes)
}

func jsFormat(this js.Value, args []js.Value) any {
	input := args[0].String()
	config := args[1].String()

	output, err := Format(input, config)
	if err != nil {
		return []any{true, err.Error()}
	}

	return []any{false, string(output)}
}

func main() {
	done := make(chan bool)
	js.Global().Set("format", js.FuncOf(jsFormat))
	<-done
}
