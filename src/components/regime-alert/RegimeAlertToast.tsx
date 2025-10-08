/**
 * Компонент RegimeAlertToast - всплывающий алерт о здоровье режима
 * ------------------------------
 * Отображает уведомления о проблемах с пайплайном рыночного режима
 * в виде тоста в правом нижнем углу экрана
 */
'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { HealthStatus } from '@/types/signal.types'

import { useRegimeAlerts } from '@/hooks/useRegimeAlerts'

import styles from './RegimeAlertToast.module.scss'

/**
 * Компонент RegimeAlertToast - всплывающий алерт о здоровье режима
 * ------------------------------
 * Отображает уведомления о проблемах с пайплайном рыночного режима
 * в виде тоста в правом нижнем углу экрана
 */

const STATUS_COLORS: Record<HealthStatus, string> = {
	ok: '#22c55e',
	warn: '#eab308',
	error: '#ef4444'
}

export const RegimeAlertToast: React.FC = () => {
	const { lastAlert } = useRegimeAlerts()
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!lastAlert) return

		setVisible(true)
		const timeoutId = setTimeout(() => {
			setVisible(false)
		}, 8000)

		return () => clearTimeout(timeoutId)
	}, [lastAlert])

	const alertColor = useMemo(() => {
		if (!lastAlert) return '#6b7280'
		if (lastAlert.recovered) return '#22c55e'
		return STATUS_COLORS[lastAlert.status] || '#6b7280'
	}, [lastAlert])

	if (!visible || !lastAlert) return null

	return (
		<div
			className={styles.toast}
			style={{ borderColor: alertColor }}
		>
			<div className={styles.header}>
				<span
					className={styles.indicator}
					style={{ backgroundColor: alertColor }}
				/>
				<strong className={styles.title}>
					Regime Health: {String(lastAlert.status).toUpperCase()}
				</strong>
			</div>

			<div className={styles.body}>
				<span className={styles.symbol}>
					{lastAlert.symbol}/{lastAlert.timeframe}
				</span>

				{lastAlert.recovered && (
					<span className={styles.recovered}> — recovered</span>
				)}

				{typeof lastAlert.lagSec === 'number' && (
					<span className={styles.metric}> • lag: {lastAlert.lagSec}s</span>
				)}

				{Array.isArray(lastAlert.issues) && lastAlert.issues.length > 0 && (
					<span className={styles.issues}>
						{' '}
						• issues: {lastAlert.issues.join(', ')}
					</span>
				)}
			</div>
		</div>
	)
}
