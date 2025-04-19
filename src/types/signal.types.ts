'use strict'
export type SignalType =
	| 'signal:volatilityRange'
	| 'signal:volatility'
	| 'volumeSpike'
	| 'priceChange'
	| 'top:gainers'
	| 'top:losers'
	| 'volatilityRange'
	| 'trigger:gainers-1h'
	| 'trigger:losers-1h'
	| 'trigger:gainers-4h'
	| 'trigger:losers-4h'
	| 'trigger:gainers-24h'
	| 'trigger:losers-24h'

export interface BaseSignal {
	symbol: string
	timestamp: number
	type: SignalType
}

// Индивидуальные типы сигналов
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
	range?: number       // Optional because not all volatility signals have range
	avgRange?: number    // Optional because not all volatility signals have avgRange
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

export interface TopGainersSignal {
	type: string
	coins: string[] | TopCoin[]  // Allow both string[] and TopCoin[] for backward compatibility
	timestamp: number
}

export interface TopLosersSignal {
	type: string
	coins: string[] | TopCoin[]  // Allow both string[] and TopCoin[] for backward compatibility
	timestamp: number
}

export type SignalData = {
	volatilitySpikes: VolatilitySpikeSignal[]
	volumeSpikes: VolumeSpikeSignal[]
	priceChanges: PriceChangeSignal[]
	topGainers: string[] // ← только символы монет
	topLosers: string[]
	volatilityRanges: VolatilitySpikeSignal[]
	triggerGainers1h: string[]
	triggerLosers1h: string[]
	triggerGainers4h: string[]
	triggerLosers4h: string[]
	triggerGainers24h: string[]
	triggerLosers24h: string[]
}

