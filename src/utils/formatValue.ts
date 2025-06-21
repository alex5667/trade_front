/**
 * Утилита форматирования различных типов значений
 * --------------------------------
 * Универсальная функция для преобразования различных типов данных в строку
 */

/**
 * Преобразует любое значение в строковое представление
 * 
 * @param value - значение любого типа для преобразования
 * @returns строковое представление значения
 */
export const formatValue = (value: any): string => {
	if (typeof value === 'string' || typeof value === 'number') return value.toString()
	if (value instanceof Date) return value.toISOString()
	if (typeof value === 'object' && value !== null) return JSON.stringify(value)
	return ''
}