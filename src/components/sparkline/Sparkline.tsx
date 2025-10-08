/**
 * Компонент Sparkline - мини-график на чистом SVG
 * ------------------------------
 * Легкий и быстрый спарклайн для отображения временных рядов
 * Поддерживает две линии: ADX и ATR% (в процентах)
 */

'use client'

import React from 'react'

interface Point {
	x: number
	y: number
}

type Series = number[]

/**
 * Создает SVG path из массива данных
 */
const pathFrom = (
	data: Series,
	width: number,
	height: number,
	min?: number,
	max?: number
): string => {
	const n = data.length
	if (n === 0) return ''

	const lo = min ?? Math.min(...data)
	const hi = max ?? Math.max(...data)
	const span = hi - lo || 1e-9

	const stepX = width / Math.max(1, n - 1)
	const points: Point[] = data.map((value, index) => {
		const x = index * stepX
		// Инвертируем Y координату (0 вверху в SVG)
		const y = height - ((value - lo) / span) * height
		return { x, y }
	})

	return points
		.map((point, index) => 
			index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
		)
		.join(' ')
}

interface SparklineProps {
	width?: number
	height?: number
	adx?: number[]
	atrPct?: number[]
	adxMin?: number
	adxMax?: number
	atrMin?: number
	atrMax?: number
	className?: string
	adxColor?: string
	atrColor?: string
}

export const Sparkline: React.FC<SparklineProps> = ({
	width = 240,
	height = 54,
	adx = [],
	atrPct = [],
	adxMin,
	adxMax,
	atrMin,
	atrMax,
	className = '',
	adxColor = 'currentColor',
	atrColor = 'currentColor',
}) => {
	const adxPath = adx.length 
		? pathFrom(adx, width, height, adxMin, adxMax) 
		: ''
	
	// Конвертируем ATR% в проценты для лучшей визуализации
	const atrPath = atrPct.length 
		? pathFrom(
				atrPct.map(v => v * 100), 
				width, 
				height, 
				atrMin, 
				atrMax
			) 
		: ''

	return (
		<svg 
			width={width} 
			height={height} 
			className={className}
			style={{ display: 'block' }}
			role="img"
			aria-label="Market regime sparkline chart"
		>
			{/* ADX линия */}
			{adxPath && (
				<path
					d={adxPath}
					fill="none"
					stroke={adxColor}
					strokeWidth={1.5}
					opacity={0.9}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			)}
			
			{/* ATR% линия (второй путь, чуть прозрачнее) */}
			{atrPath && (
				<path
					d={atrPath}
					fill="none"
					stroke={atrColor}
					strokeWidth={1}
					opacity={0.45}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			)}
		</svg>
	)
}

