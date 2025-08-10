/**
 * Типы сигналов
 * ------------------------------
 * Типы данных для всех сигналов, используемых в приложении.
 */

export interface ConnectionState {
	isConnected: boolean
	lastError: string | null
}

export interface BaseSignal {
	symbol: string
	exchange?: string
	timestamp: number | string
	price?: number
	createdAt?: number
}

export interface VolatilitySignal extends BaseSignal {
	type: 'volatility'
	signalType?: 'volatilitySpike' | 'volatilityRange'
	volatility: number
	volatilityChange: number
	interval?: string
	range?: number
	avgRange?: number
	rangeRatio?: number
	open?: number
	high?: number
	low?: number
	close?: number
}

export interface VolumeSignal extends BaseSignal {
	type: 'volume'
	volume: number
	change: number
	volumePercent?: number
	volume2Level?: number
	volume5Level?: number
	volume10Level?: number
	timeframe?: string
}

export interface PriceChangeSignal extends BaseSignal {
	type: 'priceChange'
	signalType?: 'priceSpike'
	price: number
	priceChange: number
	priceChangePercent: number
	interval?: string
	direction: 'up' | 'down'
}

export interface TimeframeCoin extends BaseSignal {
	percentChange: number
	baseVolume?: number
	quoteVolume?: number
	direction?: 'up' | 'down'
}

export interface FundingCoin extends BaseSignal {
	rate: number
	change?: number
	nextRate?: number
	nextFundingTime?: number
	timeframe?: string
}

export interface TriggerEvent {
	type: 'gainers' | 'losers'
	data: string[] | string
}

export interface TimeframeData {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
}

export interface TriggersData {
	gainers: string[]
	losers: string[]
}

export interface SignalsState {
	connection: ConnectionState
	volatilitySignals: VolatilitySignal[]
	volumeSignals: VolumeSignal[]
	priceChangeSignals: PriceChangeSignal[]
	timeframe: TimeframeData
	funding: FundingCoin[]
	triggers: TriggersData
}

export interface VolatilitySpike {
	symbol: string
	timestamp: number
	volatility: number
	volatilityChange: number
	price: number
}

export interface VolumeCoin extends TimeframeCoin {
	volume: string | number
	volumePercent: string | number
	volume2Level: string | number
	volume5Level: string | number
	volume10Level: string | number
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export type AnyObject = { [key: string]: any } 