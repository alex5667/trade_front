import { DayOfWeek, DayOfWeekUkr } from '@/types/menuItem.type'
import { getDatesForNextWeek } from '@/utils/getDatesForNextWeek'

export const getDateForDay = (day: DayOfWeek): string | undefined => {
	const dates = getDatesForNextWeek()
	const dayIndex = Object.keys(DayOfWeekUkr).findIndex(
		key => key === day.toUpperCase()
	)
	return dates[dayIndex]
}