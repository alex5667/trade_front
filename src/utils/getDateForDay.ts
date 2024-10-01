import { DayOfWeek, DayOfWeekUkr } from '@/types/menuItem.type'
import { getDatesOfWeek } from './getDatesOfWeek'

export const getDateForDay = (day: DayOfWeek): string | undefined => {
	const { daysOfWeek } = getDatesOfWeek()
	const dayIndex = Object.keys(DayOfWeekUkr).findIndex(
		key => key === day.toUpperCase()
	)
	return daysOfWeek[dayIndex]
}