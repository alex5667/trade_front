/**
 * Утилита форматирования объема торгов
 * --------------------------------
 * Форматирует большие числа с суффиксами B (миллиарды) и M (миллионы)
 */

/**
 * Форматирует объем торгов с суффиксами для больших чисел
 * 
 * @param value - значение объема для форматирования
 * @returns отформатированная строка с суффиксом (B/M) или локализованное число
 */
export const formatVolumeValue = (value?: number): string => {
	if (value === undefined) return '0'

	if (value >= 1_000_000_000) {
		return `${(value / 1_000_000_000).toFixed(2)}B`
	} else if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(2)}M`
	} else {
		return value.toLocaleString()
	}
}