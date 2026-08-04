/** Valores aceitos pelas funções de máscara e parsing. */
export type InputValue = string | number | null | undefined;

/** Resultado de um parser estrito: valor canônico quando válido, null quando não for interpretável. */
export type ParseResult<T> = T | null;

/** Opções de exibição e leitura de números no padrão brasileiro. */
export interface NumberFormatOptions {
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
	useGrouping?: boolean;
}

/** Opções para entradas decimais digitadas pelo usuário. */
export interface DecimalInputOptions {
	decimalScale?: number;
	allowNegative?: boolean;
	useGrouping?: boolean;
}

/** Opções de formatação de um instante ISO. */
export interface DateTimeFormatOptions {
	/** IANA timezone. O padrão é America/Sao_Paulo. */
	timeZone?: string;
	includeSeconds?: boolean;
}

/** Partes de uma data civil, sem horário e sem fuso. */
export interface DateParts {
	year: number;
	month: number;
	day: number;
}

/** Partes de uma data/hora local, sem representar um instante em UTC. */
export interface DateTimeParts extends DateParts {
	hour: number;
	minute: number;
	second: number;
}
