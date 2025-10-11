/**
 * SignalWithGate - Компонент сигнала с проверкой gate
 * ------------------------------
 * Обертка для сигналов с отображением статуса gate
 */
'use client'

import React from 'react'

import { WhyGateBadge } from '@/components/regime-tips'
import { useRegimeSocket } from '@/hooks/useRegimeSocket'
import { Regime, SignalType } from '@/lib/regime-tips'
import { TradeSide } from '@/types/signal.types'

import s from './SignalWithGate.module.scss'

interface SignalWithGateProps {
	symbol: string
	type: SignalType
	side?: TradeSide
	children: React.ReactNode
	compact?: boolean
	showTooltip?: boolean
}

/**
 * Компонент отображает сигнал с бейджем статуса gate
 * Автоматически определяет текущий режим рынка
 */
export const SignalWithGate: React.FC<SignalWithGateProps> = ({
	symbol,
	type,
	side,
	children,
	compact = false,
	showTooltip = true
}) => {
	// Получаем текущий режим из WebSocket
	const { regime: liveRegime } = useRegimeSocket(symbol, '1m')
	const currentRegime = (liveRegime?.regime as Regime) || 'range'

	return (
		<div className={`${s.container} ${compact ? s.compact : ''}`}>
			<div className={s.content}>{children}</div>
			<div className={s.badge}>
				<WhyGateBadge
					regime={currentRegime}
					type={type}
					side={side}
					compact={compact}
					showTooltip={showTooltip}
				/>
			</div>
		</div>
	)
}

export default SignalWithGate


