/**
 * Хук для работы с данными торговых сигналов
 * ------------------------------
 * Предоставляет доступ к данным торговых сигналов из Redux store
 * Для обратной совместимости с существующим кодом
 */

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectTimeframeData, selectTimeframeTriggers } from '@/store/signals/selectors/signals.selectors'

export const useSignalSocket = () => {
	const timeframeData = useSelector(selectTimeframeData)
	const triggers = useSelector(selectTimeframeTriggers)

	return useMemo(() => ({
		isConnected: true,
		timeframeData,
		triggers,
		topGainers: timeframeData.gainers || [],
		topLosers: timeframeData.losers || [],
		triggerGainers: triggers.gainers || [],
		triggerLosers: triggers.losers || []
	}), [timeframeData, triggers])
} 