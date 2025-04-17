'use client'

import {
	PriceChangeSignal,
	SignalData,
	TopCoin,
	TopGainersSignal,
	TopLosersSignal,
	VolatilitySpikeSignal,
	VolumeSpikeSignal
} from '@/types/signal.types'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4200'

export function useSignalSocket(): SignalData {
	// Regular implementation for production or when mocks are disabled
	const [volatilitySpikes, setVolatilitySpikes] = useState<VolatilitySpikeSignal[]>([])
	const [volatilityRanges, setVolatilityRanges] = useState<VolatilitySpikeSignal[]>([])
	const [volumeSpikes, setVolumeSpikes] = useState<VolumeSpikeSignal[]>([])
	const [priceChanges, setPriceChanges] = useState<PriceChangeSignal[]>([])
	const [topGainers, setTopGainers] = useState<TopCoin[]>([])
	const [topLosers, setTopLosers] = useState<TopCoin[]>([])

	// Fetch top gainers and losers directly from Redis


	useEffect(() => {
		console.log('🚀 Connecting to WebSocket at:', SOCKET_URL)

		const socket: Socket = io(`${SOCKET_URL}/signals`, {
			transports: ['websocket', 'polling'],
			reconnectionAttempts: 5,
			path: '/socket.io'
		})

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

		socket.on('signal:volatility', (signal: VolatilitySpikeSignal) => {
			console.log('📊 Received volatility signal:', signal)
			setVolatilitySpikes(prev => [signal, ...prev.slice(0, 99)])
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

		// Keep these for fallback in case Redis direct connection fails
		socket.on('top:gainers', (data: TopGainersSignal) => {
			console.log('📊 Received top gainers from socket:', data.coins.map(c => c.symbol).join(', '))
			setTopGainers(data.coins)
		})

		socket.on('top:losers', (data: TopLosersSignal) => {
			console.log('📊 Received top losers from socket:', data.coins.map(c => c.symbol).join(', '))
			setTopLosers(data.coins)
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
		volumeSpikes,
		priceChanges,
		topGainers,
		topLosers,
		volatilityRanges
	}
}
