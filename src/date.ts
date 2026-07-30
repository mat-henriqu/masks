import { onlyDigits, toInputString } from "./text";
import type { DateParts, InputValue } from "./types";

const isLeapYear = (year: number): boolean => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
const daysInMonth = (year: number, month: number): number =>
  [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;

export const isValidDateParts = ({ year, month, day }: DateParts): boolean =>
  Number.isInteger(year) && year >= 1 && year <= 9999 && Number.isInteger(month) && month >= 1 && month <= 12 &&
  Number.isInteger(day) && day >= 1 && day <= daysInMonth(year, month);

/** Aplica DD/MM/AAAA progressivamente a até oito dígitos. */
export const maskDateBRInput = (value: InputValue): string => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

/** Converte DD/MM/AAAA em YYYY-MM-DD sem criar Date e sem aplicar timezone. */
export const parseDateBR = (value: InputValue): string | null => {
  const match = toInputString(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const parts: DateParts = { day: Number(match[1]), month: Number(match[2]), year: Number(match[3]) };
  if (!isValidDateParts(parts)) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
};

/** Formata uma data civil canônica YYYY-MM-DD como DD/MM/AAAA. */
export const formatDateBR = (value: InputValue): string | null => {
  const match = toInputString(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const parts: DateParts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  return isValidDateParts(parts) ? `${match[3]}/${match[2]}/${match[1]}` : null;
};

export const isDateBRValid = (value: InputValue): boolean => parseDateBR(value) !== null;

/** Compatibilidade com a API anterior, agora usando data civil estrita. */
export const formatDate = (value: InputValue): string => formatDateBR(value) ?? "";
export const unmaskDate = parseDateBR;
