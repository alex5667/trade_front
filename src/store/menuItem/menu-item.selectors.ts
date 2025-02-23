
import { TypeRootState } from '@/store/store'
import { DayOfWeek } from '@/types/menuItem.type'
import { createSelector } from 'reselect'

const selectMenuItems = (state: TypeRootState) => state.menuSlice.items

export const selectDayItems = (day: DayOfWeek, date: string) =>
	createSelector([selectMenuItems], items =>
		items.filter(item => item.dayOfWeek === day && item.date === date)
	)