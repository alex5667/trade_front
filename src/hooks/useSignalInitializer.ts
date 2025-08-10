/**
 * Хук для инициализации сигналов
 * ------------------------------
 * Делает HTTP запросы для получения начальных данных, когда store пустой
 * Используется для заполнения store данными до установки WebSocket соединения
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	useGetFundingSignalsQuery,
	useGetTopGainersQuery,
	useGetTopLosersQuery,
	useGetVolatilitySignalsQuery,
	useGetVolumeSignalsQuery
} from '@/services/signal.api'

import { selectTimeframeData, selectVolatilitySignals, selectVolumeSignals } from '@/store/signals'
import { selectFundingData } from '@/store/signals/selectors/signals.selectors'
import { replaceFundingData } from '@/store/signals/slices/funding.slice'
import { replaceTimeframeGainers, replaceTimeframeLosers } from '@/store/signals/slices/timeframe.slice'
import { addVolatilityRangeSignal } from '@/store/signals/slices/volatility-range.slice'
import { addVolatilitySpikeSignal } from '@/store/signals/slices/volatility-spike.slice'
import { addVolumeSignal } from '@/store/signals/slices/volume.slice'
import { parseFundingCoins, parseTimeframeCoins, parseVolatilitySignals, parseVolumeCoins } from '@/store/signals/utils/signal-parsers'
import { AppDispatch } from '@/store/store'

export const useSignalInitializer = () => {
	const dispatch = useDispatch<AppDispatch>()

	// Текущее состояние store
	const timeframeData = useSelector(selectTimeframeData)
	const volatilitySignals = useSelector(selectVolatilitySignals)
	const volumeSignals = useSelector(selectVolumeSignals)
	const fundingCoins = useSelector(selectFundingData)

	const POLL_30_MIN = 30 * 60 // секунд

	// RTK Query хуки для получения данных напрямую с backend (polling каждые 30 минут)
	const { data: topGainersData, isLoading: isLoadingGainers } = useGetTopGainersQuery(undefined, {
		skip: false,
		pollingInterval: POLL_30_MIN * 1000,
	})

	const { data: topLosersData, isLoading: isLoadingLosers } = useGetTopLosersQuery(undefined, {
		skip: false,
		pollingInterval: POLL_30_MIN * 1000,
	})

	const { data: volumeData, isLoading: isLoadingVolume } = useGetVolumeSignalsQuery(undefined, {
		skip: false,
		pollingInterval: POLL_30_MIN * 1000,
	})

	const { data: fundingData, isLoading: isLoadingFunding } = useGetFundingSignalsQuery(undefined, {
		skip: false,
		pollingInterval: POLL_30_MIN * 1000,
	})

	// Волатильность при необходимости (если нужна)
	const { data: volatilityData, isLoading: isLoadingVolatility } = useGetVolatilitySignalsQuery(undefined, {
		skip: false,
		pollingInterval: POLL_30_MIN * 1000,
	})

	// Инициализация топ-гейнеров
	useEffect(() => {
		if (topGainersData) {
			const coins = parseTimeframeCoins(topGainersData)
			if (coins.length > 0) dispatch(replaceTimeframeGainers({ data: coins }))
		}
	}, [topGainersData, dispatch])

	// Инициализация топ-лузеров
	useEffect(() => {
		if (topLosersData) {
			const coins = parseTimeframeCoins(topLosersData)
			if (coins.length > 0) dispatch(replaceTimeframeLosers({ data: coins }))
		}
	}, [topLosersData, dispatch])

	// Инициализация сигналов волатильности
	useEffect(() => {
		if (volatilityData) {
			const signals = parseVolatilitySignals(volatilityData)
			signals.forEach(signal => {
				if (signal.type === 'volatilitySpike') {
					dispatch(addVolatilitySpikeSignal(signal))
				} else if (signal.type === 'volatilityRange') {
					dispatch(addVolatilityRangeSignal(signal))
				}
			})
		}
	}, [volatilityData, dispatch])

	// Инициализация сигналов объема
	useEffect(() => {
		if (volumeData) {
			const parsed = parseVolumeCoins(volumeData)
			parsed.forEach((item) => {
				const rawChange = (item as any)?.change
				const signal = {
					type: 'volume',
					symbol: item.symbol,
					timestamp: Date.now(),
					change: typeof rawChange === 'string' ? Number(rawChange) : Number(rawChange ?? 0),
					volume: typeof item.volume === 'string' ? Number(item.volume) : Number(item.volume ?? 0),
					volumePercent: typeof item.volumePercent === 'string' ? Number(item.volumePercent) : Number(item.volumePercent ?? 0),
					volume2Level: typeof item.volume2Level === 'string' ? Number(item.volume2Level) : Number(item.volume2Level ?? 0),
					volume5Level: typeof item.volume5Level === 'string' ? Number(item.volume5Level) : Number(item.volume5Level ?? 0),
					volume10Level: typeof item.volume10Level === 'string' ? Number(item.volume10Level) : Number(item.volume10Level ?? 0),
				} as const
				dispatch(addVolumeSignal(signal as any))
			})
		}
	}, [volumeData, dispatch])

	// Инициализация данных финансирования
	useEffect(() => {
		if (fundingData) {
			const coins = parseFundingCoins(fundingData)
			if (coins.length > 0) dispatch(replaceFundingData(coins))
		}
	}, [fundingData, dispatch])

	const isLoading = isLoadingGainers || isLoadingLosers || isLoadingVolume || isLoadingFunding || isLoadingVolatility

	return {
		isLoading,
		hasInitialData: (timeframeData.gainers.length + timeframeData.losers.length + volatilitySignals.length + volumeSignals.length + fundingCoins.length) > 0,
	}
} 