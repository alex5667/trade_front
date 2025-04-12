'use strict'

import { getDatesOfWeek } from '@/utils/getDatesOfWeek'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

export const useWeeklyNavigation = () => {
	const [weekOffset, setWeekOffset] = useState(0)

	const startEndDate = useMemo(() => {
		const dates = getDatesOfWeek(weekOffset)
		return {
			startOfWeek: dates.startOfWeek,
			endOfWeek: dates.endOfWeek,
			datesOfWeek: dates.datesOfWeek
		}
	}, [weekOffset])

	const queryArgs = useMemo(() => {
		return {
			startDate: dayjs(startEndDate.startOfWeek).format('YYYY-MM-DD'),
			endDate: dayjs(startEndDate.endOfWeek).format('YYYY-MM-DD')
		}
	}, [startEndDate.startOfWeek, startEndDate.endOfWeek])

	const changeWeek = useCallback((direction: 'next' | 'prev') => {
		setWeekOffset(prev => (direction === 'next' ? prev + 1 : prev - 1))
	}, [])

	return {
		weekOffset,
		startEndDate,
		queryArgs,
		changeWeek
	}
}