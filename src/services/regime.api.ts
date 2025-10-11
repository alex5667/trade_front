/**
 * API клиент для работы с Market Regime endpoints
 * ------------------------------
 * Предоставляет методы для получения данных о рыночном режиме
 */

import { API_BASE_URL } from '@/config/api.config'
import { RegimeQuantiles, RegimeSnapshot, RegimeSnapshotParams } from '@/types/signal.types'
import {
	generateMockContext,
	generateMockHealth,
	generateMockQuantiles,
	generateMockSeries,
	generateMockSnapshot
} from './regime.mock'

// Режим mock данных (для разработки без backend)
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

/**
 * Универсальная функция для GET запросов с JSON ответом
 */
async function getJSON<T>(url: string): Promise<T> {
	try {
		const res = await fetch(url, { 
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			}
		})
		
		if (!res.ok) {
			const errorText = await res.text()
			throw new Error(`HTTP ${res.status}: ${errorText}`)
		}
		
		return res.json()
	} catch (error) {
		// Улучшенная обработка ошибок
		if (error instanceof TypeError && error.message.includes('fetch')) {
			throw new Error(
				`Network error: Cannot reach ${API_BASE_URL}. ` +
				`Убедитесь, что backend запущен или установите NEXT_PUBLIC_API_BASE_URL.`
			)
		}
		throw error
	}
}

/**
 * Получить последний снапшот режима
 * @param symbol - Торговая пара (например, "BTCUSDT")
 * @param timeframe - Таймфрейм (например, "1m", "5m", "1h")
 */
export const fetchRegimeLatest = async (symbol: string, timeframe: string): Promise<RegimeSnapshot> => {
	if (USE_MOCK_DATA) {
		console.log('🎭 Mock: fetchRegimeLatest')
		return Promise.resolve(generateMockSnapshot(symbol, timeframe))
	}

	try {
		return await getJSON<RegimeSnapshot>(
			`${API_BASE_URL}/regime/snapshot/latest?symbol=${symbol}&timeframe=${timeframe}`
		)
	} catch (error) {
		console.warn('⚠️ API недоступен, используем mock данные:', error)
		return generateMockSnapshot(symbol, timeframe)
	}
}

/**
 * Получить временной ряд режима (для графиков)
 * @param params - Параметры запроса
 * @returns Массив снапшотов режима
 */
export const fetchRegimeRange = async (params: RegimeSnapshotParams): Promise<RegimeSnapshot[]> => {
	if (USE_MOCK_DATA) {
		console.log('🎭 Mock: fetchRegimeRange')
		const points = params.limit || 100
		return Promise.resolve(generateMockSeries(params.symbol, params.timeframe, points))
	}

	try {
		const queryParams = new URLSearchParams({
			symbol: params.symbol,
			timeframe: params.timeframe,
		})
		
		if (params.from) queryParams.set('from', params.from)
		if (params.to) queryParams.set('to', params.to)
		if (params.limit) queryParams.set('limit', String(params.limit))
		
		return await getJSON<RegimeSnapshot[]>(
			`${API_BASE_URL}/regime/snapshot/range?${queryParams.toString()}`
		)
	} catch (error) {
		console.warn('⚠️ API недоступен, используем mock данные:', error)
		const points = params.limit || 100
		return generateMockSeries(params.symbol, params.timeframe, points)
	}
}

/**
 * Получить квантили ADX/ATR% для символа и таймфрейма
 * @param symbol - Торговая пара
 * @param timeframe - Таймфрейм
 */
export const fetchRegimeQuantiles = async (symbol: string, timeframe: string): Promise<RegimeQuantiles> => {
	if (USE_MOCK_DATA) {
		console.log('🎭 Mock: fetchRegimeQuantiles')
		return Promise.resolve(generateMockQuantiles(symbol, timeframe))
	}

	try {
		return await getJSON<RegimeQuantiles>(
			`${API_BASE_URL}/regime/quantiles?symbol=${symbol}&timeframe=${timeframe}`
		)
	} catch (error) {
		console.warn('⚠️ API недоступен, используем mock данные:', error)
		return generateMockQuantiles(symbol, timeframe)
	}
}

/**
 * Получить историю режимов за период
 * @param symbol - Торговая пара
 * @param timeframe - Таймфрейм
 * @param hours - Количество часов назад (по умолчанию 24)
 */
export const fetchRegimeHistory = async (
	symbol: string,
	timeframe: string,
	hours: number = 24
): Promise<RegimeSnapshot[]> => {
	const to = new Date()
	const from = new Date(to.getTime() - hours * 60 * 60 * 1000)

	return fetchRegimeRange({
		symbol,
		timeframe,
		from: from.toISOString(),
		to: to.toISOString(),
	})
}

/**
 * Получить статус здоровья пайплайна для символа и таймфрейма
 * @param symbol - Торговая пара
 * @param timeframe - Таймфрейм
 * @param maxLagSec - Максимальная задержка в секундах (по умолчанию 180)
 */
export const fetchRegimeHealth = async (
	symbol: string,
	timeframe: string,
	maxLagSec: number = 180
) => {
	if (USE_MOCK_DATA) {
		console.log('🎭 Mock: fetchRegimeHealth')
		return Promise.resolve(generateMockHealth(symbol, timeframe))
	}

	try {
		return await getJSON(
			`${API_BASE_URL}/regime/health?symbol=${symbol}&timeframe=${timeframe}&maxLagSec=${maxLagSec}`
		)
	} catch (error) {
		console.warn('⚠️ API недоступен, используем mock данные:', error)
		return generateMockHealth(symbol, timeframe)
	}
}

/**
 * Получить агрегированные данные по часам
 * @param symbol - Торговая пара
 * @param timeframe - Таймфрейм
 * @param hours - Количество часов (по умолчанию 24)
 */
export const fetchRegimeAggHourly = (
	symbol: string,
	timeframe: string,
	hours: number = 24
) => {
	return getJSON(
		`${API_BASE_URL}/regime/agg/hourly?symbol=${symbol}&timeframe=${timeframe}&hours=${hours}`
	)
}

/**
 * Получить агрегированные данные по дням
 * @param symbol - Торговая пара
 * @param timeframe - Таймфрейм
 * @param days - Количество дней (по умолчанию 14)
 */
export const fetchRegimeAggDaily = (
	symbol: string,
	timeframe: string,
	days: number = 14
) => {
	return getJSON(
		`${API_BASE_URL}/regime/agg/daily?symbol=${symbol}&timeframe=${timeframe}&days=${days}`
	)
}

/**
 * Получить контекст режима (LTF + HTF) с проверкой допуска сигнала
 * @param params - Параметры запроса контекста
 */
export const fetchRegimeContext = async (params: {
	symbol: string
	ltf: string
	htf: string
	signalType?: string
	side?: 'long' | 'short'
}) => {
	if (USE_MOCK_DATA) {
		console.log('🎭 Mock: fetchRegimeContext')
		return Promise.resolve(
			generateMockContext(params.symbol, params.ltf, params.htf, params.signalType, params.side)
		)
	}

	try {
		const queryParams = new URLSearchParams({
			symbol: params.symbol,
			ltf: params.ltf,
			htf: params.htf,
		})
		
		if (params.signalType) queryParams.set('signalType', params.signalType)
		if (params.side) queryParams.set('side', params.side)
		
		return await getJSON(
			`${API_BASE_URL}/regime/context?${queryParams.toString()}`
		)
	} catch (error) {
		console.warn('⚠️ API недоступен, используем mock данные:', error)
		return generateMockContext(params.symbol, params.ltf, params.htf, params.signalType, params.side)
	}
}

