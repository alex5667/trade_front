/**
 * Компонент PngSparkline - серверный PNG спарклайн
 * ------------------------------
 * Отображает спарклайн-график, генерируемый на сервере в формате PNG
 * Легковесная альтернатива SVG спарклайну для простых случаев
 */
'use client'

import React from 'react'

import { API_BASE_URL } from '@/config/api.config'

/**
 * Компонент PngSparkline - серверный PNG спарклайн
 * ------------------------------
 * Отображает спарклайн-график, генерируемый на сервере в формате PNG
 * Легковесная альтернатива SVG спарклайну для простых случаев
 */

interface PngSparklineProps {
	symbol: string
	timeframe: string
	points?: number
	width?: number
	height?: number
	className?: string
}

export const PngSparkline: React.FC<PngSparklineProps> = ({
	symbol,
	timeframe,
	points = 300,
	width = 320,
	height = 60,
	className = ''
}) => {
	const sparklineUrl = `${API_BASE_URL}/regime/sparkline.png?symbol=${symbol}&timeframe=${timeframe}&points=${points}&w=${width}&h=${height}`

	return (
		<img
			src={sparklineUrl}
			alt={`${symbol}/${timeframe} sparkline`}
			width={width}
			height={height}
			className={className}
			style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
			loading='lazy'
		/>
	)
}
