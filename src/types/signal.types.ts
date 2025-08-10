'use strict'
export type SignalType =
	| 'signal:volatilityRange'
	| 'signal:volatility'
	| 'volumeSpike'
	| 'priceChange'
	| 'top:gainers'
	| 'top:losers'
	| 'volatilityRange'

export interface BaseSignal {
	symbol: string
	timestamp: number
	type: SignalType
}

export interface VolatilitySpikeSignal {
	type: string
	symbol: string
	interval: string
	open: number
	high: number
	low: number
	close: number
	volatility: number
	timestamp: number
	range?: number
	avgRange?: number
}

export interface VolumeSpikeSignal {
	type: string
	symbol: string
	interval: string
	volume: number
	timestamp: number
}

export interface PriceChangeSignal {
	type: string
	symbol: string
	interval: string
	priceChange: number
	priceChangePercent: number
	timestamp: number
}

export type TopCoin = {
	symbol: string
	price: number
	priceChangePercent: number
}

export type TimeframeCoin = {
	symbol: string
	change: string
	value?: number
	volume?: string
	volumePercent?: string
	volume2Percent?: string
	volume5Percent?: string
	volume10Percent?: string
}

export interface TopGainersSignal {
	type: string
	coins: string[] | TopCoin[]
	timestamp: number
}

export interface TopLosersSignal {
	type: string
	coins: string[] | TopCoin[]
	timestamp: number
}

export interface TimeframeSignal {
	type: string
	payload: TimeframeCoin[]
	timeframe: string
}

export type SignalData = {
	volatilitySpikes: VolatilitySpikeSignal[]
	volumeSpikes: VolumeSpikeSignal[]
	priceChanges: PriceChangeSignal[]
	topGainers: string[]
	topLosers: string[]
	volatilityRanges: VolatilitySpikeSignal[]
	triggerGainers: string[]
	triggerLosers: string[]
}

