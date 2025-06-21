/**
 * Signal Selectors
 * ------------------------------
 * Селекторы для доступа к данным сигналов из хранилища Redux
 * Позволяют получать определенные части состояния для компонентов
 */

import { TypeRootState } from '@/store/store'
import { createSelector } from '@reduxjs/toolkit'

// Базовые селекторы для доступа к состоянию каждого слайса
export const selectVolatilityState = (state: TypeRootState) => state.volatility
export const selectVolatilitySpikeState = (state: TypeRootState) => state.volatilitySpike
export const selectVolatilityRangeState = (state: TypeRootState) => state.volatilityRange
export const selectVolumeState = (state: TypeRootState) => state.volume
export const selectPriceChangeState = (state: TypeRootState) => state.priceChange
export const selectConnectionState = (state: TypeRootState) => state.connection
export const selectTimeframeState = (state: TypeRootState) => state.timeframe
export const selectTriggerState = (state: TypeRootState) => state.trigger
// Селекторы сигналов волатильности
export const selectVolatilitySignals = (state: TypeRootState) =>
	state.volatility?.signals || []

// Специализированные селекторы для разных типов волатильности
export const selectVolatilitySpikeSignals = (state: TypeRootState) =>
	state.volatilitySpike?.signals || []

export const selectVolatilityRangeSignals = (state: TypeRootState) =>
	state.volatilityRange?.signals || []

// Селекторы для получения последнего обновления
export const selectVolatilityLastUpdated = (state: TypeRootState) =>
	state.volatility?.lastUpdated || 0

export const selectVolatilitySpikeLastUpdated = (state: TypeRootState) =>
	state.volatilitySpike?.lastUpdated || 0

export const selectVolatilityRangeLastUpdated = (state: TypeRootState) =>
	state.volatilityRange?.lastUpdated || 0

// Селектор статуса подключения
export const selectConnectionStatus = (state: TypeRootState) =>
	state.connection?.isConnected || false

export const selectConnectionError = (state: TypeRootState) =>
	state.connection?.lastError || null

// Селекторы сигналов объема
export const selectVolumeSignals = (state: TypeRootState) =>
	state.volume?.signals || []

// Селекторы сигналов изменения цены
export const selectPriceChangeSignals = (state: TypeRootState) =>
	state.priceChange?.signals || []

// Комбинированный селектор для всех типов волатильности
export const selectCombinedVolatilitySignals = createSelector(
	[selectVolatilitySpikeSignals, selectVolatilityRangeSignals],
	(spikeSignals, rangeSignals) => {
		// Combine and sort by timestamp (newest first)
		return [...spikeSignals, ...rangeSignals]
			.sort((a, b) => b.timestamp - a.timestamp)
	}
)

// Селекторы таймфреймов - 24 часа
export const selectTopGainers24h = (state: TypeRootState) =>
	state.timeframe?.['24h']?.gainers || []

export const selectTopLosers24h = (state: TypeRootState) =>
	state.timeframe?.['24h']?.losers || []

// Селекторы триггеров
export const selectTriggerGainers24h = (state: TypeRootState) =>
	state.trigger?.['24h']?.gainers || []

export const selectTriggerLosers24h = (state: TypeRootState) =>
	state.trigger?.['24h']?.losers || []

// Мемоизированные селекторы для часто используемых комбинаций данных
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
 * Селектор для получения всех данных о таймфреймах
 * Используется для централизованного доступа к данным 24h
 */
export const selectTimeframeData = createSelector(
	[selectTimeframe24hData],
	(data24h) => ({
		'24h': data24h
	})
)

/**
 * Селектор для получения всех триггеров
 */
export const selectTimeframeTriggers = createSelector(
	[selectTrigger24hData],
	(triggers24h) => ({
		'24h': triggers24h
	})
)

/**
 * Селектор для получения данных о финансировании
 */
export const selectFundingData = () => [] 