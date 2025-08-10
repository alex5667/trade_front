/**
 * Signal Parser Utilities
 * ------------------------------
 * Helper functions to parse different signal formats
 */

import {
	AnyObject,
	FundingCoin,
	TimeframeCoin,
	VolumeCoin
} from '../signal.types'

/**
 * Parse a list of symbols from various data formats
 */
export const parseSymbols = (data: any): string[] => {
	if (!data) return []

	// Handle payload format { payload: [...] }
	if (data && typeof data === 'object' && 'payload' in data && Array.isArray(data.payload)) {
		return data.payload.map((item: any) =>
			typeof item === 'string' ? item : (item as AnyObject).symbol || ''
		)
	}

	// Handle direct array format [...]
	if (Array.isArray(data)) {
		return data.map(item => (typeof item === 'string' ? item : (item as AnyObject).symbol || ''))
	}

	// Handle coins format { coins: [...] }
	if (data && typeof data === 'object' && Array.isArray((data as AnyObject).coins)) {
		return (data as AnyObject).coins.map((c: any) => (typeof c === 'string' ? c : c.symbol))
	}

	return []
}

/**
 * Parse timeframe coins (gainers/losers)
 */
export const parseTimeframeCoins = (data: any): TimeframeCoin[] => {
	if (!data) return []

	if (data && data.type && data.payload && Array.isArray(data.payload)) {
		return data.payload.map((item: any) => ({
			symbol: item.symbol || '',
			percentChange: typeof item.change === 'string' ? parseFloat(item.change) : Number(item.change || 0),
			timestamp: Date.now()
		}))
	}

	if (Array.isArray(data)) {
		return data.map((item: any) => ({
			symbol: item.symbol || item.Symbol || '',
			percentChange: typeof item.change === 'string' ? parseFloat(item.change) : Number(item.change || 0),
			timestamp: Date.now()
		}))
	}

	return []
}

/**
 * Parse volume coins with additional volume metrics
 */
export const parseVolumeCoins = (data: any): VolumeCoin[] => {
	if (!data) return []

	const coinsArray = data && data.type && data.payload && Array.isArray(data.payload)
		? data.payload
		: Array.isArray(data)
			? data
			: []

	return coinsArray.map((item: any) => ({
		symbol: item.symbol || item.Symbol || '',
		change: typeof item.change === 'string' ? item.change : String(item.change ?? '0'),
		volume: typeof item.volume === 'number' ? String(item.volume) : item.volume || '0',
		volumePercent: typeof item.volumePercent === 'number' ? item.volumePercent.toFixed(2) : item.volumePercent || '0.00',
		volume2Level: item.volume2Level || item.volume2Percent || '0',
		volume5Level: item.volume5Level || item.volume5Percent || '0',
		volume10Level: item.volume10Level || item.volume10Percent || '0'
	}))
}

/**
 * Parse funding coins with rate information
 */
export const parseFundingCoins = (data: any): FundingCoin[] => {
	if (!data) return []

	const coinsArray = data && data.type && data.payload && Array.isArray(data.payload)
		? data.payload
		: Array.isArray(data)
			? data
			: []

	return coinsArray.map((item: any) => {
		const rawRate = item.rate ?? item.fundingRate ?? 0
		const rate = typeof rawRate === 'string' ? parseFloat(rawRate) : Number(rawRate)
		const rawChange = item.change ?? 0
		const change = typeof rawChange === 'string' ? parseFloat(rawChange) : Number(rawChange)
		const rawTimestamp = item.timestamp
		let timestamp: number | string | undefined = undefined
		if (typeof rawTimestamp === 'number') timestamp = rawTimestamp
		else if (typeof rawTimestamp === 'string') {
			const ms = Date.parse(rawTimestamp)
			timestamp = isNaN(ms) ? rawTimestamp : ms
		}

		return {
			symbol: item.symbol || item.Symbol || '-',
			rate: isNaN(rate) ? 0 : rate,
			change: isNaN(change) ? 0 : change,
			nextRate: item.nextRate !== undefined ? Number(item.nextRate) : undefined,
			nextFundingTime: item.nextFundingTime || item.nextFunding || item.nextFundingAt,
			timeframe: item.timeframe || item.fundingInterval,
			exchange: item.exchange,
			price: item.price !== undefined ? Number(item.price) : undefined,
			timestamp: (timestamp as any) ?? Date.now()
		} as FundingCoin
	})
}

/**
 * Parse volatility signals (spike and range)
 */
export const parseVolatilitySignals = (data: any): any[] => {
	if (!data) return []

	// Handle different response formats
	let signalsArray: any[] = []

	if (data && data.type && data.payload && Array.isArray(data.payload)) {
		signalsArray = data.payload
	} else if (Array.isArray(data)) {
		signalsArray = data
	} else if (data && data.volatilitySpike && Array.isArray(data.volatilitySpike)) {
		signalsArray = [...data.volatilitySpike]
	} else if (data && data.volatilityRange && Array.isArray(data.volatilityRange)) {
		signalsArray = [...data.volatilityRange]
	} else if (data && data.volatility && Array.isArray(data.volatility)) {
		signalsArray = [...data.volatility]
	}

	return signalsArray.map((signal: any) => ({
		...signal,
		timestamp: signal.timestamp || signal.updatedAt || Date.now(),
		updatedAt: signal.updatedAt || signal.timestamp || Date.now(),
	}))
} 