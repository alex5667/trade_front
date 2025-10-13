/**
 * Order Flow Badge Component
 * --------------------------------
 * Визуальный индикатор Delta спайка с направлением и статусом
 */
'use client'

interface OfBadgeProps {
	/** Является ли спайком */
	isSpike?: boolean
	/** Направление спайка */
	dir?: 'long' | 'short'
	/** z-Score Delta */
	z?: number
	/** Соотношение Delta к объему */
	ratio?: number
	/** Флаг поглощения (absorbed) */
	absorbed?: boolean
}

export const OfBadge = ({ isSpike, dir, z, ratio, absorbed }: OfBadgeProps) => {
	if (!isSpike) return null

	const color = absorbed ? '#f59e0b' : dir === 'long' ? '#22c55e' : '#ef4444'
	const label = absorbed
		? 'Δ spike (absorbed?)'
		: `Δ spike ${dir === 'long' ? '↑' : '↓'}`

	return (
		<span
			title={`z=${z?.toFixed(2)} ratio=${(ratio ?? 0).toFixed(2)} absorbed=${!!absorbed}`}
			className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-all'
			style={{
				border: `1px solid ${color}`,
				color: color,
				background: `${color}1a`
			}}
		>
			{label}
		</span>
	)
}
