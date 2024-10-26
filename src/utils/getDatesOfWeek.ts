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

	const datesOfWeek: { [key: string]: string } = {}

	for (let i = 0; i < 7; i++) {
		const date = today
			.startOf('week')
			.add(2, 'day').add(i, 'day').utc().startOf('day')
		const dayOfWeek = date.format('dddd').toUpperCase()
		datesOfWeek[dayOfWeek] = date.toISOString()
	}


	return {
		startOfWeek, endOfWeek, datesOfWeek
	}

}