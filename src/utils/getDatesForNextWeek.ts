import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getDatesForNextWeek = () => {
	const today = dayjs()
	const startOfNextWeek = today.day() === 0
		? today.startOf('week').add(2, 'day')
		: today.startOf('week').add(1, 'week').add(2, 'day')
	const daysOfNextWeek = []

	for (let i = 0; i < 7; i++) {
		daysOfNextWeek.push(startOfNextWeek.add(i, 'day').utc().startOf('day').toISOString())
	}

	return daysOfNextWeek
}
