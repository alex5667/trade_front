/**
 * Утилиты для работы с DecimalString
 * ------------------------------
 * Безопасная конвертация строковых значений Decimal/BigInt в числа
 */

import { DecimalString } from '@/types/signal.types'

/**
 * Конвертирует DecimalString в число
 * @param value - Значение для конвертации
 * @param defaultValue - Значение по умолчанию (default: 0)
 * @returns Число
 */
export const toNumber = (
	value: DecimalString | number | undefined | null,
	defaultValue: number = 0
): number => {
	if (value === undefined || value === null) {
		return defaultValue
	}

	if (typeof value === 'number') {
		return value
	}

	const num = Number(value)
	return isNaN(num) ? defaultValue : num
}

/**
 * Форматирует DecimalString с заданной точностью
 * @param value - Значение для форматирования
 * @param decimals - Количество знаков после запятой
 * @param defaultValue - Значение по умолчанию (default: '-')
 * @returns Отформатированная строка
 */
export const formatDecimal = (
	value: DecimalString | number | undefined | null,
	decimals: number = 2,
	defaultValue: string = '-'
): string => {
	if (value === undefined || value === null) {
		return defaultValue
	}

	const num = toNumber(value)
	return num.toFixed(decimals)
}

/**
 * Форматирует процентное значение
 * @param value - Значение в процентах (0.0234 = 2.34%)
 * @param decimals - Количество знаков после запятой (default: 2)
 * @param defaultValue - Значение по умолчанию (default: '-')
 * @returns Отформатированная строка с знаком %
 */
export const formatPercent = (
	value: DecimalString | number | undefined | null,
	decimals: number = 2,
	defaultValue: string = '-'
): string => {
	if (value === undefined || value === null) {
		return defaultValue
	}

	const num = toNumber(value) * 100
	return `${num.toFixed(decimals)}%`
}

/**
 * Форматирует ценовое значение с знаком +/-
 * @param value - Значение цены
 * @param decimals - Количество знаков после запятой (default: 2)
 * @param defaultValue - Значение по умолчанию (default: '-')
 * @returns Отформатированная строка со знаком
 */
export const formatPriceChange = (
	value: DecimalString | number | undefined | null,
	decimals: number = 2,
	defaultValue: string = '-'
): string => {
	if (value === undefined || value === null) {
		return defaultValue
	}

	const num = toNumber(value)
	const sign = num > 0 ? '+' : ''
	return `${sign}${num.toFixed(decimals)}`
}

/**
 * Вычисляет процентное изменение между двумя значениями
 * @param from - Начальное значение
 * @param to - Конечное значение
 * @param decimals - Количество знаков после запятой (default: 2)
 * @returns Процентное изменение
 */
export const calculatePercentChange = (
	from: DecimalString | number | undefined | null,
	to: DecimalString | number | undefined | null,
	decimals: number = 2
): string => {
	const fromNum = toNumber(from)
	const toNum = toNumber(to)

	if (fromNum === 0) return '-'

	const change = ((toNum - fromNum) / fromNum) * 100
	const sign = change > 0 ? '+' : ''
	return `${sign}${change.toFixed(decimals)}%`
}

