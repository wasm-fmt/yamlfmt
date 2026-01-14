function indexOfUnquoted(line, char) {
	let inString = false;
	let escaped = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (ch === "\\") {
			escaped = true;
			continue;
		}
		if (ch === '"') {
			inString = !inString;
			continue;
		}
		if (!inString && ch === char) {
			return i;
		}
	}
	return -1;
}

function stripTomlComments(line) {
	const idx = indexOfUnquoted(line, "#");
	return idx === -1 ? line : line.slice(0, idx);
}

function parseTomlValue(raw) {
	if (raw.startsWith('"') && raw.endsWith('"')) {
		return JSON.parse(raw);
	}
	if (raw === "true") return true;
	if (raw === "false") return false;
	if (/^-?\d+$/.test(raw)) return Number(raw);
	throw new Error(`unsupported TOML value: ${raw}`);
}

export function parseConfigToml(text) {
	const tables = new Map();
	let currentObj = null;

	for (const rawLine of text.split(/\r?\n/)) {
		const line = stripTomlComments(rawLine).trim();
		if (!line) continue;

		const headerMatch = line.match(/^\[([^\]]+)\]$/);
		if (headerMatch) {
			currentObj = {};
			tables.set(headerMatch[1], currentObj);
			continue;
		}

		if (!currentObj) {
			throw new Error("TOML key/value before any table header");
		}

		const eqIndex = indexOfUnquoted(line, "=");
		if (eqIndex === -1) {
			throw new Error(`invalid TOML line: ${line}`);
		}

		let keyRaw = line.slice(0, eqIndex).trim();
		const valueRaw = line.slice(eqIndex + 1).trim();
		if (keyRaw.startsWith('"') && keyRaw.endsWith('"')) {
			keyRaw = JSON.parse(keyRaw);
		}
		const value = parseTomlValue(valueRaw);
		currentObj[String(keyRaw)] = value;
	}

	return tables;
}

export function stripInstaSnapshotHeader(text) {
	if (!text.startsWith("---\nsource:")) return text;
	const marker = "\n---\n";
	const idx = text.indexOf(marker);
	if (idx === -1) return text;
	return text.slice(idx + marker.length);
}
