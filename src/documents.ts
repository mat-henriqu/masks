import { onlyDigits } from "./text";
import type { InputValue } from "./types";

const limitDigits = (value: InputValue, limit: number): string =>
  onlyDigits(value).slice(0, limit);

/** Máscara parcial de CPF para inputs controlados. */
export const maskCPFInput = (value: InputValue): string => {
  const digits = limitDigits(value, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

/** Formata CPF completo ou parcial. */
export const formatCPF = maskCPFInput;

/** Lê um CPF completo, mascarado ou não, sem validar seus dígitos verificadores. */
export const parseCPF = (value: InputValue): string | null => {
  const digits = limitDigits(value, 11);
  return digits.length === 11 ? digits : null;
};

/** Valida os dígitos verificadores de um CPF. */
export const isCPFValid = (value: InputValue): boolean => {
  const digits = parseCPF(value);
  if (!digits || /^(\d)\1{10}$/.test(digits)) return false;

  const calculateDigit = (base: string, factor: number): number => {
    const sum = [...base].reduce(
      (total, digit, index) => total + Number(digit) * (factor - index),
      0,
    );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = digits.slice(0, 9);
  return digits === `${base}${calculateDigit(base, 10)}${calculateDigit(`${base}${calculateDigit(base, 10)}`, 11)}`;
};

/** Compatibilidade com a API anterior. */
export const validateCPF = isCPFValid;
export const unmaskCPF = (value: InputValue): string => limitDigits(value, 11);

/** Máscara parcial de CNPJ para inputs controlados. */
export const maskCNPJInput = (value: InputValue): string => {
  const digits = limitDigits(value, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

export const formatCNPJ = maskCNPJInput;
export const parseCNPJ = (value: InputValue): string | null => {
  const digits = limitDigits(value, 14);
  return digits.length === 14 ? digits : null;
};

/** Valida os dígitos verificadores de um CNPJ. */
export const isCNPJValid = (value: InputValue): boolean => {
  const digits = parseCNPJ(value);
  if (!digits || /^(\d)\1{13}$/.test(digits)) return false;

  const calculateDigit = (base: string, weights: readonly number[]): number => {
    const sum = [...base].reduce(
      (total, digit, index) => total + Number(digit) * weights[index],
      0,
    );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = digits.slice(0, 12);
  const first = calculateDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calculateDigit(`${base}${first}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return digits === `${base}${first}${second}`;
};

export const validateCNPJ = isCNPJValid;
export const unmaskCNPJ = (value: InputValue): string => limitDigits(value, 14);

export const maskCPFOrCNPJInput = (value: InputValue): string =>
  onlyDigits(value).length > 11 ? maskCNPJInput(value) : maskCPFInput(value);
export const formatCPFOrCNPJ = maskCPFOrCNPJInput;
export const unmaskCPFOrCNPJ = (value: InputValue): string => {
  const digits = onlyDigits(value);
  return digits.length > 11 ? digits.slice(0, 14) : digits.slice(0, 11);
};
export const parseCPFOrCNPJ = (value: InputValue): string | null =>
  onlyDigits(value).length > 11 ? parseCNPJ(value) : parseCPF(value);

/** Máscara parcial de CEP. */
export const maskCEPInput = (value: InputValue): string => {
  const digits = limitDigits(value, 8);
  return digits.length <= 5 ? digits : `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export const formatCEP = maskCEPInput;
export const unmaskCEP = (value: InputValue): string => limitDigits(value, 8);
export const parseCEP = (value: InputValue): string | null => {
  const digits = unmaskCEP(value);
  return digits.length === 8 ? digits : null;
};

/** Máscara parcial de telefone brasileiro com DDD. */
export const maskPhoneBRInput = (value: InputValue): string => {
  const digits = limitDigits(value, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, -4)}-${digits.slice(-4)}`;
};

export const formatPhoneBR = maskPhoneBRInput;
export const unmaskPhone = (value: InputValue): string => limitDigits(value, 11);
export const parsePhoneBR = (value: InputValue): string | null => {
  const digits = unmaskPhone(value);
  return digits.length === 10 || digits.length === 11 ? digits : null;
};

/** Converte telefone nacional para E.164; retorna null fora dos tamanhos brasileiros aceitos. */
export const formatPhoneE164 = (value: InputValue): string | null => {
  const digits = onlyDigits(value);
  if (/^55\d{10,11}$/.test(digits)) return `+${digits}`;
  if (/^\d{10,11}$/.test(digits)) return `+55${digits}`;
  return null;
};
