import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(isoWeek)
export type DatesOfWeek = { [key: string]: string }
export const getDatesOfWeek = (weekOffset = 0) => {
	const today = dayjs().utc().add(weekOffset, 'week')

	// Начало недели (ISO: понедельник)
	const startOfWeek = today
		.startOf('isoWeek')
		.utc()
		.startOf('day')
		.toISOString()

	// Конец недели (воскресенье)
	const endOfWeek = today
		.endOf('isoWeek')
		.utc()
		.startOf('day')
		.toISOString()

	// Генерация дат для каждого дня недели
	const datesOfWeek: DatesOfWeek = {}

	for (let i = 0; i < 7; i++) {
		const date = today
			.startOf('isoWeek')
			.add(i, 'day')
			.utc()
			.startOf('day')

		const dayOfWeek = date.format('dddd').toUpperCase()
		datesOfWeek[dayOfWeek] = date.toISOString()
	}

	return {
		startOfWeek,
		endOfWeek,
		datesOfWeek
	}
}