import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getDatesOfWeek = (weekOffset = 0) => {
	const today = dayjs().add(weekOffset, 'week')
	const startOfWeek = today
		.startOf('week')
		.add(2, 'day')
		.utc()
		.startOf('day')
		.toISOString()

	const endOfWeek = today.endOf('week').utc().startOf('day').toISOString()

	const datesOfWeek = []

	for (let i = 0; i < 7; i++) {
		datesOfWeek.push(today
			.startOf('week')
			.add(2, 'day').add(i, 'day').utc().startOf('day').toISOString())
	}


	return {
		startOfWeek, endOfWeek, datesOfWeek
	}

}