import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getDatesForWeek = (addWeek = 0) => {
	const today = dayjs()
	const startOfWeek = today.day() === 0
		? today.startOf('week').add(2, 'day')
		: today.startOf('week').add(addWeek, 'week').add(2, 'day')
	const daysOfWeek = []

	for (let i = 0; i < 7; i++) {
		daysOfWeek.push(startOfWeek.add(i, 'day').utc().startOf('day').toISOString())
	}

	return daysOfWeek
}
