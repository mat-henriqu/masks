import { toInputString } from './text';
import type { DecimalInputOptions, InputValue, NumberFormatOptions } from './types';

const normalizeScale = (scale: number | undefined, fallback: number): number => {
	const result = scale ?? fallback;
	if (!Number.isInteger(result) || result < 0 || result > 20) {
		throw new RangeError('decimalScale deve ser um inteiro entre 0 e 20.');
	}
	return result;
};

/** Formata um número finito usando vírgula decimal e milhar pt-BR. */
export const formatNumberBR = (value: number, options: NumberFormatOptions = {}): string => {
	if (!Number.isFinite(value)) throw new TypeError('value deve ser um número finito.');
	return new Intl.NumberFormat('pt-BR', {
		minimumFractionDigits: options.minimumFractionDigits,
		maximumFractionDigits: options.maximumFractionDigits,
		useGrouping: options.useGrouping,
	}).format(value);
};

/**
 * Lê somente notação brasileira inequívoca: 1.234,56 ou 1234,56.
 * Ponto decimal no padrão inglês é recusado para não converter valores ambíguos.
 */
export const parseNumberBR = (
	value: InputValue,
	options: DecimalInputOptions = {},
): number | null => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	const text = toInputString(value)
		.trim()
		.replace(/\u00a0/g, ' ');
	if (!text) return null;

	const scale = normalizeScale(options.decimalScale, 20);
	const decimalPattern = scale === 0 ? '' : `(?:,(\\d{1,${scale}}))?`;
	const match = text.match(new RegExp(`^(-)?((?:\\d{1,3}(?:\\.\\d{3})+)|\\d+)${decimalPattern}$`));
	if (!match || (match[1] && options.allowNegative === false)) return null;

	const numeric = Number(`${match[1] ?? ''}${match[2].replace(/\./g, '')}.${match[3] ?? ''}`);
	return Number.isFinite(numeric) && Math.abs(numeric) <= Number.MAX_SAFE_INTEGER ? numeric : null;
};

/** Normaliza a digitação decimal BR, preservando estado parcial como "0,". */
export const maskDecimalBRInput = (
	value: InputValue,
	options: DecimalInputOptions = {},
): string => {
	const scale = normalizeScale(options.decimalScale, 2);
	const source = toInputString(value).trim();
	const negative = options.allowNegative !== false && source.startsWith('-');
	const withoutSign = source.replace(/^-/, '');
	const [integerPart = '', ...decimalParts] = withoutSign.replace(/[^\d,]/g, '').split(',');
	const integer = integerPart.replace(/\D/g, '') || '0';
	const decimal = decimalParts.join('').replace(/\D/g, '').slice(0, scale);
	const hasComma = withoutSign.includes(',') && scale > 0;
	const normalizedInteger = integer.replace(/^0+(?=\d)/, '');
	const grouped =
		options.useGrouping === false
			? normalizedInteger
			: normalizedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	const prefix = negative ? '-' : '';
	return hasComma ? `${prefix}${grouped},${decimal}` : `${prefix}${grouped}`;
};
