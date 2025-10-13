/**
 * Spike Table Component
 * --------------------------------
 * Таблица для отображения Delta спайков
 */
'use client'

import { OfBadge } from './OfBadge'

/**
 * Spike Table Component
 * --------------------------------
 * Таблица для отображения Delta спайков
 */

interface SpikeRow {
	id?: string
	ts?: string
	createdAt?: string
	delta: number
	zDelta: number
	deltaRatio: number
	bodyAtr: number
	direction?: 'long' | 'short'
	absorbed?: boolean
}

interface SpikeTableProps {
	rows: SpikeRow[]
}

export const SpikeTable = ({ rows }: SpikeTableProps) => {
	if (!rows || rows.length === 0) {
		return (
			<div className='border border-gray-800 rounded-xl p-8 text-center text-gray-500'>
				Нет данных о спайках
			</div>
		)
	}

	return (
		<div className='border border-gray-800 rounded-xl overflow-hidden'>
			{/* Заголовок таблицы */}
			<div className='grid grid-cols-[140px_70px_70px_70px_70px_80px_1fr] font-bold px-3 py-2 bg-gray-900 text-gray-300 text-sm'>
				<div>Время</div>
				<div>Δ</div>
				<div>zΔ</div>
				<div>Δ/Vol</div>
				<div>Body/ATR</div>
				<div>Направление</div>
				<div>Флаги</div>
			</div>

			{/* Строки данных */}
			{rows.map(row => {
				const timestamp = row.ts || row.createdAt
				const direction =
					row.direction || (Number(row.delta) >= 0 ? 'long' : 'short')
				const directionColor = direction === 'long' ? '#22c55e' : '#ef4444'

				return (
					<div
						key={row.id || timestamp}
						className='grid grid-cols-[140px_70px_70px_70px_70px_80px_1fr] px-3 py-2 border-t border-gray-900 hover:bg-gray-900/50 transition-colors text-sm'
					>
						<div className='text-gray-400'>
							{timestamp ? new Date(timestamp).toLocaleTimeString() : '—'}
						</div>
						<div className='text-gray-300'>{Number(row.delta).toFixed(0)}</div>
						<div className='text-gray-300'>{Number(row.zDelta).toFixed(2)}</div>
						<div className='text-gray-300'>
							{Number(row.deltaRatio).toFixed(2)}
						</div>
						<div className='text-gray-300'>
							{Number(row.bodyAtr).toFixed(2)}
						</div>
						<div
							style={{ color: directionColor }}
							className='font-medium'
						>
							{direction}
						</div>
						<div>
							<OfBadge
								isSpike={true}
								dir={direction}
								z={Number(row.zDelta)}
								ratio={Number(row.deltaRatio)}
								absorbed={row.absorbed}
							/>
						</div>
					</div>
				)
			})}
		</div>
	)
}
