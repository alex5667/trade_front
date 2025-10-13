/**
 * Order Flow Dashboard Page
 * --------------------------------
 * Страница для мониторинга Order Flow данных (Delta, Spikes)
 */
'use client'

import { useEffect, useState } from 'react'

import { OfBadge, OfSparkline, SpikeTable } from '@/components/order-flow'

import { OF_API_BASE, getOfFeatures, getOfSpikes } from '@/lib/orderflow-api'
import { getOrderFlowSocket } from '@/lib/orderflow-socket'

/**
 * Order Flow Dashboard Page
 * --------------------------------
 * Страница для мониторинга Order Flow данных (Delta, Spikes)
 */

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT']
const TIMEFRAMES = ['1m', '3m', '5m', '15m', '1h']

interface OfFeature {
	ts: string
	delta: number
	zDelta: number
	deltaRatio: number
	bodyAtr: number
	absorbed?: boolean
	o: number
	h: number
	l: number
	c: number
	volume: number
}

interface OfSpike {
	ts?: string
	createdAt?: string
	delta: number
	zDelta: number
	deltaRatio: number
	bodyAtr: number
	direction: 'long' | 'short'
	absorbed?: boolean
}

export default function OrderFlowPage() {
	const [symbol, setSymbol] = useState<string>('BTCUSDT')
	const [timeframe, setTimeframe] = useState<string>('1m')
	const [features, setFeatures] = useState<OfFeature[]>([])
	const [spikes, setSpikes] = useState<OfSpike[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)

	// Загрузка начальных данных
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true)
			try {
				const [featuresData, spikesData] = await Promise.all([
					getOfFeatures(symbol, timeframe, 200),
					getOfSpikes(symbol, timeframe, 50)
				])
				setFeatures(featuresData)
				setSpikes(spikesData)
			} catch (error) {
				console.error('Ошибка загрузки Order Flow данных:', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadData()
	}, [symbol, timeframe])

	// WebSocket подписка на обновления в реальном времени
	useEffect(() => {
		const socket = getOrderFlowSocket()

		const handleOfUpdate = (message: any) => {
			if (message.symbol !== symbol || message.timeframe !== timeframe) return

			const newFeature: OfFeature = {
				ts: message.ts,
				delta: message.delta,
				zDelta: message.zDelta,
				deltaRatio: message.deltaRatio,
				bodyAtr: message.bodyATR,
				absorbed: message.absorbed,
				o: message.o,
				h: message.h,
				l: message.l,
				c: message.c,
				volume: message.volume
			}

			setFeatures(prev => {
				const next = [newFeature, ...prev]
				return next.slice(0, 200)
			})
		}

		const handleOfSpike = (message: any) => {
			if (message.symbol !== symbol || message.timeframe !== timeframe) return

			const newSpike: OfSpike = {
				...message,
				direction: message.direction
			}

			setSpikes(prev => {
				const next = [newSpike, ...prev]
				return next.slice(0, 50)
			})
		}

		socket.on('of:update', handleOfUpdate)
		socket.on('of:spike', handleOfSpike)

		return () => {
			socket.off('of:update', handleOfUpdate)
			socket.off('of:spike', handleOfSpike)
		}
	}, [symbol, timeframe])

	const lastFeature = features[0]
	const headerColor = lastFeature?.delta >= 0 ? '#0ea5e9' : '#f97316'

	return (
		<div className='max-w-[1100px] mx-auto px-4 py-8 text-gray-200'>
			{/* Заголовок и селекторы */}
			<div className='mb-6'>
				<h1 className='text-3xl font-bold mb-4'>Order Flow Dashboard</h1>
				<div className='flex items-center gap-3 flex-wrap'>
					{/* Селектор символа */}
					<select
						value={symbol}
						onChange={e => setSymbol(e.target.value)}
						className='bg-gray-900 text-gray-200 rounded-lg px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
					>
						{SYMBOLS.map(s => (
							<option
								key={s}
								value={s}
							>
								{s}
							</option>
						))}
					</select>

					{/* Селектор таймфрейма */}
					<select
						value={timeframe}
						onChange={e => setTimeframe(e.target.value)}
						className='bg-gray-900 text-gray-200 rounded-lg px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
					>
						{TIMEFRAMES.map(tf => (
							<option
								key={tf}
								value={tf}
							>
								{tf}
							</option>
						))}
					</select>

					{/* Индикатор спайка */}
					{lastFeature && (
						<OfBadge
							isSpike={
								lastFeature.zDelta &&
								Math.abs(lastFeature.zDelta) >= 2.5 &&
								Math.abs(lastFeature.deltaRatio) >= 0.35
							}
							dir={lastFeature.delta >= 0 ? 'long' : 'short'}
							z={Number(lastFeature?.zDelta || 0)}
							ratio={Number(lastFeature?.deltaRatio || 0)}
							absorbed={lastFeature?.absorbed}
						/>
					)}

					{/* Текущие метрики */}
					<div
						className='ml-auto font-bold'
						style={{ color: headerColor }}
					>
						Δ {lastFeature ? Number(lastFeature.delta).toFixed(0) : '—'} | z{' '}
						{lastFeature ? Number(lastFeature.zDelta).toFixed(2) : '—'} | Δ/Vol{' '}
						{lastFeature ? Number(lastFeature.deltaRatio).toFixed(2) : '—'}
					</div>
				</div>
			</div>

			{/* Основной контент */}
			{isLoading ? (
				<div className='flex items-center justify-center py-20'>
					<div className='text-gray-500 text-lg'>Загрузка данных...</div>
				</div>
			) : (
				<>
					{/* Sparkline и последние бары */}
					<div className='grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-4'>
						{/* Sparkline */}
						<div className='border border-gray-800 rounded-xl p-4'>
							<div className='font-bold mb-2 text-gray-300'>
								Δ Sparkline (для Notion: PNG по URL)
							</div>
							<OfSparkline
								symbol={symbol}
								timeframe={timeframe}
								n={120}
							/>
							<div className='text-xs text-gray-500 mt-2'>
								URL:{' '}
								<code className='text-gray-400 bg-gray-900 px-2 py-1 rounded'>
									{OF_API_BASE}/png/delta?symbol={symbol}&timeframe={timeframe}
									&n=120
								</code>
							</div>
						</div>

						{/* Последние бары */}
						<div className='border border-gray-800 rounded-xl p-4'>
							<div className='font-bold mb-2 text-gray-300'>
								Последние бары (онлайн)
							</div>
							<div className='text-xs max-h-[260px] overflow-auto'>
								{features.slice(0, 30).map(row => (
									<div
										key={row.ts}
										className='grid grid-cols-[120px_80px_60px_60px_60px_1fr] border-t border-gray-900 py-1.5 text-gray-400'
									>
										<div>{new Date(row.ts).toLocaleTimeString()}</div>
										<div>{Number(row.delta).toFixed(0)}</div>
										<div>{Number(row.zDelta).toFixed(2)}</div>
										<div>{Number(row.deltaRatio).toFixed(2)}</div>
										<div>{Number(row.bodyAtr).toFixed(2)}</div>
										<div>{row.absorbed ? 'absorbed' : ''}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Таблица спайков */}
					<div>
						<div className='font-bold mb-2 text-gray-300'>Δ-Spikes</div>
						<SpikeTable rows={spikes} />
					</div>
				</>
			)}
		</div>
	)
}
