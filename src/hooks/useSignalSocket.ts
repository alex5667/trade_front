'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import {
	PriceChangeSignal,
	SignalData,
	TopCoin,
	TopGainersSignal,
	TopLosersSignal,
	VolatilitySpikeSignal,
	VolumeSpikeSignal
} from '@/types/signal.types'


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4200'

// Helper type for handling different data formats
type AnyObject = { [key: string]: any }

export function useSignalSocket(): SignalData {
	const socketRef = useRef<Socket | null>(null)

	const [volatilitySpikes, setVolatilitySpikes] = useState<VolatilitySpikeSignal[]>([])
	console.log('volatilitySpikes', volatilitySpikes)
	const [volatilityRanges, setVolatilityRanges] = useState<VolatilitySpikeSignal[]>([])
	console.log('volatilityRanges', volatilityRanges)
	const [volumeSpikes, setVolumeSpikes] = useState<VolumeSpikeSignal[]>([])
	const [priceChanges, setPriceChanges] = useState<PriceChangeSignal[]>([])
	const [topGainers, setTopGainers] = useState<string[]>([])
	console.log('topGainers', topGainers)
	const [topLosers, setTopLosers] = useState<string[]>([])
	console.log('topLosers', topLosers)
	useEffect(() => {
		console.log('🚀 Connecting to WebSocket at:', SOCKET_URL)

		const socket: Socket = io(`${SOCKET_URL}/signals`, {
			transports: ['websocket', 'polling'],
			reconnectionAttempts: 5,
			path: '/socket.io'
		})

		socketRef.current = socket

		socket.on('connect', () => {
			console.log('✅ WebSocket connected:', socket.id)
			// Subscribe to all channels explicitly
			console.log('📢 Subscribing to signals...')
		})

		socket.on('connect_error', (error) => {
			console.error('❌ Socket connection error:', error.message)
		})

		socket.on('disconnect', (reason) => {
			console.log('⚠️ Disconnected from socket:', reason)
		})

		// Handler for standard signal:volatility events
		socket.on('signal:volatility', (signal: VolatilitySpikeSignal) => {
			console.log('📊 Received volatility signal:', signal)
			if (signal.type === 'volatilitySpike') {
				setVolatilitySpikes(prev => {
					console.log('Adding volatility spike, previous count:', prev.length)
					const newState = [signal, ...prev.slice(0, 99)]
					console.log('New volatility spikes count:', newState.length)
					return newState
				})
			}
		})

		// Handler for volatility events (without prefix)
		socket.on('volatility', (signal: VolatilitySpikeSignal) => {
			console.log('📊 Received volatility signal (without prefix):', signal)
			setVolatilitySpikes(prev => {
				console.log('Adding volatility signal, previous count:', prev.length)
				const newState = [signal, ...prev.slice(0, 99)]
				console.log('New volatility signals count:', newState.length)
				return newState
			})
		})

		// Handler for explicit volatilitySpike events
		socket.on('volatilitySpike', (signal: VolatilitySpikeSignal) => {
			console.log('📊 Received volatility spike signal:', signal)
			setVolatilitySpikes(prev => {
				console.log('Adding volatilitySpike, previous count:', prev.length)
				const newState = [signal, ...prev.slice(0, 99)]
				console.log('New volatilitySpike count:', newState.length)
				return newState
			})
		})

		socket.on('signal:volatilityRange', (signal: VolatilitySpikeSignal) => {
			console.log('📊 Received volatility range signal (with prefix):', signal)
			if (signal) {
				console.log('Range value:', signal.range, 'Avg Range:', signal.avgRange, 'Volatility:', signal.volatility, '%')
				setVolatilityRanges(prev => {
					console.log('Previous volatilityRanges count:', prev.length)
					const newState = [signal, ...prev.slice(0, 99)]
					console.log('New volatilityRanges count:', newState.length)
					return newState
				})
			}
		})

		socket.on('volatilityRange', (signal: VolatilitySpikeSignal) => {
			console.log('📊 Received volatility range signal (without prefix):', signal)
			if (signal) {
				console.log('Range value:', signal.range, 'Avg Range:', signal.avgRange, 'Volatility:', signal.volatility, '%')
				setVolatilityRanges(prev => {
					console.log('Previous volatilityRanges count:', prev.length)
					const newState = [signal, ...prev.slice(0, 99)]
					console.log('New volatilityRanges count:', newState.length)
					return newState
				})
			}
		})

		socket.on('volumeSpike', (signal: VolumeSpikeSignal) => {
			setVolumeSpikes(prev => [signal, ...prev.slice(0, 99)])
		})

		socket.on('priceChange', (signal: PriceChangeSignal) => {
			setPriceChanges(prev => [signal, ...prev.slice(0, 99)])
		})

		socket.on('top:gainers', (data: TopGainersSignal | string[] | AnyObject) => {
			console.log('📊 Received top gainers from socket:', data)

			// Handle the format from server logs: {type: 'top:gainers', payload: ['coin1', 'coin2']}
			if (data && typeof data === 'object' && 'payload' in data && Array.isArray(data.payload)) {
				setTopGainers(data.payload)
				return
			}

			// Handle different data formats for backward compatibility
			if (Array.isArray(data)) {
				// If data is already an array of strings or objects
				const symbols = data.map(item => {
					return typeof item === 'string' ? item : (item as AnyObject)?.symbol || ''
				})
				setTopGainers(symbols)
			} else if (data && typeof data === 'object') {
				// If data is an object with coins property
				if (Array.isArray((data as AnyObject).coins)) {
					const coins = (data as AnyObject).coins
					const symbols = coins.map((coin: string | TopCoin | AnyObject) => {
						return typeof coin === 'string' ? coin : (coin as AnyObject).symbol
					})
					setTopGainers(symbols)
				}
			}
		})

		socket.on('top:losers', (data: TopLosersSignal | string[] | AnyObject) => {
			console.log('📊 Received top losers from socket:', data)

			// Handle the format from server logs: {type: 'top:losers', payload: ['coin1', 'coin2']}
			if (data && typeof data === 'object' && 'payload' in data && Array.isArray(data.payload)) {
				setTopLosers(data.payload)
				return
			}

			// Handle different data formats for backward compatibility
			if (Array.isArray(data)) {
				// If data is already an array of strings or objects
				const symbols = data.map(item => {
					return typeof item === 'string' ? item : (item as AnyObject)?.symbol || ''
				})
				setTopLosers(symbols)
			} else if (data && typeof data === 'object') {
				// If data is an object with coins property
				if (Array.isArray((data as AnyObject).coins)) {
					const coins = (data as AnyObject).coins
					const symbols = coins.map((coin: string | TopCoin | AnyObject) => {
						return typeof coin === 'string' ? coin : (coin as AnyObject).symbol
					})
					setTopLosers(symbols)
				}
			}
		})

		// Legacy handlers for backward compatibility
		socket.on('binance:kline', (data: any) => {
			if (data && data.k) {
				const kline = data.k
				const volatility = ((parseFloat(kline.h) - parseFloat(kline.l)) / parseFloat(kline.o)) * 100

				const signal: VolatilitySpikeSignal = {
					type: 'volatilityRange',
					symbol: kline.s,
					interval: kline.i,
					open: parseFloat(kline.o),
					high: parseFloat(kline.h),
					low: parseFloat(kline.l),
					close: parseFloat(kline.c),
					volatility: parseFloat(volatility.toFixed(2)),
					timestamp: kline.t
				}

				setVolatilityRanges(prev => [signal, ...prev.slice(0, 99)])
			}
		})

		return () => {
			console.log('🛑 Disconnecting socket')
			socket.disconnect()
		}
	}, [])

	return {
		volatilitySpikes,
		volatilityRanges,
		volumeSpikes,
		priceChanges,
		topGainers,
		topLosers,
	}
}
