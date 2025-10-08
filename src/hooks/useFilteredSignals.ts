/**
 * Хук useFilteredSignals - фильтрация сигналов по рыночному режиму
 * ------------------------------
 * Принимает массив сигналов и текущий режим,
 * возвращает отфильтрованный список с дополнительной статистикой
 */

import { useMemo } from 'react'

import { FilterableSignal, RegimeType } from '@/types/signal.types'
import { filterSignalsByRegime, getFilterStats } from '@/utils/regime-gate'

interface UseFilteredSignalsOptions {
	enabled?: boolean
}

interface UseFilteredSignalsReturn<T> {
	filtered: T[]
	stats: {
		total: number
		allowed: number
		filtered: number
		percentage: number
	}
	isFiltering: boolean
}

/**
 * Хук для фильтрации сигналов по рыночному режиму
 * 
 * @param allSignals - Все входящие сигналы
 * @param currentRegime - Текущий рыночный режим
 * @param options - Опции фильтрации
 * @returns Отфильтрованные сигналы и статистика
 * 
 * @example
 * ```tsx
 * const { filtered, stats } = useFilteredSignals(signals, regime, { enabled: true })
 * 
 * console.log(`Filtered ${stats.filtered} of ${stats.total} signals`)
 * ```
 */
export const useFilteredSignals = <T extends FilterableSignal>(
	allSignals: T[],
	currentRegime?: RegimeType,
	options: UseFilteredSignalsOptions = {}
): UseFilteredSignalsReturn<T> => {
	const { enabled = true } = options

	const filtered = useMemo(() => {
		if (!enabled || !currentRegime) {
			return allSignals
		}
		
		return filterSignalsByRegime(allSignals, currentRegime)
	}, [allSignals, currentRegime, enabled])

	const stats = useMemo(() => {
		if (!enabled) {
			return {
				total: allSignals.length,
				allowed: allSignals.length,
				filtered: 0,
				percentage: 0
			}
		}

		return getFilterStats(allSignals, currentRegime)
	}, [allSignals, currentRegime, enabled])

	const isFiltering = useMemo(() => {
		return enabled && !!currentRegime && stats.filtered > 0
	}, [enabled, currentRegime, stats.filtered])

	return {
		filtered,
		stats,
		isFiltering
	}
}

