import { isValidDateParts } from "./date";
import { toInputString } from "./text";
import type { DateTimeFormatOptions, DateTimeParts, InputValue } from "./types";

const isValidTime = (hour: number, minute: number, second: number): boolean =>
  Number.isInteger(hour) && hour >= 0 && hour <= 23 && Number.isInteger(minute) && minute >= 0 && minute <= 59 &&
  Number.isInteger(second) && second >= 0 && second <= 59;

/** Lê DD/MM/AAAA HH:mm[:ss] como data/hora local canônica, sem inferir timezone. */
export const parseDateTimeBR = (value: InputValue): string | null => {
  const match = toInputString(value).match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const parts: DateTimeParts = {
    day: Number(match[1]), month: Number(match[2]), year: Number(match[3]),
    hour: Number(match[4]), minute: Number(match[5]), second: Number(match[6] ?? 0),
  };
  if (!isValidDateParts(parts) || !isValidTime(parts.hour, parts.minute, parts.second)) return null;
  return `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:${String(parts.second).padStart(2, "0")}`;
};

/**
 * Exibe um instante ISO com offset (ou Z) no fuso escolhido. Uma data/hora sem
 * offset é recusada para impedir que o timezone do computador altere o resultado.
 */
export const formatDateTimeBR = (value: InputValue, options: DateTimeFormatOptions = {}): string | null => {
  const input = toInputString(value);
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(input)) return null;
  const instant = new Date(input);
  if (Number.isNaN(instant.getTime())) return null;

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: options.timeZone ?? "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    ...(options.includeSeconds ? { second: "2-digit" as const } : {}),
    hourCycle: "h23",
  });
  return formatter.format(instant).replace(",", "");
};

export const formatDateTime = (value: InputValue): string => formatDateTimeBR(value) ?? "";
export const unmaskDateTime = parseDateTimeBR;
