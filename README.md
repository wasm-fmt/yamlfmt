[![Test](https://github.com/wasm-fmt/yamlfmt/actions/workflows/test.yml/badge.svg)](https://github.com/wasm-fmt/yamlfmt/actions/workflows/test.yml)

# Install

[![npm](https://img.shields.io/npm/v/@wasm-fmt/yamlfmt?color=e38c00)](https://www.npmjs.com/package/@wasm-fmt/yamlfmt)

```bash
npm install @wasm-fmt/yamlfmt
```

[![jsr.io](https://jsr.io/badges/@fmt/yamlfmt?color=e38c00)](https://jsr.io/@fmt/yamlfmt)

```bash
npx jsr add @fmt/yamlfmt
```

# Usage

```javascript
import init, { format } from "@wasm-fmt/yamlfmt";

await init();

const input = "- a\n- b\n";

const formatted = format(input, "sample.yaml");
console.log(formatted);
```

For Vite users:

Add `"@wasm-fmt/yamlfmt"` to `optimizeDeps.exclude` in your vite config:

```JSON
{
    "optimizeDeps": {
        "exclude": ["@wasm-fmt/yamlfmt"]
    }
}
```

<details>
<summary>
If you cannot change the vite config, you can use another import entry

</summary>

```JavaScript
import init, { format } from "@wasm-fmt/yamlfmt/vite";

// ...
```

</details>
