import { getDatesForWeek } from '@/utils/getDatesForNextWeek'
import { getDatesOfWeek } from '@/utils/getDatesOfWeek'
import dayjs from 'dayjs'

export function getMenuDatesForCurrentWeek() {
	const today = dayjs()

	const dates = getDatesForWeek()
	let { startOfThisWeek, endOfThisWeek } = getDatesOfWeek()
	const saturday = dayjs(startOfThisWeek)
		.add(5, 'day')
		.utc()
		.startOf('day')
		.toISOString()

	if (
		today.startOf('day').toISOString() === saturday ||
		today.startOf('day').toISOString() === endOfThisWeek
	) {
		startOfThisWeek = dates[0]
		endOfThisWeek = dates[dates.length - 1]
	}

	return { startOfThisWeek, endOfThisWeek }
}