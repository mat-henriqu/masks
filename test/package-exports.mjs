import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const esm = await import('../dist/index.mjs');
const cjs = require('../dist/index.js');

for (const api of [esm, cjs]) {
	if (api.parseBRLToCents('R$ 1,00') !== 100) {
		throw new Error('A API publicada não carregou corretamente.');
	}
}

console.log('Entradas ESM e CommonJS carregadas com sucesso.');
