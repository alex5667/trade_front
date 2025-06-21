/**
 * Хук для работы с данными торговых сигналов
 * ------------------------------
 * Предоставляет доступ к данным торговых сигналов из Redux store
 * Для обратной совместимости с существующим кодом
 */

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
	selectTimeframe24hData,
	selectTrigger24hData
} from '@/store/signals/selectors/signals.selectors'

/**
 * Хук для получения данных торговых сигналов
 * 
 * Возвращает данные только для 24-часового таймфрейма
 * после удаления поддержки 5-минутного интервала
 */
export const useSignalSocket = () => {
	/**
	 * Получение данных из Redux через селекторы
	 */
	const timeframe24h = useSelector(selectTimeframe24hData)
	const trigger24h = useSelector(selectTrigger24hData)

	/**
	 * Возвращаем мемоизированные данные для компонентов
	 */
	return useMemo(() => ({
		// Статус соединения (заглушка для совместимости)
		isConnected: true,

		// Данные по таймфреймам (только 24h)
		timeframeData: {
			'24h': timeframe24h
		},

		// Триггерные события (только 24h)
		triggers: {
			'24h': trigger24h
		},

		// Упрощенная структура для обратной совместимости
		topGainers24h: timeframe24h.gainers,
		topLosers24h: timeframe24h.losers,
		triggerGainers24h: trigger24h.gainers,
		triggerLosers24h: trigger24h.losers
	}), [
		timeframe24h,
		trigger24h
	])
} 