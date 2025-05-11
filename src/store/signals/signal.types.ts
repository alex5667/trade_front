/**
 * Signal Types
 * ------------------------------
 * Типы данных для всех сигналов, используемых в приложении.
 * Включает определения для разных видов торговых сигналов
 * и структуру состояния Redux.
 */

// Интерфейс для состояния соединения
export interface ConnectionState {
	isConnected: boolean
	lastError: string | null
}

// Базовый интерфейс для всех сигналов
export interface BaseSignal {
	symbol: string
	exchange?: string
	timestamp: number
	price?: number
}

/**
 * Сигнал волатильности - показывает резкие изменения волатильности
 * Может содержать информацию о диапазоне (range/avgRange)
 */
export interface VolatilitySignal extends BaseSignal {
	type: 'volatility'
	signalType?: 'volatilitySpike' | 'volatilityRange'
	volatility: number
	volatilityChange: number
	interval?: string // Например, '5m', '1h'
	// Поля для сигналов типа "диапазон волатильности"
	range?: number
	avgRange?: number
	rangeRatio?: number
	// Timestamp when signal was added to the store
	createdAt?: number
	// Данные о свечах
	open?: number
	high?: number
	low?: number
	close?: number
}

/**
 * Сигнал объема - показывает резкие изменения объема торгов
 */
export interface VolumeSignal extends BaseSignal {
	type: 'volume'
	signalType?: 'volumeSpike'
	volume: number
	volumeChange: number
	volumeChangePercent: number
	avgVolume?: number
	interval?: string
}

/**
 * Сигнал изменения цены - резкие изменения цены актива
 */
export interface PriceChangeSignal extends BaseSignal {
	type: 'priceChange'
	signalType?: 'priceSpike'
	price: number
	priceChange: number
	priceChangePercent: number
	interval?: string
	direction: 'up' | 'down'
}

/**
 * Монета в таймфрейме - для отображения топов по изменению цены
 */
export interface TimeframeCoin extends BaseSignal {
	percentChange: number // Процентное изменение цены
	baseVolume?: number // Объем в базовой валюте (например, BTC)
	quoteVolume?: number // Объем в котируемой валюте (например, USDT)
	direction?: 'up' | 'down' // Направление движения
}

/**
 * Монета с данными о ставке финансирования
 */
export interface FundingCoin extends BaseSignal {
	rate: number // Ставка финансирования (в процентах)
	nextFundingTime?: number // Время следующего финансирования (timestamp)
	interval?: string // Интервал финансирования
}

/**
 * Событие-триггер - используется для обновления UI
 */
export interface TriggerEvent {
	timeframe: '5min' | '24h' // Таймфрейм
	type: 'gainers' | 'losers' | 'volume' | 'funding' // Тип триггера
	data: string[] | string // Данные (обычно массив символов)
}

/**
 * Интерфейс для организации монет по таймфрейму
 */
export interface TimeframeData {
	'5min': {
		gainers: TimeframeCoin[] // Топ растущих за 5 минут
		losers: TimeframeCoin[] // Топ падающих за 5 минут
		volume: VolumeSignal[] // Топ по объему за 5 минут
	}
	'24h': {
		gainers: TimeframeCoin[] // Топ растущих за 24 часа
		losers: TimeframeCoin[] // Топ падающих за 24 часа
	}
}

/**
 * Структура для хранения триггер-событий
 */
export interface TriggersData {
	'5min': {
		gainers: string[] // Триггеры для растущих за 5 минут
		losers: string[] // Триггеры для падающих за 5 минут
		volume: string[] // Триггеры для объема за 5 минут
		funding: string[] // Триггеры для финансирования
	}
	'24h': {
		gainers: string[] // Триггеры для растущих за 24 часа
		losers: string[] // Триггеры для падающих за 24 часа
	}
}

/**
 * Состояние сигналов в Redux - основная структура данных для хранения
 * всех сигналов и состояния соединения
 */
export interface SignalsState {
	connection: ConnectionState
	volatilitySignals: VolatilitySignal[]
	volumeSignals: VolumeSignal[]
	priceChangeSignals: PriceChangeSignal[]
	timeframe: TimeframeData
	funding: FundingCoin[]
	triggers: TriggersData
}

/**
 * Типы данных для старых версий компонентов (для совместимости)
 * @deprecated - используйте новые типы выше
 */
export interface VolatilitySpike {
	symbol: string
	timestamp: number
	volatility: number
	volatilityChange: number
	price: number
}

// Volume specific coin data
export interface VolumeCoin extends TimeframeCoin {
	volume: string | number
	volumePercent: string | number
	volume2Level: string | number
	volume5Level: string | number
	volume10Level: string | number
}

// Connection status type
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

// Root signal state interface
export interface SignalState {
	connectionStatus: ConnectionStatus
	volatilitySignals: VolatilitySignal[]
	volumeSignals: VolumeSignal[]
	priceChangeSignals: PriceChangeSignal[]
	topGainers5min: TimeframeCoin[]
	topLosers5min: TimeframeCoin[]
	topVolume5min: VolumeCoin[]
	topFunding5min: FundingCoin[]
	topGainers24h: TimeframeCoin[]
	topLosers24h: TimeframeCoin[]
	triggerGainers5min: string[]
	triggerLosers5min: string[]
	triggerVolume5min: string[]
	triggerFunding5min: string[]
	triggerGainers24h: string[]
	triggerLosers24h: string[]
}

// Helper type for parsing any object structure
export type AnyObject = { [key: string]: any } 