import dayjs from 'dayjs'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { useGetTelegramSignalsByRangeQuery, useGetTelegramSignalsQuery } from '@/services/telegram.api'
import { selectTelegramSignals } from '@/store/signals/selectors/telegram.selectors'

export const useTelegramSignals = () => {
	const today = dayjs().format('YYYY-MM-DD')
	const [range, setRange] = useState<{ start?: string; end?: string }>({})
	const rangeActive = !!(range.start && range.end)

	const { isLoading: isTodayLoading, isError: isTodayError, refetch: refetchToday } = useGetTelegramSignalsQuery({ date: today })

	const { isLoading: isRangeLoading, isError: isRangeError, refetch: refetchRange } = useGetTelegramSignalsByRangeQuery(
		rangeActive ? { start: range.start as string, end: range.end as string } : ({} as any),
		{ skip: !rangeActive }
	)

	const signals = useSelector(selectTelegramSignals)
	const isLoading = rangeActive ? isRangeLoading : isTodayLoading
	const isError = rangeActive ? isRangeError : isTodayError
	const refetch = rangeActive ? refetchRange : refetchToday

	return {
		today,
		range,
		setRange,
		rangeActive,
		signals,
		isLoading,
		isError,
		refetch
	}
} 