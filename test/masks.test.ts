import { describe, expect, it } from 'vitest';
import {
	formatBRLFromCents,
	formatCNPJ,
	formatCPF,
	formatDateBR,
	formatDateTimeBR,
	formatNumberBR,
	formatPhoneE164,
	isCNPJValid,
	isCPFValid,
	maskBRLInput,
	maskCEPInput,
	maskDateBRInput,
	maskDecimalBRInput,
	maskPhoneBRInput,
	parseBRLToCents,
	parseCEP,
	parseDateBR,
	parseDateTimeBR,
	parseNumberBR,
	parsePhoneBR,
} from '../src';

describe('documentos e campos brasileiros', () => {
	it('aplica máscaras parciais e limita os documentos', () => {
		expect(formatCPF('12345678909')).toBe('123.456.789-09');
		expect(formatCPF('1234')).toBe('123.4');
		expect(formatCNPJ('12345678000199')).toBe('12.345.678/0001-99');
		expect(maskCEPInput('12345678')).toBe('12345-678');
		expect(maskPhoneBRInput('11999998888')).toBe('(11) 99999-8888');
	});

	it('faz parsing apenas de CEP e telefone completos', () => {
		expect(parseCEP('12345-678')).toBe('12345678');
		expect(parseCEP('12345')).toBeNull();
		expect(parsePhoneBR('(11) 99999-8888')).toBe('11999998888');
		expect(parsePhoneBR('11999')).toBeNull();
		expect(formatPhoneE164('11999998888')).toBe('+5511999998888');
		expect(formatPhoneE164('123')).toBeNull();
	});

	it('valida CPF e CNPJ pelos dígitos verificadores', () => {
		expect(isCPFValid('529.982.247-25')).toBe(true);
		expect(isCPFValid('111.111.111-11')).toBe(false);
		expect(isCNPJValid('12.345.678/0001-95')).toBe(true);
		expect(isCNPJValid('11.111.111/1111-11')).toBe(false);
	});
});

describe('moeda e números', () => {
	it('mantém BRL em centavos inteiros e aceita valores negativos', () => {
		expect(formatBRLFromCents(123456)).toContain('1.234,56');
		expect(parseBRLToCents('R$ 1.234,56')).toBe(123456);
		expect(parseBRLToCents('-R$ 1.234,56')).toBe(-123456);
		expect(parseBRLToCents(formatBRLFromCents(-123456))).toBe(-123456);
		expect(maskBRLInput('12345')).toContain('123,45');
		expect(parseBRLToCents('1234.56')).toBeNull();
	});

	it('formata e lê somente notação decimal brasileira inequívoca', () => {
		expect(formatNumberBR(1234.5, { minimumFractionDigits: 2 })).toBe('1.234,50');
		expect(parseNumberBR('1.234,50')).toBe(1234.5);
		expect(parseNumberBR('1.234.50')).toBeNull();
		expect(parseNumberBR('-12,3', { decimalScale: 2 })).toBe(-12.3);
		expect(maskDecimalBRInput('1234,567', { decimalScale: 2 })).toBe('1.234,56');
	});
});

describe('datas civis e instantes', () => {
	it('não usa Date para data civil e valida dias reais do calendário', () => {
		expect(maskDateBRInput('29022024')).toBe('29/02/2024');
		expect(parseDateBR('29/02/2024')).toBe('2024-02-29');
		expect(parseDateBR('29/02/2023')).toBeNull();
		expect(formatDateBR('2024-02-29')).toBe('29/02/2024');
		expect(formatDateBR('2024-02-30')).toBeNull();
	});

	it('separa data/hora local de instantâneo ISO com offset', () => {
		expect(parseDateTimeBR('29/02/2024 10:30')).toBe('2024-02-29T10:30:00');
		expect(parseDateTimeBR('29/02/2023 10:30')).toBeNull();
		expect(formatDateTimeBR('2020-01-02T05:06:07Z', { timeZone: 'America/Sao_Paulo' })).toBe(
			'02/01/2020 02:06',
		);
		expect(formatDateTimeBR('2020-01-02T05:06:07')).toBeNull();
	});
});
