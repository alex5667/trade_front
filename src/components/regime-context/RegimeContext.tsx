/**
 * Компонент RegimeContext - HTF контекст и допуск сигнала
 * ------------------------------
 * Отображает режим на LTF и HTF таймфреймах,
 * проверяет допустимость сигнала и показывает bias
 */
'use client'

import React, { useEffect, useState } from 'react'

import { RegimeContextResponse, TradeSide } from '@/types/signal.types'

import styles from './RegimeContext.module.scss'
import { fetchRegimeContext } from '@/services/regime.api'

/**
 * Компонент RegimeContext - HTF контекст и допуск сигнала
 * ------------------------------
 * Отображает режим на LTF и HTF таймфреймах,
 * проверяет допустимость сигнала и показывает bias
 */

interface RegimeContextProps {
	symbol: string
	ltf: string
	htf: string
	signalType?: string
	side?: TradeSide
	refreshInterval?: number
	className?: string
}

const COLOR_BY_REGIME: Record<string, string> = {
	range: '#6b7280',
	squeeze: '#eab308',
	trending_bull: '#22c55e',
	trending_bear: '#ef4444',
	expansion: '#3b82f6'
}

export const RegimeContext: React.FC<RegimeContextProps> = ({
	symbol,
	ltf,
	htf,
	signalType,
	side,
	refreshInterval = 15000,
	className = ''
}) => {
	const [data, setData] = useState<RegimeContextResponse | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let cancelled = false

		const loadContext = async () => {
			try {
				const result = await fetchRegimeContext({
					symbol,
					ltf,
					htf,
					signalType,
					side
				})
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
		loadContext()

		// Периодическое обновление
		const intervalId = setInterval(() => {
			loadContext()
		}, refreshInterval)

		return () => {
			cancelled = true
			clearInterval(intervalId)
		}
	}, [symbol, ltf, htf, signalType, side, refreshInterval])

	if (isLoading) {
		return (
			<div className={`${styles.container} ${className}`}>
				<div className={styles.loading}>Loading context...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={`${styles.container} ${className}`}>
				<div className={styles.error}>Context error: {error}</div>
			</div>
		)
	}

	if (!data) {
		return null
	}

	const ltfColor = data.latestLTF
		? COLOR_BY_REGIME[data.latestLTF.regime]
		: '#6b7280'
	const htfColor = data.latestHTF
		? COLOR_BY_REGIME[data.latestHTF.regime]
		: '#6b7280'
	const allowedText = data.allowed ? 'ALLOWED' : 'BLOCKED'
	const allowedColor = data.allowed ? '#22c55e' : '#ef4444'

	return (
		<div className={`${styles.container} ${className}`}>
			<div className={styles.header}>
				<strong className={styles.title}>
					Context — {symbol} (LTF {ltf} / HTF {htf})
				</strong>
			</div>

			<div className={styles.regimes}>
				{/* LTF Regime */}
				<div
					className={styles.regimeBadge}
					style={{
						backgroundColor: `${ltfColor}22`,
						borderColor: ltfColor,
						color: ltfColor
					}}
				>
					<strong>LTF:</strong> {data.latestLTF?.regime ?? '—'}
					{data.latestLTF && (
						<span className={styles.adx}>
							(ADX {Number(data.latestLTF.adx).toFixed(1)})
						</span>
					)}
				</div>

				{/* HTF Regime */}
				<div
					className={styles.regimeBadge}
					style={{
						backgroundColor: `${htfColor}22`,
						borderColor: htfColor,
						color: htfColor
					}}
				>
					<strong>HTF:</strong> {data.latestHTF?.regime ?? '—'}
					{data.latestHTF && (
						<span className={styles.adx}>
							(ADX {Number(data.latestHTF.adx).toFixed(1)})
						</span>
					)}
				</div>
			</div>

			{/* Signal Status */}
			{signalType && (
				<div
					className={styles.signalStatus}
					style={{ color: allowedColor }}
				>
					<strong>
						{signalType}
						{side ? `/${side}` : ''}:
					</strong>{' '}
					{allowedText} • bias: {data.bias}
				</div>
			)}
		</div>
	)
}
