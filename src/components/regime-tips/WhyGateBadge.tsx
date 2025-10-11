/**
 * WhyGateBadge - Бейдж "почему сигнал разрешен/заблокирован"
 * ------------------------------
 * Показывает статус gate с объяснением
 */
'use client'

import React from 'react'

import { TradeSide } from '@/types/signal.types'

import s from './WhyGateBadge.module.scss'
import { Regime, SignalType } from '@/lib/regime-tips'
import { why } from '@/lib/why'

/**
 * WhyGateBadge - Бейдж "почему сигнал разрешен/заблокирован"
 * ------------------------------
 * Показывает статус gate с объяснением
 */

/**
 * WhyGateBadge - Бейдж "почему сигнал разрешен/заблокирован"
 * ------------------------------
 * Показывает статус gate с объяснением
 */

interface WhyGateBadgeProps {
	regime: Regime
	type: SignalType
	side?: TradeSide
	compact?: boolean
	showTooltip?: boolean
}

export const WhyGateBadge: React.FC<WhyGateBadgeProps> = ({
	regime,
	type,
	side,
	compact = false,
	showTooltip = true
}) => {
	const result = why(regime, type, side)
	const statusClass = result.allowed ? s.allowed : s.blocked
	const indicatorClass = result.allowed ? s.allowed : s.blocked
	const label = result.allowed ? 'ALLOWED' : 'BLOCKED'

	const Badge = (
		<div
			className={`${s.badge} ${statusClass} ${compact ? s.compact : ''}`}
			title={showTooltip ? result.reason : undefined}
		>
			<span className={`${s.indicator} ${indicatorClass}`} />
			<span className={s.label}>{label}</span>
			{!compact && <span className={s.reason}>{result.reason}</span>}
		</div>
	)

	return Badge
}

export default WhyGateBadge
