/**
 * Mock данные для Regime API
 * ------------------------------
 * Используется когда backend недоступен или endpoints не реализованы
 */

import { RegimeSnapshot, RegimeType } from '@/types/signal.types'

/**
 * Генерирует случайный режим
 */
const getRandomRegime = (): RegimeType => {
	const regimes: RegimeType[] = ['range', 'squeeze', 'trending_bull', 'trending_bear', 'expansion']
	return regimes[Math.floor(Math.random() * regimes.length)]
}

/**
 * Генерирует mock снапшот режима
 */
export const generateMockSnapshot = (symbol: string, timeframe: string): RegimeSnapshot => {
	const regime = getRandomRegime()
	const adx = 10 + Math.random() * 40 // 10-50
	const atrPct = Math.random() * 0.05 // 0-5%

	return {
		id: `mock-${Date.now()}`,
		symbol,
		timeframe,
		regime,
		adx,
		atrPct,
		timestamp: new Date().toISOString(),
		createdAt: new Date().toISOString()
	}
}

/**
 * Генерирует mock временной ряд
 */
export const generateMockSeries = (
	symbol: string,
	timeframe: string,
	points: number = 100
): RegimeSnapshot[] => {
	const series: RegimeSnapshot[] = []
	const now = new Date()

	for (let i = points - 1; i >= 0; i--) {
		const timestamp = new Date(now.getTime() - i * 60 * 1000) // каждую минуту
		const regime = getRandomRegime()
		const adx = 10 + Math.random() * 40
		const atrPct = Math.random() * 0.05

		series.push({
			id: `mock-${timestamp.getTime()}-${i}`,
			symbol,
			timeframe,
			regime,
			adx,
			atrPct,
			timestamp: timestamp.toISOString(),
			createdAt: timestamp.toISOString()
		})
	}

	return series
}

/**
 * Mock квантили
 */
export const generateMockQuantiles = (symbol: string, timeframe: string) => {
	return {
		symbol,
		timeframe,
		adxQ25: 15.5,
		adxQ50: 22.3,
		adxQ75: 32.1,
		atrQ25: 0.012,
		atrQ50: 0.023,
		atrQ75: 0.038,
		updatedAt: new Date().toISOString()
	}
}

/**
 * Mock health
 */
export const generateMockHealth = (symbol: string, timeframe: string) => {
	return {
		symbol,
		timeframe,
		status: 'ok' as const,
		lastSnapshot: {
			timestamp: new Date().toISOString(),
			lagSec: 5
		},
		quantilesPresent: true,
		samples: {
			last1h: {
				actual: 60,
				expected: 60
			},
			last1d: {
				actual: 1440,
				expected: 1440
			}
		}
	}
}

/**
 * Mock context
 */
export const generateMockContext = (
	symbol: string,
	ltf: string,
	htf: string,
	signalType?: string,
	side?: 'long' | 'short'
) => {
	const ltfRegime = getRandomRegime()
	const htfRegime = getRandomRegime()

	return {
		symbol,
		ltf,
		htf,
		latestLTF: {
			regime: ltfRegime,
			adx: 20 + Math.random() * 20,
			atrPct: Math.random() * 0.03,
			timestamp: new Date().toISOString()
		},
		latestHTF: {
			regime: htfRegime,
			adx: 25 + Math.random() * 15,
			atrPct: Math.random() * 0.04,
			timestamp: new Date().toISOString()
		},
		allowed: Math.random() > 0.3, // 70% allowed
		bias: htfRegime === 'trending_bull' ? 'bullish' : htfRegime === 'trending_bear' ? 'bearish' : 'neutral',
		signalType,
		side
	}
}


