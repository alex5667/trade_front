'use client'

/**
 * Компонент SignalTable
 * ------------------------------
 * Основной компонент для отображения торговых сигналов
 * Использует Redux store для получения данных сигналов
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	selectConnectionStatus,
	selectFundingData,
	selectPriceChangeSignals,
	selectTimeframeData,
	selectTimeframeTriggers,
	selectVolatilitySignals,
	selectVolumeSignals
} from '@/store/signals'
import type { AppDispatch } from '@/store/store'

import styles from './Signal-table.module.scss'
import { ConnectionStatus } from './connection-status/ConnectionStatus'
import { TimeframeSection } from './timeframe-section/TimeframeSection'
import { VolatilitySection } from './volatility-section/VolatilitySection'
import { VolumeSection } from './volume-section/VolumeSection'
// Removed local initializer to avoid double mount; it is provided in /i layout
import { signalApi } from '@/services/signal.api'

/**
 * SignalTable - основной компонент для отображения всех торговых сигналов
 *
 * Этот компонент:
 * 1. Инициализирует WebSocket-соединение для получения сигналов
 * 2. Отображает сигналы по таймфрейму
 * 3. Показывает сигналы волатильности и другие специальные сигналы
 */
export const SignalTable = () => {
	const dispatch = useDispatch<AppDispatch>()
	const componentId = useRef(`signal-table-${Date.now()}`)
	console.log(`📊 [${componentId.current}] SignalTable создан`)

	// Получение данных из Redux с помощью селекторов
	const isConnected = useSelector(selectConnectionStatus)
	const volatilitySignals = useSelector(selectVolatilitySignals)
	const volumeSignals = useSelector(selectVolumeSignals)
	const priceChangeSignals = useSelector(selectPriceChangeSignals)
	const fundingData = useSelector(selectFundingData)
	const triggers = useSelector(selectTimeframeTriggers)
	const timeframeData = useSelector(selectTimeframeData)

	// Безопасная инициализация данных через RTK Query если стор пустой
	useEffect(() => {
		const noTimeframe =
			timeframeData.gainers.length + timeframeData.losers.length === 0
		const noVolumeFunding =
			volumeSignals.length === 0 || fundingData.length === 0
		if (noTimeframe || noVolumeFunding) {
			console.log(
				'🟡 Store empty on mount, triggering RTK Query fetch for initial data'
			)
			dispatch(signalApi.util.invalidateTags(['Signal']))
			dispatch(
				signalApi.endpoints.getTopGainers.initiate(undefined, {
					forceRefetch: true
				})
			)
			dispatch(
				signalApi.endpoints.getTopLosers.initiate(undefined, {
					forceRefetch: true
				})
			)
			dispatch(
				signalApi.endpoints.getVolumeSignals.initiate(undefined, {
					forceRefetch: true
				})
			)
			dispatch(
				signalApi.endpoints.getFundingSignals.initiate(undefined, {
					forceRefetch: true
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Отслеживание предыдущего состояния соединения для логирования изменений
	const prevConnectedRef = useRef(isConnected)

	// Состояние для отслеживания, какие секции загрузились
	const [loadedSections, setLoadedSections] = useState({
		timeframe: false,
		volatility: false
	})

	// Логирование изменений состояния соединения
	useEffect(() => {
		if (prevConnectedRef.current !== isConnected) {
			console.log(
				`🔌 [${componentId.current}] Изменение статуса соединения: ${isConnected ? 'подключено' : 'отключено'}`
			)
			prevConnectedRef.current = isConnected
		}
	}, [isConnected])

	// Логирование получения новых данных
	useEffect(() => {
		console.log(`📈 [${componentId.current}] Получены данные:`, {
			volatilityCount: volatilitySignals.length,
			volumeCount: volumeSignals.length,
			priceChangeCount: priceChangeSignals.length,
			fundingDataCount: fundingData.length,
			triggers: {
				gainers: triggers.gainers.length,
				losers: triggers.losers.length
			}
		})
	}, [
		volatilitySignals,
		volumeSignals,
		priceChangeSignals,
		fundingData,
		triggers
	])

	// Callback при загрузке секции таймфреймов
	const handleTimeframeSectionLoad = useCallback(() => {
		console.log(`⏱️ [${componentId.current}] Секция таймфреймов загружена`)
		setLoadedSections(prev => ({
			...prev,
			timeframe: true
		}))
	}, [])

	// Callback при загрузке секции волатильности
	const handleVolatilitySectionLoad = useCallback(() => {
		console.log(`📊 [${componentId.current}] Секция волатильности загружена`)
		setLoadedSections(prev => ({
			...prev,
			volatility: true
		}))
	}, [])

	// Эффект для отметки секций как загруженных, когда данные доступны
	useEffect(() => {
		if (isConnected) {
			// Проверяем данные таймфреймов и триггеров
			if (
				triggers &&
				(triggers.gainers.length > 0 || triggers.losers.length > 0)
			) {
				handleTimeframeSectionLoad()
			}

			// Проверяем данные волатильности
			if (volatilitySignals.length > 0) {
				handleVolatilitySectionLoad()
			}
		}
	}, [
		isConnected,
		triggers,
		volatilitySignals,
		handleTimeframeSectionLoad,
		handleVolatilitySectionLoad
	])

	// Эффект для отслеживания жизненного цикла компонента
	useEffect(() => {
		// Копируем значение ref в переменную для безопасного использования в cleanup функции
		const currentComponentId = componentId.current
		console.log(`🔄 [${currentComponentId}] SignalTable эффект запущен`)

		return () => {
			console.log(`🛑 [${currentComponentId}] SignalTable размонтирован`)
		}
	}, [])

	return (
		<div className={styles.container}>
			{/* Индикатор статуса соединения */}
			<ConnectionStatus />

			{/* Секции таймфреймов */}
			<div className={styles.section}>
				<TimeframeSection
					timeframe={{
						gainers: timeframeData.gainers,
						losers: timeframeData.losers
					}}
					triggers={{ gainers: triggers.gainers, losers: triggers.losers }}
				/>
			</div>

			{/* Секция волатильности */}
			<div className={styles.section}>
				<VolatilitySection />
			</div>

			{/* Секция объема и финансирования */}
			<div className={styles.section}>
				<VolumeSection />
			</div>
		</div>
	)
}
