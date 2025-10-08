/**
 * Система фильтрации сигналов по рыночному режиму
 * ------------------------------
 * Гейтирует (фильтрует) торговые сигналы на основе текущего рыночного режима
 * для предотвращения неподходящих сетапов
 */

import { FilterableSignal, RegimeType, SignalTypeFilter, TradeSide } from '@/types/signal.types'

/**
 * Проверяет, допускается ли сигнал в текущем рыночном режиме
 * 
 * @param regime - Текущий рыночный режим
 * @param signal - Сигнал для проверки
 * @returns true если сигнал допускается, false если должен быть отфильтрован
 */
export const allowSignal = (
	regime: RegimeType, 
	signal: { type: SignalTypeFilter; side?: TradeSide }
): boolean => {
	switch (regime) {
		case 'trending_bull':
			// В бычьем тренде допускаем лонговые трендовые сигналы
			// Шортовые (контртренд) чаще отфильтровываем
			if (signal.type === 'fvg' || signal.type === 'ob' || signal.type === 'breaker') {
				return signal.side !== 'short'
			}
			return true

		case 'trending_bear':
			// В медвежьем тренде допускаем шортовые трендовые сигналы
			// Лонговые (контртренд) чаще отфильтровываем
			if (signal.type === 'fvg' || signal.type === 'ob' || signal.type === 'breaker') {
				return signal.side !== 'long'
			}
			return true

		case 'squeeze':
			// В сжатии лучше не торговать пробои до подтверждения
			// Допускаем только сигналы объема и волатильности
			if (signal.type === 'volumeSpike' || signal.type === 'volatility') {
				return true
			}
			return false

		case 'range':
			// В диапазоне mean-reversion более уместен
			// Пробойные сетапы часто фальшивые
			if (signal.type === 'smt') {
				return true
			}
			if (signal.type === 'fvg' || signal.type === 'ob') {
				return false
			}
			return true

		case 'expansion':
			// В расширении допускаем продолжение движения
			// Следим за ревёрс-сигналами
			return true

		default:
			// По умолчанию пропускаем все сигналы
			return true
	}
}

/**
 * Фильтрует массив сигналов по текущему режиму
 * 
 * @param signals - Массив сигналов для фильтрации
 * @param regime - Текущий рыночный режим
 * @returns Отфильтрованный массив сигналов
 */
export const filterSignalsByRegime = <T extends FilterableSignal>(
	signals: T[],
	regime?: RegimeType
): T[] => {
	if (!regime) return signals
	
	return signals.filter(signal => 
		allowSignal(regime, { 
			type: signal.type as SignalTypeFilter, 
			side: signal.side as TradeSide 
		})
	)
}

/**
 * Получить причину фильтрации сигнала
 * Полезно для UI/UX - показать пользователю почему сигнал отфильтрован
 * 
 * @param regime - Текущий рыночный режим
 * @param signal - Сигнал для проверки
 * @returns Строка с причиной или null если сигнал допускается
 */
export const getFilterReason = (
	regime: RegimeType,
	signal: { type: SignalTypeFilter; side?: TradeSide }
): string | null => {
	const allowed = allowSignal(regime, signal)
	
	if (allowed) return null

	switch (regime) {
		case 'trending_bull':
			if (signal.side === 'short') {
				return 'Counter-trend short in bullish market'
			}
			break

		case 'trending_bear':
			if (signal.side === 'long') {
				return 'Counter-trend long in bearish market'
			}
			break

		case 'squeeze':
			return 'Breakout signals filtered during squeeze phase'

		case 'range':
			if (signal.type === 'fvg' || signal.type === 'ob') {
				return 'Breakout signals unreliable in ranging market'
			}
			break
	}

	return 'Filtered by regime logic'
}

/**
 * Статистика фильтрации
 * Полезно для анализа эффективности фильтра
 */
export const getFilterStats = <T extends FilterableSignal>(
	signals: T[],
	regime?: RegimeType
): {
	total: number
	allowed: number
	filtered: number
	percentage: number
} => {
	const total = signals.length
	
	if (!regime || total === 0) {
		return { total, allowed: total, filtered: 0, percentage: 0 }
	}

	const filtered = filterSignalsByRegime(signals, regime)
	const allowed = filtered.length
	const filteredCount = total - allowed
	const percentage = (filteredCount / total) * 100

	return {
		total,
		allowed,
		filtered: filteredCount,
		percentage: Math.round(percentage * 100) / 100
	}
}

