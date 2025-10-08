/**
 * Компонент RegimeWidget - виджет отображения рыночного режима
 * ------------------------------
 * Загружает данные о рыночном режиме из API и отображает их
 * с опциональными спарклайнами и live обновлениями через WebSocket
 */
'use client'

import React, { useEffect, useState } from 'react'

import { PngSparkline } from '@/components/sparkline'

import { RegimeSeries, RegimeSnapshot } from '@/types/signal.types'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'

import { RegimeBadge } from './RegimeBadge'
import styles from './RegimeWidget.module.scss'
import { fetchRegimeLatest, fetchRegimeRange } from '@/services/regime.api'

/**
 * Компонент RegimeWidget - виджет отображения рыночного режима
 * ------------------------------
 * Загружает данные о рыночном режиме из API и отображает их
 * с опциональными спарклайнами и live обновлениями через WebSocket
 */

interface RegimeWidgetProps {
	symbol: string
	timeframe: string
	className?: string
	showStatus?: boolean
	showSparkline?: boolean
	sparklinePoints?: number
	autoUpdate?: boolean
	sparklineType?: 'svg' | 'png'
}

export const RegimeWidget: React.FC<RegimeWidgetProps> = ({
	symbol,
	timeframe,
	className = '',
	showStatus = true,
	showSparkline = true,
	sparklinePoints = 300,
	autoUpdate = true,
	sparklineType = 'svg'
}) => {
	const { regime: liveRegime, isConnected } = useRegimeSocket()
	const [latest, setLatest] = useState<RegimeSnapshot | null>(null)
	const [series, setSeries] = useState<RegimeSeries>({ adx: [], atrPct: [] })
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Первичная загрузка данных
	useEffect(() => {
		let cancelled = false

		const loadData = async () => {
			try {
				setIsLoading(true)
				setError(null)

				const [latestData, rangeData] = await Promise.all([
					fetchRegimeLatest(symbol, timeframe),
					showSparkline
						? fetchRegimeRange({ symbol, timeframe, limit: sparklinePoints })
						: Promise.resolve([])
				])

				if (cancelled) return

				setLatest(latestData)

				if (showSparkline && rangeData.length > 0) {
					setSeries({
						adx: rangeData.map(r => Number(r.adx ?? 0)),
						atrPct: rangeData.map(r => Number(r.atrPct ?? 0))
					})
				}
			} catch (err) {
				if (cancelled) return
				console.error('Error loading regime data:', err)
				setError(err instanceof Error ? err.message : 'Failed to load data')
			} finally {
				if (!cancelled) {
					setIsLoading(false)
				}
			}
		}

		loadData()

		return () => {
			cancelled = true
		}
	}, [symbol, timeframe, showSparkline, sparklinePoints])

	// Live обновление от WebSocket
	useEffect(() => {
		if (!autoUpdate || !liveRegime) return
		if (liveRegime.symbol !== symbol || liveRegime.timeframe !== timeframe)
			return

		setLatest(prev => ({
			...prev,
			symbol: liveRegime.symbol || symbol,
			timeframe: liveRegime.timeframe || timeframe,
			regime: liveRegime.regime,
			adx: liveRegime.adx ?? prev?.adx ?? 0,
			atrPct: liveRegime.atrPct ?? prev?.atrPct ?? 0,
			timestamp: liveRegime.timestamp || new Date().toISOString()
		}))

		// Обновляем серию данных для спарклайна
		if (showSparkline) {
			setSeries(prev => ({
				adx: [
					...prev.adx.slice(-sparklinePoints + 1),
					Number(liveRegime.adx ?? 0)
				],
				atrPct: [
					...prev.atrPct.slice(-sparklinePoints + 1),
					Number(liveRegime.atrPct ?? 0)
				]
			}))
		}
	}, [
		liveRegime,
		symbol,
		timeframe,
		sparklinePoints,
		showSparkline,
		autoUpdate
	])

	if (isLoading) {
		return (
			<div className={`${styles.widget} ${className}`}>
				<div className={styles.header}>
					<h3 className={styles.title}>Market Regime</h3>
				</div>
				<div className={styles.content}>
					<p className={styles.loading}>Loading...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={`${styles.widget} ${className}`}>
				<div className={styles.header}>
					<h3 className={styles.title}>Market Regime</h3>
				</div>
				<div className={styles.content}>
					<p className={styles.error}>{error}</p>
				</div>
			</div>
		)
	}

	return (
		<div className={`${styles.widget} ${className}`}>
			<div className={styles.header}>
				<h3 className={styles.title}>
					Market Regime — {symbol} / {timeframe}
				</h3>
				{showStatus && (
					<span
						className={`${styles.status} ${isConnected ? styles.connected : styles.disconnected}`}
						title={isConnected ? 'Connected' : 'Disconnected'}
					>
						{isConnected ? '●' : '○'}
					</span>
				)}
			</div>

			<div className={styles.content}>
				{sparklineType === 'png' && showSparkline ? (
					<>
						<RegimeBadge
							regime={latest?.regime}
							adx={latest?.adx}
							atrPct={latest?.atrPct}
						/>
						<div className={styles.pngSparklineWrapper}>
							<PngSparkline
								symbol={symbol}
								timeframe={timeframe}
								points={sparklinePoints}
								width={320}
								height={60}
							/>
						</div>
					</>
				) : (
					<RegimeBadge
						regime={latest?.regime}
						adx={latest?.adx}
						atrPct={latest?.atrPct}
						series={showSparkline ? series : undefined}
						showSparkline={showSparkline}
					/>
				)}

				{latest?.timestamp && (
					<p className={styles.timestamp}>
						Updated: {new Date(latest.timestamp).toLocaleTimeString()}
					</p>
				)}
			</div>
		</div>
	)
}
