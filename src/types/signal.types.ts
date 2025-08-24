'use strict'
// Prisma-aligned signal models for frontend

// Common helpers for number-like values from API (Decimal/BigInt as string)
export type DecimalString = string
export type BigIntString = string

// VolatilityRangeSignal (was VolatilitySignal in legacy)
export interface VolatilityRangeSignal {
	id: string
	type: 'volatility' | 'volatilityRange' | string
	symbol: string
	volatility: DecimalString
	range?: DecimalString
	avgRange?: DecimalString
	receivedAt: string
	timestamp?: string
	createdAt: string
}

// VolatilitySpikeSignal with OHLC
export interface VolatilitySpikeSignal {
	id: string
	type: 'volatilitySpike' | string
	symbol: string
	interval: string
	open: DecimalString
	high: DecimalString
	low: DecimalString
	close: DecimalString
	volatility: DecimalString
	receivedAt: string
	timestamp?: string
	createdAt: string
}

export type AnyVolatilitySignal = VolatilityRangeSignal | VolatilitySpikeSignal

// GainerSignal
export interface GainerSignal {
	id: string
	symbol: string
	change: DecimalString
	price?: DecimalString
	volume?: DecimalString
	quoteVolume?: DecimalString
	timeframe?: string
	receivedAt: string
	timestamp?: string
	createdAt: string
}

// LoserSignal
export interface LoserSignal {
	id: string
	symbol: string
	change: DecimalString
	price?: DecimalString
	volume?: DecimalString
	quoteVolume?: DecimalString
	timeframe?: string
	receivedAt: string
	timestamp?: string
	createdAt: string
}

// VolumeSignal (Prisma)
export interface VolumeSignalPrisma {
	id: string
	type: 'volume' | string
	symbol: string
	volume: DecimalString
	change: DecimalString
	price?: DecimalString
	volumePercent?: DecimalString
	volume2Level?: DecimalString
	volume5Level?: DecimalString
	volume10Level?: DecimalString
	timeframe?: string
	receivedAt: string
	timestamp?: string
	createdAt: string
}

// FundingSignal (Prisma)
export interface FundingSignalPrisma {
	id: string
	type: 'funding' | string
	symbol: string
	rate: DecimalString
	change: DecimalString
	nextRate?: DecimalString
	timeframe?: string
	receivedAt: string
	timestamp?: string
	createdAt: string
}

// Aggregated top-moves item (for /trading-signals/gainers|losers)
export interface TopMoveItem {
	symbol: string
	price?: number
	changePct?: number
	direction?: 'UP' | 'DOWN' | string
	timestamp?: string
}

