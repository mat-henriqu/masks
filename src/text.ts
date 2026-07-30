import type { InputValue } from "./types";

/** Converte valores de entrada em texto sem transformar null em "null". */
export const toInputString = (value: InputValue): string =>
  value === null || value === undefined ? "" : String(value);

/** Retorna apenas os algarismos ASCII presentes no valor. */
export const onlyDigits = (value: InputValue): string =>
  toInputString(value).replace(/\D+/g, "");

/** Alias semântico para remoção de caracteres de máscara numérica. */
export const unmask = onlyDigits;
