/**
 * WASM formatter for YAML.
 *
 * @example
 * ```ts
 * import { format } from "@wasm-fmt/yamlfmt";
 *
 * const output = format("key: value");
 * ```
 *
 * @module
 */

import type { ConfigHandle as BridgeConfigHandle } from "@wasm-fmt/runtime";
import type { Config } from "./yamlfmt_config.d.ts";
export type * from "./yamlfmt_config.d.ts";

/** A reusable formatter configuration created inside the WASM instance. */
export type ConfigHandle = BridgeConfigHandle<"yamlfmt">;

export type ConfigInput = Config | ConfigHandle;

/** Formats a YAML string. Omit config or pass `undefined` to use defaults. */
export declare function format(input: string, config?: ConfigInput): string;

/** Formats a YAML string. The path is accepted for the shared formatter API. */
export declare function format(input: string, path?: string, config?: ConfigInput): string;

/** Creates a reusable formatter configuration. */
export declare function createConfig(config?: Config): ConfigHandle;

/** Releases a reusable formatter configuration. */
export declare function releaseConfig(handle: ConfigHandle): void;
