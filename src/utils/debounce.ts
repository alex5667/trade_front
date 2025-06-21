/**
 * Утилита для отложенного выполнения функций (debounce)
 * --------------------------------
 * Реализует паттерн debounce для ограничения частоты вызова функций
 */

/**
 * Создает debounced версию функции, которая откладывает выполнение
 * до тех пор, пока не пройдет указанная задержка без новых вызовов
 * 
 * @param func - Функция для debounce
 * @param delay - Задержка в миллисекундах
 * @returns Новая функция с debounce логикой
 */
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	/** Идентификатор таймера для отмены предыдущих вызовов */
	let timeoutId: ReturnType<typeof setTimeout>

	return (...args: Parameters<T>) => {
		// Отменяем предыдущий вызов, если он есть
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		// Устанавливаем новый таймер
		timeoutId = setTimeout(() => {
			func(...args)
		}, delay)
	}
}