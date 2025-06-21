'use strict'

/**
 * Типы данных, возвращаемые методом getAllTradingData
 * 
 * Эти типы используются для типизации данных, получаемых с бэкенда,
 * и могут быть импортированы на фронтенде для строгой типизации.
 */

/**
 * Базовый интерфейс для всех символов (торговых пар)
 */
export interface BaseSymbol {
	symbol: string
}

/**
 * Интерфейс для сигналов о росте/падении цены
 */
export interface GainerLoserSymbol extends BaseSymbol {
	change: string | number // Изменение цены (может быть строкой или числом)
}

/**
 * Интерфейс для данных об объеме торгов
 */
export interface VolumeSymbol extends BaseSymbol {
	volume: string | number // Объем торгов
	change: string | number // Изменение цены
	volumePercent: string | number // Процент объема от общего
	volume2Level: string | number // Уровень объема 2%
	volume5Level: string | number // Уровень объема 5%
	volume10Level: string | number // Уровень объема 10%
}

/**
 * Интерфейс для данных о ставках финансирования
 */
export interface FundingSymbol extends BaseSymbol {
	rate: string | number // Ставка финансирования
	change: string | number // Изменение ставки
}

/**
 * Интерфейс для данных тикера с Binance
 */
export interface BinanceTicker24h {
	symbol: string // Символ торговой пары
	priceChange: string // Изменение цены
	priceChangePercent: string // Процентное изменение цены
	weightedAvgPrice: string // Средневзвешенная цена
	prevClosePrice: string // Предыдущая цена закрытия
	lastPrice: string // Последняя цена
	lastQty: string // Последнее количество
	bidPrice: string // Цена покупки
	bidQty: string // Количество на покупку
	askPrice: string // Цена продажи
	askQty: string // Количество на продажу
	openPrice: string // Цена открытия
	highPrice: string // Максимальная цена
	lowPrice: string // Минимальная цена
	volume: string // Объем в базовой валюте
	quoteVolume: string // Объем в котируемой валюте
	openTime: number // Время открытия
	closeTime: number // Время закрытия
	firstId: number // ID первой сделки
	lastId: number // ID последней сделки
	count: number // Количество сделок
}

/**
 * Интерфейс для данных о ставке финансирования с Binance
 */
export interface BinanceFundingRate {
	symbol: string // Символ торговой пары
	markPrice: string // Цена маркировки
	indexPrice: string // Индексная цена
	estimatedSettlePrice: string // Предполагаемая цена расчета
	lastFundingRate: string // Последняя ставка финансирования
	interestRate: string // Процентная ставка
	nextFundingTime: number // Время следующего финансирования
	time: number // Время
}

/**
 * Интерфейс для структуры данных за 24 часа
 */
export interface Timeframe24hData {
	gainers: GainerLoserSymbol[] // Данные о росте цены
	losers: GainerLoserSymbol[] // Данные о падении цены
}

/**
 * Интерфейс для данных с Binance
 */
export interface BinanceData {
	ticker24h: BinanceTicker24h[] // Данные тикера за 24 часа
	fundingRate: BinanceFundingRate[] // Данные о ставках финансирования
}

/**
 * Интерфейс для полного набора торговых данных
 * Соответствует возвращаемому типу метода getAllTradingData
 */
export interface AllTradingData {
	timeframe24h: Timeframe24hData // Данные за 24 часа
	binanceData: BinanceData // Данные с Binance
} 