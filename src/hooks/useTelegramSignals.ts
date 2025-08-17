import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import type { SearchFilters } from '@/components/telegram/TelegramSignalsSearch'
import { useGetTelegramSignalsByRangeQuery, useGetTelegramSignalsQuery } from '@/services/telegram.api'
import { selectTelegramSignals } from '@/store/signals/selectors/telegram.selectors'

export const useTelegramSignals = () => {
	const today = dayjs().format('YYYY-MM-DD')
	const [range, setRange] = useState<{ start?: string; end?: string }>({})
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({})
	const rangeActive = !!(range.start && range.end)

	// Получаем сигналы из Redux store
	const signalsFromStore = useSelector(selectTelegramSignals)

	// Фильтруем сигналы по поисковым критериям
	const filteredSignals = useMemo(() => {
		if (!searchFilters.username && !searchFilters.symbol &&
			!searchFilters.direction && !searchFilters.timeframe && !searchFilters.exchange) {
			return signalsFromStore
		}

		return signalsFromStore.filter(signal => {
			const usernameMatch = !searchFilters.username ||
				(signal.username && signal.username.toLowerCase().includes(searchFilters.username.toLowerCase()))

			const symbolMatch = !searchFilters.symbol ||
				(signal.symbol && signal.symbol.toLowerCase().includes(searchFilters.symbol.toLowerCase()))

			const directionMatch = !searchFilters.direction ||
				(signal.direction && signal.direction.toLowerCase().includes(searchFilters.direction.toLowerCase()))

			const timeframeMatch = !searchFilters.timeframe ||
				(signal.timeframe && signal.timeframe.toLowerCase().includes(searchFilters.timeframe.toLowerCase()))

			const exchangeMatch = !searchFilters.exchange ||
				(signal.exchange && signal.exchange.toLowerCase().includes(searchFilters.exchange.toLowerCase()))

			return usernameMatch && symbolMatch && directionMatch && timeframeMatch && exchangeMatch
		})
	}, [searchFilters, signalsFromStore])

	const { isLoading: isTodayLoading, isError: isTodayError, refetch: refetchToday } = useGetTelegramSignalsQuery(
		{ date: today },
		{
			// Отключаем polling когда выбран диапазон дат
			pollingInterval: rangeActive ? undefined : 60000
		}
	)

	const { isLoading: isRangeLoading, isError: isRangeError, refetch: refetchRange } = useGetTelegramSignalsByRangeQuery(
		rangeActive ? { start: range.start as string, end: range.end as string } : ({} as any),
		{
			skip: !rangeActive,
			// Отключаем polling для диапазона дат
			pollingInterval: undefined
		}
	)

	const signals = filteredSignals
	const isLoading = rangeActive ? isRangeLoading : isTodayLoading
	const isError = rangeActive ? isRangeError : isTodayError
	const refetch = rangeActive ? refetchRange : refetchToday

	const handleSearch = (filters: SearchFilters) => {
		setSearchFilters(filters)
	}

	const handleClearSearch = () => {
		setSearchFilters({})
	}

	return {
		today,
		range,
		setRange,
		rangeActive,
		signals,
		isLoading,
		isError,
		refetch,
		searchFilters,
		handleSearch,
		handleClearSearch
	}
} 