'use client'

import { Regime, SignalType } from '@/lib/regime-tips'
import { why } from '@/lib/why'

export function WhyGateBadgeMini({
	regime,
	type,
	side
}: {
	regime: Regime
	type: SignalType
	side?: 'long' | 'short'
}) {
	const res = why(regime, type, side)
	const col = res.allowed ? '#22c55e' : '#ef4444'
	return (
		<span
			title={res.reason}
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
				border: `1px solid ${col}`,
				color: col,
				background: `${col}22`,
				borderRadius: 999,
				padding: '2px 8px',
				fontSize: 11,
				maxWidth: 220
			}}
		>
			<b>{res.allowed ? 'OK' : 'NO'}</b>
			<span
				style={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis'
				}}
			>
				{res.reason}
			</span>
		</span>
	)
}
