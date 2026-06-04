// scripts/generate-env-yaml.js

'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const yamlPath = path.join(rootDir, '.env.yaml');

if (!fs.existsSync(envPath)) {
	console.error('Error: .env file not found in project root.');
	process.exit(1);
}

const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
const yamlLines = [];

for (const line of lines) {
	const trimmed = line.trim();

	if (!trimmed || trimmed.startsWith('#')) continue;

	const eqIndex = trimmed.indexOf('=');
	if (eqIndex === -1) continue;

	const key = trimmed.substring(0, eqIndex).trim();
	const value = trimmed.substring(eqIndex + 1).trim();

	yamlLines.push(`${key}: "${value}"`);
}

if (yamlLines.length === 0) {
	console.error('Error: No valid key=value pairs found in .env.');
	process.exit(1);
}

fs.writeFileSync(yamlPath, yamlLines.join('\n') + '\n', 'utf-8');
console.log(`.env.yaml generated with ${yamlLines.length} variable(s).`);
