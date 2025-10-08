/**
 * Примеры использования спарклайнов (SVG и PNG)
 * ------------------------------
 * Демонстрация различных вариантов использования
 */
'use client'

import { PngSparkline } from './PngSparkline'
import { Sparkline } from './Sparkline'

/**
 * Примеры использования спарклайнов (SVG и PNG)
 * ------------------------------
 * Демонстрация различных вариантов использования
 */

/**
 * Пример 1: Сравнение SVG и PNG спарклайнов
 */
export const SparklineComparisonExample = () => {
	// Mock данные для SVG
	const mockAdx = Array.from({ length: 100 }, () => Math.random() * 40 + 10)
	const mockAtr = Array.from({ length: 100 }, () => Math.random() * 0.03)

	return (
		<div className='space-y-6 p-4'>
			<div>
				<h3 className='text-sm font-semibold mb-2'>
					SVG Sparkline (Client-side)
				</h3>
				<p className='text-xs text-gray-400 mb-2'>
					Интерактивный, кастомизируемый
				</p>
				<Sparkline
					adx={mockAdx}
					atrPct={mockAtr}
					width={320}
					height={60}
					adxColor='#22c55e'
				/>
			</div>

			<div>
				<h3 className='text-sm font-semibold mb-2'>
					PNG Sparkline (Server-side)
				</h3>
				<p className='text-xs text-gray-400 mb-2'>
					Легковесный, генерируется на сервере
				</p>
				<PngSparkline
					symbol='BTCUSDT'
					timeframe='1m'
					points={300}
					width={320}
					height={60}
				/>
			</div>
		</div>
	)
}

/**
 * Пример 2: Grid с PNG спарклайнами для разных символов
 */
export const MultiSymbolPngSparklineExample = () => {
	const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT']

	return (
		<div className='grid grid-cols-2 gap-4 p-4'>
			{symbols.map(symbol => (
				<div
					key={symbol}
					className='bg-gray-800 rounded-lg p-3'
				>
					<h4 className='text-sm font-semibold mb-2'>{symbol}</h4>
					<PngSparkline
						symbol={symbol}
						timeframe='5m'
						points={200}
						width={280}
						height={50}
					/>
				</div>
			))}
		</div>
	)
}

/**
 * Пример 3: Компактный виджет с PNG спарклайном
 */
export const CompactPngSparklineWidget = () => {
	return (
		<div className='bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-md'>
			<div className='flex justify-between items-center mb-2'>
				<h3 className='text-sm font-semibold'>BTCUSDT / 1m</h3>
				<span className='text-xs text-green-500'>+2.34%</span>
			</div>

			<PngSparkline
				symbol='BTCUSDT'
				timeframe='1m'
				points={100}
				width={400}
				height={50}
			/>

			<div className='flex justify-between mt-2 text-xs text-gray-400'>
				<span>24h High: $45,200</span>
				<span>24h Low: $43,800</span>
			</div>
		</div>
	)
}

/**
 * Пример 4: Responsive PNG спарклайн
 */
export const ResponsivePngSparkline = () => {
	return (
		<div className='w-full max-w-2xl'>
			<div className='bg-gray-800 rounded-lg p-4'>
				<h3 className='text-sm font-semibold mb-3'>Market Overview</h3>

				{/* Адаптивная обертка */}
				<div className='w-full overflow-hidden'>
					<PngSparkline
						symbol='BTCUSDT'
						timeframe='1h'
						points={300}
						width={800}
						height={100}
						className='w-full h-auto'
					/>
				</div>
			</div>
		</div>
	)
}
