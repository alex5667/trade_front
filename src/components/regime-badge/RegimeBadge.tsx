/**
 * Компонент RegimeBadge - индикатор рыночного режима
 * ------------------------------
 * Отображает текущий рыночный режим с визуальной индикацией,
 * дополнительными метриками (ADX, ATR%) и опциональными спарклайнами
 */

'use client'

import React, { useMemo } from 'react'

import { Sparkline } from '@/components/sparkline'
import { RegimeSeries, RegimeType } from '@/types/signal.types'

import styles from './RegimeBadge.module.scss'

interface RegimeBadgeProps {
	regime?: RegimeType | string
	adx?: number
	atrPct?: number
	className?: string
	series?: RegimeSeries
	showSparkline?: boolean
	sparklineWidth?: number
	sparklineHeight?: number
}

// Цветовая схема для различных режимов рынка
const COLOR_BY_REGIME: Record<string, { bg: string; border: string; text: string; dot: string }> = {
	range: {
		bg: 'bg-gray-500/10',
		border: 'border-gray-500',
		text: 'text-gray-500',
		dot: 'bg-gray-500'
	},
	squeeze: {
		bg: 'bg-yellow-500/10',
		border: 'border-yellow-500',
		text: 'text-yellow-500',
		dot: 'bg-yellow-500'
	},
	trending_bull: {
		bg: 'bg-green-500/10',
		border: 'border-green-500',
		text: 'text-green-500',
		dot: 'bg-green-500'
	},
	trending_bear: {
		bg: 'bg-red-500/10',
		border: 'border-red-500',
		text: 'text-red-500',
		dot: 'bg-red-500'
	},
	expansion: {
		bg: 'bg-blue-500/10',
		border: 'border-blue-500',
		text: 'text-blue-500',
		dot: 'bg-blue-500'
	}
}

// Название режимов для отображения
const REGIME_LABELS: Record<string, string> = {
	range: 'Range',
	squeeze: 'Squeeze',
	trending_bull: 'Trending Bull',
	trending_bear: 'Trending Bear',
	expansion: 'Expansion'
}

export const RegimeBadge: React.FC<RegimeBadgeProps> = ({
	regime,
	adx,
	atrPct,
	className = '',
	series,
	showSparkline = false,
	sparklineWidth = 240,
	sparklineHeight = 54,
}) => {
	const label = regime ? (REGIME_LABELS[regime] || regime) : '—'
	const colors = regime ? (COLOR_BY_REGIME[regime] || COLOR_BY_REGIME.range) : COLOR_BY_REGIME.range

	const adxSeries = useMemo(() => series?.adx ?? [], [series?.adx])
	const atrSeries = useMemo(() => series?.atrPct ?? [], [series?.atrPct])

	const hasSparkline = showSparkline && (adxSeries.length > 0 || atrSeries.length > 0)

	return (
		<div
			className={`${styles.badgeContainer} ${hasSparkline ? styles.withSparkline : ''} ${className}`}
			role="status"
			aria-label={`Market regime: ${label}`}
		>
			{/* Бейдж с метриками */}
			<div className={`${styles.badge} ${colors.bg} ${colors.border} border`}>
				<span className={`${styles.indicator} ${colors.dot}`} aria-hidden="true" />
				
				<strong className={`${styles.label} ${colors.text}`}>
					{label}
				</strong>

				{(typeof adx === 'number' || typeof atrPct === 'number') && (
					<span className={styles.metrics}>
						{typeof adx === 'number' && (
							<span className={styles.metric}>
								ADX: {adx.toFixed(1)}
							</span>
						)}
						{typeof atrPct === 'number' && (
							<span className={styles.metric}>
								ATR%: {(atrPct * 100).toFixed(2)}%
							</span>
						)}
					</span>
				)}
			</div>

			{/* Спарклайн график */}
			{hasSparkline && (
				<div className={styles.sparklineWrapper}>
					<Sparkline
						width={sparklineWidth}
						height={sparklineHeight}
						adx={adxSeries}
						atrPct={atrSeries}
						adxColor={colors.text.replace('text-', '')}
						className={colors.text}
					/>
				</div>
			)}
		</div>
	)
}

