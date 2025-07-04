'use client'

/**
 * Компонент SignalTable
 * ------------------------------
 * Основной компонент для отображения торговых сигналов
 * Использует Redux store для получения данных сигналов
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
import { TimeframeSection } from './timeframe-section/TimeframeSection'
import { VolatilitySection } from './volatility-section/VolatilitySection'

/**
 * SignalTable - основной компонент для отображения всех торговых сигналов
 *
 * Этот компонент:
 * 1. Инициализирует WebSocket-соединение для получения сигналов
 * 2. Отображает сигналы по таймфрейму 24 часа
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
				(triggers['24h'].gainers.length > 0 ||
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
		// Копируем значение ref в переменную для безопасного использования в cleanup функции
		const currentComponentId = componentId.current
		console.log(`🔄 [${currentComponentId}] SignalTable эффект запущен`)

		return () => {
			console.log(`🛑 [${currentComponentId}] SignalTable размонтирован`)
		}
	}, [])

	return (
		<div className={styles.container}>
			{/* Инициализация WebSocket соединения */}
			<SignalSocketInitializer />

			{/* Индикатор статуса соединения */}
			<ConnectionStatus />

			{/* Секции таймфреймов */}
			<div className={styles.section}>
				<TimeframeSection
					timeframe24h={{
						gainers: timeframeData['24h'].gainers,
						losers: timeframeData['24h'].losers
					}}
					trigger24h={{
						gainers: triggers['24h'].gainers,
						losers: triggers['24h'].losers
					}}
				/>
			</div>

			{/* Секция волатильности */}
			<div className={styles.section}>
				<VolatilitySection />
			</div>
		</div>
	)
}
