'use client'

/**
 * SignalTable Component
 * ------------------------------
 * Main component for displaying trading signals
 * Uses Redux store for signal data
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
	selectConnectionStatus,
	selectFundingData,
	selectPriceChangeSignals,
	selectTimeframeData,
	selectTimeframeTriggers,
	selectVolatilitySignals,
	selectVolumeSignals
} from '@/store/signals'

import styles from './Signal-table.module.scss'
import { SignalSocketInitializer } from './SignalSocketInitializer'
import { ConnectionStatus } from './connection-status/ConnectionStatus'
import { VolatilitySection } from './volatility-section/VolatilitySection'

/**
 * SignalTable - основной компонент для отображения всех торговых сигналов
 *
 * Этот компонент:
 * 1. Инициализирует WebSocket-соединение для получения сигналов
 * 2. Отображает сигналы по таймфреймам (5 минут и 24 часа)
 * 3. Показывает сигналы волатильности и другие специальные сигналы
 */
export const SignalTable = () => {
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
			trigerrs5min: {
				gainers: triggers['5min'].gainers.length,
				losers: triggers['5min'].losers.length,
				volume: triggers['5min'].volume.length,
				funding: triggers['5min'].funding.length
			},
			triggers24h: {
				gainers: triggers['24h'].gainers.length,
				losers: triggers['24h'].losers.length
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
	}, [componentId])

	// Callback при загрузке секции волатильности
	const handleVolatilitySectionLoad = useCallback(() => {
		console.log(`📊 [${componentId.current}] Секция волатильности загружена`)
		setLoadedSections(prev => ({
			...prev,
			volatility: true
		}))
	}, [componentId])

	// Эффект для отметки секций как загруженных, когда данные доступны
	useEffect(() => {
		if (isConnected) {
			// Проверяем данные таймфреймов и триггеров
			if (
				triggers &&
				(triggers['5min'].gainers.length > 0 ||
					triggers['5min'].losers.length > 0 ||
					triggers['24h'].gainers.length > 0 ||
					triggers['24h'].losers.length > 0)
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
		console.log(`🔄 [${componentId.current}] SignalTable эффект запущен`)

		return () => {
			console.log(`🛑 [${componentId.current}] SignalTable размонтирован`)
		}
	}, [componentId])

	return (
		<div className={styles.container}>
			{/* Initialize WebSocket connection */}
			<SignalSocketInitializer />

			{/* Connection status indicator */}
			<ConnectionStatus />

			{/* Timeframe sections */}
			{/* <div className={styles.section}>
				<TimeframeSection
					timeframe5min={{
						gainers: timeframeData['5min'].gainers,
						losers: timeframeData['5min'].losers,
						volume: timeframeData['5min'].volume,
						funding: fundingData
					}}
					timeframe24h={{
						gainers: timeframeData['24h'].gainers,
						losers: timeframeData['24h'].losers
					}}
					trigger5min={{
						gainers: triggers['5min'].gainers,
						losers: triggers['5min'].losers,
						volume: triggers['5min'].volume,
						funding: triggers['5min'].funding
					}}
					trigger24h={{
						gainers: triggers['24h'].gainers,
						losers: triggers['24h'].losers
					}}
				/>
			</div> */}

			{/* Volatility section */}
			<div className={styles.section}>
				<VolatilitySection />
			</div>
		</div>
	)
}
