[![Test](https://github.com/wasm-fmt/yamlfmt/actions/workflows/test.yml/badge.svg)](https://github.com/wasm-fmt/yamlfmt/actions/workflows/test.yml)

# Install

[![npm](https://img.shields.io/npm/v/@wasm-fmt/yamlfmt?color=cb171e)](https://www.npmjs.com/package/@wasm-fmt/yamlfmt)

```bash
npm install @wasm-fmt/yamlfmt
```

[![jsr.io](https://jsr.io/badges/@fmt/yamlfmt?color=cb171e)](https://jsr.io/@fmt/yamlfmt)

```bash
npx jsr add @fmt/yamlfmt
```

# Usage

## Node.js / Deno / Bun / Bundler

```javascript
import { format } from "@wasm-fmt/yamlfmt";

const input = `- a
- b
`;

const formatted = format(input);
console.log(formatted);
```

## Web

For web environments, you need to initialize WASM module manually:

```javascript
import init, { format } from "@wasm-fmt/yamlfmt/web";

await init();

const input = `- a
- b
`;

const formatted = format(input);
console.log(formatted);
```

### Vite

```JavaScript
import init, { format } from "@wasm-fmt/yamlfmt/vite";

await init();
// ...
```

## Entry Points

- `.` - Auto-detects environment (Node.js uses node, Webpack uses bundler, default is ESM)
- `./node` - Node.js environment (no init required)
- `./esm` - ESM environments like Deno (no init required)
- `./bundler` - Bundlers like Webpack (no init required)
- `./web` - Web browsers (requires manual init)
- `./vite` - Vite bundler (requires manual init)

# Credits

Thanks to:

- The [pretty_yaml](https://github.com/g-plane/pretty_yaml) project
