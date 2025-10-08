/**
 * Компонент RegimeHealth - мониторинг здоровья пайплайна
 * ------------------------------
 * Отображает статус обновления данных о рыночном режиме,
 * задержку последнего снапшота и статистику по семплам
 */
'use client'

import React, { useEffect, useState } from 'react'

import { HealthStatus, RegimeHealthResponse } from '@/types/signal.types'

import styles from './RegimeHealth.module.scss'
import { fetchRegimeHealth } from '@/services/regime.api'

/**
 * Компонент RegimeHealth - мониторинг здоровья пайплайна
 * ------------------------------
 * Отображает статус обновления данных о рыночном режиме,
 * задержку последнего снапшота и статистику по семплам
 */

interface RegimeHealthProps {
	symbol: string
	timeframe: string
	maxLagSec?: number
	refreshInterval?: number
	className?: string
}

const STATUS_COLORS: Record<HealthStatus, string> = {
	ok: '#22c55e',
	warn: '#eab308',
	error: '#ef4444'
}

export const RegimeHealth: React.FC<RegimeHealthProps> = ({
	symbol,
	timeframe,
	maxLagSec = 180,
	refreshInterval = 15000,
	className = ''
}) => {
	const [data, setData] = useState<RegimeHealthResponse | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let cancelled = false

		const loadHealth = async () => {
			try {
				const result = await fetchRegimeHealth(symbol, timeframe, maxLagSec)
				if (!cancelled) {
					setData(result)
					setError(null)
					setIsLoading(false)
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : String(err))
					setIsLoading(false)
				}
			}
		}

		// Первичная загрузка
		loadHealth()

		// Периодическое обновление
		const intervalId = setInterval(() => {
			loadHealth()
		}, refreshInterval)

		return () => {
			cancelled = true
			clearInterval(intervalId)
		}
	}, [symbol, timeframe, maxLagSec, refreshInterval])

	if (isLoading) {
		return (
			<div className={`${styles.container} ${className}`}>
				<div className={styles.loading}>Loading health status...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={`${styles.container} ${className}`}>
				<div className={styles.error}>Health error: {error}</div>
			</div>
		)
	}

	if (!data) {
		return null
	}

	const statusColor = STATUS_COLORS[data.status] || '#6b7280'
	const lag =
		data.lastSnapshot?.lagSec != null ? `${data.lastSnapshot.lagSec}s` : '—'
	const quantilesPresent = data.quantilesPresent ? 'Yes' : 'No'

	return (
		<div
			className={`${styles.container} ${className}`}
			style={{ borderColor: statusColor }}
		>
			<div
				className={styles.header}
				style={{ color: statusColor }}
			>
				<span
					className={styles.statusIndicator}
					style={{ backgroundColor: statusColor }}
				/>
				<strong className={styles.title}>
					Health — {symbol} / {timeframe}: {data.status.toUpperCase()}
				</strong>
			</div>

			<div className={styles.metrics}>
				<div className={styles.metric}>
					<span className={styles.metricLabel}>Last snapshot lag:</span>
					<span className={styles.metricValue}>{lag}</span>
				</div>

				<div className={styles.metric}>
					<span className={styles.metricLabel}>Quantiles present:</span>
					<span className={styles.metricValue}>{quantilesPresent}</span>
				</div>

				<div className={styles.metric}>
					<span className={styles.metricLabel}>Samples 1h:</span>
					<span className={styles.metricValue}>
						{data.samples.last1h.actual} / exp {data.samples.last1h.expected}
					</span>
				</div>

				<div className={styles.metric}>
					<span className={styles.metricLabel}>Samples 1d:</span>
					<span className={styles.metricValue}>
						{data.samples.last1d.actual} / exp {data.samples.last1d.expected}
					</span>
				</div>
			</div>
		</div>
	)
}
