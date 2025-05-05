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

	// Handle payload format with type (new format)
	if (data && data.type && data.payload && Array.isArray(data.payload)) {
		return data.payload.map((item: any) => ({
			symbol: item.symbol || '',
			change: item.change || '0'
		}))
	}

	// Handle direct array of timeframe coins
	if (Array.isArray(data)) {
		return data.map((item: any) => ({
			symbol: item.symbol || item.Symbol || '',
			change: item.change || item.Value?.toString() || '0'
		}))
	}

	return []
}

/**
 * Parse volume coins with additional volume metrics
 */
export const parseVolumeCoins = (data: any): VolumeCoin[] => {
	if (!data) return []

	// Get coins array from data
	const coinsArray = data && data.type && data.payload && Array.isArray(data.payload)
		? data.payload
		: Array.isArray(data)
			? data
			: []

	return coinsArray.map((item: any) => ({
		symbol: item.symbol || item.Symbol || '',
		change: item.change || '0',
		volume: typeof item.volume === 'number'
			? item.volume.toString()
			: item.volume || '0',
		volumePercent: typeof item.volumePercent === 'number'
			? item.volumePercent.toFixed(2)
			: item.volumePercent || '0.00',
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

	// Get coins array from data
	const coinsArray = data && data.type && data.payload && Array.isArray(data.payload)
		? data.payload
		: Array.isArray(data)
			? data
			: []

	return coinsArray.map((item: any) => ({
		symbol: item.symbol || item.Symbol || '',
		change: item.change || '0',
		rate: item.rate || item.fundingRate || '0'
	}))
} 