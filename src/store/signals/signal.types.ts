/**
 * Типы сигналов
 * ------------------------------
 * Типы данных для всех сигналов, используемых в приложении.
 * Включает определения для разных видов торговых сигналов
 * и структуру состояния Redux.
 * 
 * Основные категории типов:
 * - Состояние соединения (ConnectionState)
 * - Торговые сигналы (VolatilitySignal, VolumeSignal, PriceChangeSignal)
 * - Данные по таймфреймам (TimeframeCoin, TimeframeData)
 * - Триггерные события (TriggerEvent, TriggersData)
 * - Состояние Redux (SignalsState)
 */

/** Интерфейс для состояния WebSocket соединения */
export interface ConnectionState {
	/** Флаг активности соединения */
	isConnected: boolean
	/** Последняя ошибка соединения (null если ошибок нет) */
	lastError: string | null
}

/** Базовый интерфейс для всех торговых сигналов */
export interface BaseSignal {
	/** Символ торговой пары (например, BTCUSDT) */
	symbol: string
	/** Биржа (опционально) */
	exchange?: string
	/** Временная метка события (Unix timestamp) */
	timestamp: number
	/** Цена актива на момент сигнала (опционально) */
	price?: number
	/** Время добавления сигнала в хранилище (Unix timestamp) */
	createdAt?: number
}

/**
 * Сигнал волатильности
 * 
 * Показывает резкие изменения волатильности торгового инструмента.
 * Может содержать информацию о диапазоне волатильности или всплесках.
 */
export interface VolatilitySignal extends BaseSignal {
	/** Тип сигнала (всегда 'volatility') */
	type: 'volatility'
	/** Подтип сигнала волатильности */
	signalType?: 'volatilitySpike' | 'volatilityRange'
	/** Текущее значение волатильности */
	volatility: number
	/** Изменение волатильности */
	volatilityChange: number
	/** Временной интервал (например, '1h', '4h') */
	interval?: string

	// Поля для сигналов типа "диапазон волатильности"
	/** Диапазон цен (high - low) */
	range?: number
	/** Средний диапазон за период */
	avgRange?: number
	/** Отношение текущего диапазона к среднему */
	rangeRatio?: number

	// Данные о свечах (OHLC)
	/** Цена открытия */
	open?: number
	/** Максимальная цена */
	high?: number
	/** Минимальная цена */
	low?: number
	/** Цена закрытия */
	close?: number
}

/**
 * Сигнал объема торгов
 * 
 * Показывает резкие изменения объема торгов для торгового инструмента.
 * Используется для выявления аномальной торговой активности.
 */
export interface VolumeSignal extends BaseSignal {
	/** Тип сигнала (всегда 'volume') */
	type: 'volume'
	/** Подтип сигнала объема */
	signalType?: 'volumeSpike'
	/** Текущий объем торгов */
	volume: number
	/** Абсолютное изменение объема */
	volumeChange: number
	/** Процентное изменение объема */
	volumeChangePercent: number
	/** Средний объем за период (опционально) */
	avgVolume?: number
	/** Временной интервал */
	interval?: string
}

/**
 * Сигнал изменения цены
 * 
 * Показывает резкие изменения цены торгового инструмента.
 * Используется для выявления значительных ценовых движений.
 */
export interface PriceChangeSignal extends BaseSignal {
	/** Тип сигнала (всегда 'priceChange') */
	type: 'priceChange'
	/** Подтип сигнала цены */
	signalType?: 'priceSpike'
	/** Текущая цена */
	price: number
	/** Абсолютное изменение цены */
	priceChange: number
	/** Процентное изменение цены */
	priceChangePercent: number
	/** Временной интервал */
	interval?: string
	/** Направление движения цены */
	direction: 'up' | 'down'
}

/**
 * Монета в таймфрейме
 * 
 * Представляет торговый инструмент с данными об изменении цены
 * за определенный период времени. Используется для создания
 * топов растущих/падающих активов.
 */
