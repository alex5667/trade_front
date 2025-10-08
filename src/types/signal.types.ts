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

// Market Regime Signal
export type RegimeType = 'range' | 'squeeze' | 'trending_bull' | 'trending_bear' | 'expansion'

export interface RegimeSignal {
	regime: RegimeType
	adx?: number
	atrPct?: number
	timestamp?: string
}

// Regime Snapshot (от API)
export interface RegimeSnapshot {
	id?: string
	symbol: string
	timeframe: string
	regime: RegimeType
	adx: number
	atrPct: number
	timestamp: string
	createdAt?: string
}

// Параметры запроса временного ряда режима
export interface RegimeSnapshotParams {
	symbol: string
	timeframe: string
	from?: string
	to?: string
	limit?: number
}

// Квантили ADX/ATR%
export interface RegimeQuantiles {
	symbol: string
	timeframe: string
	adxQ25?: number
	adxQ50?: number
	adxQ75?: number
	atrQ25?: number
	atrQ50?: number
	atrQ75?: number
	updatedAt?: string
}

// Серии данных для графиков
export interface RegimeSeries {
	adx: number[]
	atrPct: number[]
}

// Типы сигналов для фильтрации
export type SignalTypeFilter = 'fvg' | 'ob' | 'breaker' | 'volumeSpike' | 'volatility' | 'smt' | 'other'

// Сторона сделки
export type TradeSide = 'long' | 'short'

// Фильтруемый сигнал
export interface FilterableSignal {
	type: SignalTypeFilter
	side?: TradeSide
	symbol?: string
	[key: string]: any
}

// Health status типы
export type HealthStatus = 'ok' | 'warn' | 'error'

export interface RegimeHealthSamples {
	actual: number
	expected: number
}

export interface RegimeHealthResponse {
	symbol: string
	timeframe: string
	status: HealthStatus
	lastSnapshot?: {
		timestamp: string
		lagSec: number
	}
	quantilesPresent: boolean
	samples: {
		last1h: RegimeHealthSamples
		last1d: RegimeHealthSamples
	}
}

// Aggregation типы
export interface RegimeAggHourly {
	hour: string
	counts: Record<RegimeType, number>
	avgAdx: number
	avgAtrPct: number
}

export interface RegimeAggDaily {
	date: string
	counts: Record<RegimeType, number>
	avgAdx: number
	avgAtrPct: number
}

// Context типы
export interface RegimeContextSnapshot {
	regime: RegimeType
	adx: number
	atrPct: number
	timestamp: string
}

export interface RegimeContextResponse {
	symbol: string
	ltf: string
	htf: string
	latestLTF?: RegimeContextSnapshot
	latestHTF?: RegimeContextSnapshot
	allowed: boolean
	bias: string
	signalType?: string
	side?: TradeSide
}

// Alert типы
export interface RegimeAlert {
	symbol: string
	timeframe: string
	status: HealthStatus
	recovered?: boolean
	lagSec?: number
	issues?: string[]
	timestamp?: string
}

