import { onlyDigits, toInputString } from "./text";
import type { InputValue } from "./types";

const assertSafeCents = (cents: number): void => {
  if (!Number.isSafeInteger(cents)) {
    throw new RangeError("centavos deve ser um inteiro seguro.");
  }
};

/** Formata um valor canônico em centavos como BRL. */
export const formatBRLFromCents = (cents: number): string => {
  assertSafeCents(cents);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
};

/**
 * Lê uma moeda BRL completa e inequívoca (ex.: R$ 1.234,56) como centavos.
 * O texto precisa ter exatamente duas casas decimais; entradas ambíguas retornam null.
 */
export const parseBRLToCents = (value: InputValue): number | null => {
  const text = toInputString(value).trim().replace(/\u00a0/g, " ");
  const match = text.match(/^(-)?(?:R\$\s*)?((?:\d{1,3}(?:\.\d{3})+)|\d+),(\d{2})$/);
  if (!match) return null;

  const whole = Number(match[2].replace(/\./g, ""));
  const cents = whole * 100 + Number(match[3]);
  if (!Number.isSafeInteger(cents)) return null;
  return match[1] ? -cents : cents;
};

/** Máscara para campo monetário: os dígitos digitados representam centavos. */
export const maskBRLInput = (value: InputValue): string => {
  const text = toInputString(value).trim();
  const digits = onlyDigits(text);
  const cents = digits ? Number(digits) : 0;
  if (!Number.isSafeInteger(cents)) return "";
  return formatBRLFromCents(text.startsWith("-") ? -cents : cents);
};

/** Compatibilidade com a API 0.x: number representa reais e string representa centavos digitados. */
export const formatCurrencyBRL = (value: InputValue): string => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }
  return maskBRLInput(value);
};

/** Compatibilidade: remove caracteres e retorna os dígitos como centavos. */
export const unmaskCurrencyToCents = (value: InputValue): number => {
  const digits = onlyDigits(value);
  const cents = digits ? Number(digits) : 0;
  return Number.isSafeInteger(cents) ? cents : 0;
};

/** Compatibilidade: converte uma moeda mascarada para reais. */
export const parseCurrencyToNumber = (value: InputValue): number | null => {
  const cents = parseBRLToCents(value);
  return cents === null ? null : cents / 100;
};
