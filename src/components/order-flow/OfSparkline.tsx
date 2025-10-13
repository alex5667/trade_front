/**
 * Order Flow Sparkline Component
 * --------------------------------
 * Отображает мини-график Delta в виде PNG изображения
 */
'use client'

import { getOfSparklineUrl } from '@/lib/orderflow-api'

/**
 * Order Flow Sparkline Component
 * --------------------------------
 * Отображает мини-график Delta в виде PNG изображения
 */

interface OfSparklineProps {
	/** Торговый символ */
	symbol: string
	/** Таймфрейм */
	timeframe: string
	/** Количество точек данных */
	n?: number
}

export const OfSparkline = ({
	symbol,
	timeframe,
	n = 120
}: OfSparklineProps) => {
	const src = getOfSparklineUrl(symbol, timeframe, n)

	return (
		<img
			src={src}
			alt='Δ sparkline'
			className='w-full object-contain'
			style={{ height: 60 }}
			loading='lazy'
		/>
	)
}
