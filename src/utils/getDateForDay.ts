import { DayOfWeek, DayOfWeekUkr } from '@/types/menuItem.type'
import { getDatesOfWeek } from './getDatesOfWeek'

export const getDateForDay = (day: DayOfWeek): string | undefined => {
	const { datesOfWeek } = getDatesOfWeek()
	const dayIndex = Object.keys(DayOfWeekUkr).findIndex(
		key => key === day.toUpperCase()
	)
	return datesOfWeek[dayIndex]
}