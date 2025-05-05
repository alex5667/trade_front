/**
 * Signal Selectors
 * ------------------------------
 * Селекторы для доступа к данным сигналов из хранилища Redux
 * Позволяют получать определенные части состояния для компонентов
 */

import { TypeRootState } from '@/store/store'
import { createSelector } from '@reduxjs/toolkit'

// Селекторы состояния соединения
export const selectConnectionStatus = (state: TypeRootState) =>
	state.connection.status

export const selectConnectionError = (state: TypeRootState) =>
	state.connection.error

// Селекторы сигналов волатильности
export const selectVolatilitySignals = (state: TypeRootState) =>
	state.volatility.signals

// Селекторы сигналов объема
export const selectVolumeSignals = (state: TypeRootState) =>
	state.volume.signals

// Селекторы сигналов изменения цены
export const selectPriceChangeSignals = (state: TypeRootState) =>
	state.priceChange.signals

// Селекторы таймфреймов - 5 минут
export const selectTopGainers5min = (state: TypeRootState) =>
	state.timeframe.topGainers5min

export const selectTopLosers5min = (state: TypeRootState) =>
	state.timeframe.topLosers5min

export const selectTopVolume5min = (state: TypeRootState) =>
	state.timeframe.topVolume5min

export const selectTopFunding5min = (state: TypeRootState) =>
	state.timeframe.topFunding5min

// Селекторы таймфреймов - 24 часа
export const selectTopGainers24h = (state: TypeRootState) =>
	state.timeframe.topGainers24h

export const selectTopLosers24h = (state: TypeRootState) =>
	state.timeframe.topLosers24h

// Селекторы триггеров
export const selectTriggerGainers5min = (state: TypeRootState) =>
	state.trigger.triggerGainers5min

export const selectTriggerLosers5min = (state: TypeRootState) =>
	state.trigger.triggerLosers5min

export const selectTriggerVolume5min = (state: TypeRootState) =>
	state.trigger.triggerVolume5min

export const selectTriggerFunding5min = (state: TypeRootState) =>
	state.trigger.triggerFunding5min

export const selectTriggerGainers24h = (state: TypeRootState) =>
	state.trigger.triggerGainers24h

export const selectTriggerLosers24h = (state: TypeRootState) =>
	state.trigger.triggerLosers24h

// Мемоизированные селекторы для часто используемых комбинаций данных
/**
 * Сгруппированные данные для таймфрейма 5 минут
 * Включает растущие, падающие, объём и финансирование
 */
export const selectTimeframe5minData = createSelector(
	[
		selectTopGainers5min,
		selectTopLosers5min,
		selectTopVolume5min,
		selectTopFunding5min
	],
	(gainers, losers, volume, funding) => ({
		gainers,
		losers,
		volume,
		funding
	})
)

/**
 * Сгруппированные данные для таймфрейма 24 часа
 * Включает только растущие и падающие монеты
 */
export const selectTimeframe24hData = createSelector(
	[
		selectTopGainers24h,
		selectTopLosers24h
	],
	(gainers, losers) => ({
		gainers,
		losers
	})
)

/**
 * Сгруппированные данные триггеров для таймфрейма 5 минут
 * Используются для обновления UI при получении новых сигналов
 */
export const selectTrigger5minData = createSelector(
	[
		selectTriggerGainers5min,
		selectTriggerLosers5min,
		selectTriggerVolume5min,
		selectTriggerFunding5min
	],
	(gainers, losers, volume, funding) => ({
		gainers,
		losers,
		volume,
		funding
	})
)

/**
 * Сгруппированные данные триггеров для таймфрейма 24 часа
 * Используются для обновления UI при получении новых сигналов
 */
export const selectTrigger24hData = createSelector(
	[
		selectTriggerGainers24h,
		selectTriggerLosers24h
	],
	(gainers, losers) => ({
		gainers,
		losers
	})
)

/**
 * Селектор для получения всех данных о таймфреймах и триггерах
 * Используется для централизованного доступа ко всем данным
 */
export const selectTimeframeData = createSelector(
	[selectTimeframe5minData, selectTimeframe24hData],
	(data5min, data24h) => ({
		'5min': data5min,
		'24h': data24h
	})
)

/**
 * Селектор для получения всех триггеров
 */
export const selectTimeframeTriggers = createSelector(
	[selectTrigger5minData, selectTrigger24hData],
	(triggers5min, triggers24h) => ({
		'5min': triggers5min,
		'24h': triggers24h
	})
)

/**
 * Селектор для получения данных о финансировании
 */
export const selectFundingData = createSelector(
	[selectTopFunding5min],
	(funding) => funding
) 