/**
 * Order Flow API
 * --------------------------------
 * API сервис для работы с Order Flow данными (Delta, Spikes)
 */

/** Базовый URL для Order Flow API */
export const OF_API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'

/**
 * Получить признаки Order Flow (features) для символа и таймфрейма
 * @param symbol - Торговый символ (например, BTCUSDT)
 * @param timeframe - Таймфрейм (например, 1m, 3m, 5m)
 * @param limit - Количество записей (по умолчанию 200)
 * @returns Массив признаков Order Flow
 */
export async function getOfFeatures(
	symbol: string,
	timeframe: string,
	limit: number = 200
) {
	const response = await fetch(
		`${OF_API_BASE}/of/features?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`,
		{ cache: 'no-store' }
	)
	return response.json()
}

/**
 * Получить спайки (резкие изменения Delta) для символа и таймфрейма
 * @param symbol - Торговый символ (например, BTCUSDT)
 * @param timeframe - Таймфрейм (например, 1m, 3m, 5m)
 * @param limit - Количество записей (по умолчанию 50)
 * @returns Массив спайков Delta
 */
export async function getOfSpikes(
	symbol: string,
	timeframe: string,
	limit: number = 50
) {
	const response = await fetch(
		`${OF_API_BASE}/of/spikes?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`,
		{ cache: 'no-store' }
	)
	return response.json()
}

/**
 * Получить URL для sparkline изображения Delta
 * @param symbol - Торговый символ
 * @param timeframe - Таймфрейм
 * @param n - Количество точек данных (по умолчанию 120)
 * @returns URL для PNG изображения
 */
export function getOfSparklineUrl(
	symbol: string,
	timeframe: string,
	n: number = 120
): string {
	return `${OF_API_BASE}/png/delta?symbol=${symbol}&timeframe=${timeframe}&n=${n}`
}

