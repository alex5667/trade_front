import dayjs from 'dayjs'

export const getNextSaturday = (): number => {
	const now = dayjs()
	const daysUntilSaturday = (6 - now.day() + 7) % 7 // Дней до субботы
	const saturday = now.add(daysUntilSaturday, 'day').endOf('day') // Суббота в 23:59:59
	return saturday.valueOf() // Время в миллисекундах
}