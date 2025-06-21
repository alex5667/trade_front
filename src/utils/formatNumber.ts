/**
 * Утилита форматирования чисел
 * --------------------------------
 * Форматирует числа в соответствии с российской локалью
 */

/**
 * Форматирует число в строку с двумя знаками после запятой
 * используя российскую локаль (пробелы как разделители тысяч)
 * 
 * @param value - значение для форматирования (число, строка или undefined)
 * @returns отформатированная строка или '0' если значение пустое
 */
export const formatNumber = (value: number | string | undefined) => {
	if (!value) return '0'

	return new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(Number(value))
}