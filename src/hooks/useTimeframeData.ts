/**
 * Хук для получения данных таймфреймов
 * ------------------------------
 * Предоставляет данные топ-гайнеров и топ-лузеров из Redux
 */

import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { signalApi } from '@/services/signal.api'
import { selectTimeframeData } from '@/store/signals/selectors/signals.selectors'
import type { AppDispatch } from '@/store/store'

export const useTimeframeData = () => {
	const dispatch = useDispatch<AppDispatch>()
	const timeframeData = useSelector(selectTimeframeData)
	const hasData = useMemo(() => (timeframeData.gainers.length + timeframeData.losers.length) > 0, [timeframeData])

	const refetch = () => {
		try {
			// Инвалидируем кэш сигналов, чтобы RTK Query перезагрузил данные
			dispatch(signalApi.util.invalidateTags(['Signal']))
			// Явно инициируем запросы к gainers/losers
			dispatch(signalApi.endpoints.getTopGainers.initiate(undefined, { forceRefetch: true }))
			dispatch(signalApi.endpoints.getTopLosers.initiate(undefined, { forceRefetch: true }))
			console.log('🔄 Timeframe refetch triggered: top gainers/losers')
		} catch (e) {
			console.log('Refetch error (timeframe):', e)
		}
	}

	return {
		timeframeData,
		isLoading: false,
		error: null as string | null,
		refetch,
		hasData,
	}
} 