export interface TimeframeCoin extends BaseSignal {
	/** Процентное изменение цены за период */
	percentChange: number
	/** Объем в базовой валюте (например, BTC в паре BTCUSDT) */
	baseVolume?: number
	/** Объем в котируемой валюте (например, USDT в паре BTCUSDT) */
	quoteVolume?: number
	/** Направление движения цены */
	direction?: 'up' | 'down'
}

/**
 * Монета с данными о ставке финансирования
 * 
 * Содержит информацию о ставке финансирования для фьючерсных
 * контрактов. Используется для анализа настроений рынка.
 */
export interface FundingCoin extends BaseSignal {
	/** Ставка финансирования (в процентах) */
	rate: number
	/** Время следующего финансирования (Unix timestamp) */
	nextFundingTime?: number
	/** Интервал финансирования (например, '8h') */
	interval?: string
}

/**
 * Событие-триггер
 * 
 * Используется для уведомления UI компонентов о необходимости
 * обновления данных. Содержит информацию о типе события и
 * связанных с ним данных.
 */
export interface TriggerEvent {
	/** Временной период события (только 24 часа) */
	timeframe: '24h'
	/** Тип триггерного события */
	type: 'gainers' | 'losers'
	/** Данные события (обычно массив символов торговых пар) */
	data: string[] | string
}

/**
 * Данные по таймфреймам
 * 
 * Организует торговые данные по временным периодам.
 * Содержит топы растущих/падающих активов.
 */
export interface TimeframeData {
	/** Данные за 24 часа */
	'24h': {
		/** Топ растущих активов за 24 часа */
		gainers: TimeframeCoin[]
		/** Топ падающих активов за 24 часа */
		losers: TimeframeCoin[]
	}
}

/**
 * Структура для хранения триггерных событий
 * 
 * Организует триггерные события по временным периодам и типам.
 * Используется для уведомления UI о необходимости обновления.
 */
export interface TriggersData {
	/** Триггеры за 24 часа */
	'24h': {
		/** Триггеры для растущих активов */
		gainers: string[]
		/** Триггеры для падающих активов */
		losers: string[]
	}
}

/**
 * Основное состояние всех сигналов в Redux хранилище
 * 
 * Содержит данные о соединении, всех типах сигналов,
 * данные по таймфреймам и триггерные события для UI.
 * Используется как корневое состояние в store.
 */
export interface SignalsState {
	/** Состояние WebSocket соединения */
	connection: ConnectionState
	/** Массив сигналов волатильности */
	volatilitySignals: VolatilitySignal[]
	/** Массив сигналов объема */
	volumeSignals: VolumeSignal[]
	/** Массив сигналов изменения цены */
	priceChangeSignals: PriceChangeSignal[]
	/** Данные по таймфреймам */
	timeframe: TimeframeData
	/** Данные о ставках финансирования */
	funding: FundingCoin[]
	/** Триггерные события */
	triggers: TriggersData
}

/**
 * Интерфейс для всплеска волатильности
 * 
 * Упрощенная версия сигнала волатильности для
 * специфических случаев использования.
 */
export interface VolatilitySpike {
	symbol: string
	timestamp: number
	volatility: number
	volatilityChange: number
	price: number
}

/**
 * Расширенный интерфейс монеты с данными объема
 * 
 * Добавляет к базовой монете различные уровни объема
 * для более детального анализа торговой активности.
 */
export interface VolumeCoin extends TimeframeCoin {
	volume: string | number
	volumePercent: string | number
	volume2Level: string | number
	volume5Level: string | number
	volume10Level: string | number
}

/** Тип статуса соединения */
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

/** Упрощенное состояние сигналов для совместимости */
export interface SignalState {
	connectionStatus: ConnectionStatus
	volatilitySignals: VolatilitySignal[]
	volumeSignals: VolumeSignal[]
	priceChangeSignals: PriceChangeSignal[]
	topGainers24h: TimeframeCoin[]
	topLosers24h: TimeframeCoin[]
	triggerGainers24h: string[]
	triggerLosers24h: string[]
}

/** Тип для любого объекта */
export type AnyObject = { [key: string]: any } 