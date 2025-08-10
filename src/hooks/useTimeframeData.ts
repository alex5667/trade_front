/**
 * Хук для получения данных таймфреймов
 * ------------------------------
 * Предоставляет данные топ-гайнеров и топ-лузеров из Redux
 */

import { selectTimeframeData } from '@/store/signals/selectors/signals.selectors'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useTimeframeData = () => {
	const timeframeData = useSelector(selectTimeframeData)
	const hasData = useMemo(() => (timeframeData.gainers.length + timeframeData.losers.length) > 0, [timeframeData])

	const refetch = () => {
		// refetch делает RTK Query через useSignalInitializer (периодическое обновление)
		// здесь намеренно ничего не делаем
		console.log('Refetch delegated to RTK Query polling (useSignalInitializer)')
	}

	return {
		timeframeData,
		isLoading: false,
		error: null as string | null,
		refetch,
		hasData,
	}
} 