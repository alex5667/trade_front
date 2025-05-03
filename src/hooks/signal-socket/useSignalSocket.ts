import { useCallback, useEffect, useRef, useState } from 'react'
import { TradeSignalClient } from './TradeSignalClient'
import {
	ConnectionStatus,
	PriceChangeData,
	SignalData,
	SignalType,
	Timeframe5MinData,
	TimeframeCoin,
	TimeframeTopData,
	UseSignalSocketResult,
	VolatilitySignal,
	VolumeChangeData
} from './types'

interface UseSignalSocketConfig {
	autoConnect?: boolean
	baseUrl?: string
	maxReconnectAttempts?: number
	reconnectDelay?: number
}

/**
 * React hook for connecting to and managing WebSocket signal data
 */
export function useSignalSocket(config?: UseSignalSocketConfig): UseSignalSocketResult {
	// Default config with WebSocket URL from env
	const defaultConfig = {
		autoConnect: true,
		baseUrl: 'ws://localhost:4200',
		maxReconnectAttempts: 5,
		reconnectDelay: 2000,
	}

	const mergedConfig = { ...defaultConfig, ...config }

	// Ensure the base URL is using WebSocket protocol
	if (!mergedConfig.baseUrl.startsWith('ws://') && !mergedConfig.baseUrl.startsWith('wss://')) {
		mergedConfig.baseUrl = `ws://${mergedConfig.baseUrl.replace(/^http(s)?:\/\//, '')}`
	}

	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
		ConnectionStatus.Disconnected
	)
	const [error, setError] = useState<Error | null>(null)

	// Store signal data
	const [volatilitySignals, setVolatilitySignals] = useState<VolatilitySignal[]>([])
	const [volumeSignals, setVolumeSignals] = useState<VolumeChangeData[]>([])
	const [priceChangeSignals, setPriceChangeSignals] = useState<PriceChangeData[]>([])
	const [timeframeData, setTimeframeData] = useState<TimeframeTopData | null>(null)
	const [timeframe5MinData, setTimeframe5MinData] = useState<Timeframe5MinData | null>(null)

	// Add state for 1h, 4h, and 24h timeframe data
	const [timeframe1hData, setTimeframe1hData] = useState<TimeframeTopData | null>(null)
	const [timeframe4hData, setTimeframe4hData] = useState<TimeframeTopData | null>(null)
	const [timeframe24hData, setTimeframe24hData] = useState<TimeframeTopData | null>(null)

	// Add specific state for gainers/losers without timeframe
	const [topGainers5min, setTopGainers5min] = useState<TimeframeCoin[]>([])
	const [topLosers5min, setTopLosers5min] = useState<TimeframeCoin[]>([])

	// Add specific state for volume and funding 5min data
	const [topVolume5min, setTopVolume5min] = useState<TimeframeCoin[]>([])
	const [topFunding5min, setTopFunding5min] = useState<TimeframeCoin[]>([])

	// Create a ref to hold the client instance to avoid recreation on each render
	const clientRef = useRef<TradeSignalClient | null>(null)

	// Initialize the client if it doesn't exist
	if (!clientRef.current) {
		clientRef.current = new TradeSignalClient({
			baseUrl: mergedConfig.baseUrl,
			maxReconnectAttempts: mergedConfig.maxReconnectAttempts,
			reconnectDelay: mergedConfig.reconnectDelay,
		})
	}

	// Callbacks for handling events
	const handleConnect = useCallback(() => {
		setConnectionStatus(ConnectionStatus.Connected)
		setError(null)
		console.log('✅ WebSocket connected')
	}, [])

	const handleDisconnect = useCallback((data: { code: number, reason: string }) => {
		const code = data?.code || 0
		if (code === 1000) {
			// Normal closure
			setConnectionStatus(ConnectionStatus.Disconnected)
			console.log('🔌 WebSocket disconnected normally')
		} else {
			setConnectionStatus(ConnectionStatus.Reconnecting)
			console.log(`⚠️ WebSocket disconnected with code ${code}, attempting to reconnect...`)
		}
	}, [])

	const handleError = useCallback((err: Error) => {
		setError(err)
		setConnectionStatus(ConnectionStatus.Failed)
		console.error('❌ WebSocket error:', err)
	}, [])

	const handleReconnecting = useCallback(() => {
		setConnectionStatus(ConnectionStatus.Reconnecting)
		console.log('🔄 WebSocket reconnecting...')
	}, [])

	const handleVolatilitySignal = useCallback((data: VolatilitySignal | any) => {
		console.log('📊 Received volatility signal:', data)

		// Определяем тип сигнала волатильности
		const isVolatilityRange =
			data.type === 'volatilityRange' ||
			data.type === 'signal:volatilityRange' ||
			(data.hasOwnProperty('range') && data.hasOwnProperty('avgRange'))

		if (isVolatilityRange) {
			console.log('📊 Processing as volatilityRange signal')
			// Дополнительная обработка для range сигналов может быть добавлена здесь
		}

		setVolatilitySignals(prev => {
			// Keep the most recent 50 signals
			const updated = [...prev, data].slice(-50)

			// Sort by timestamp, newest first
			return updated.sort((a, b) => b.timestamp - a.timestamp)
		})
	}, [])

	const handleVolumeSignal = useCallback((data: VolumeChangeData) => {
		console.log('📈 Received volume signal:', data)
		setVolumeSignals(prev => {
			// Find if we already have this symbol
			const existingIndex = prev.findIndex(item => item.symbol === data.symbol)

			if (existingIndex >= 0) {
				// Update existing item
				const updated = [...prev]
				updated[existingIndex] = data
				return updated
			} else {
				// Add new item, keeping max 20 items
				return [...prev, data].slice(-20)
			}
		})
	}, [])

	const handlePriceChangeSignal = useCallback((data: PriceChangeData) => {
		console.log('💹 Received price change signal:', data)
		setPriceChangeSignals(prev => {
			// Find if we already have this symbol
			const existingIndex = prev.findIndex(item => item.symbol === data.symbol)

			if (existingIndex >= 0) {
				// Update existing item
				const updated = [...prev]
				updated[existingIndex] = data
				return updated
			} else {
				// Add new item, keeping max 20 items
				return [...prev, data].slice(-20)
			}
		})
	}, [])

	const handleTimeframeData = useCallback((data: TimeframeTopData) => {
		console.log('⏱️ Received timeframe data:', data)
		setTimeframeData(data)
	}, [])

	const handleTimeframe5MinData = useCallback((data: Timeframe5MinData) => {
		console.log('⏱️ Received 5min timeframe data:', data)

		// Validate data before setting state
		if (data) {
			// Make sure data has the expected structure
			const validData: Timeframe5MinData = {
				gainers: Array.isArray(data.gainers) ? data.gainers : [],
				losers: Array.isArray(data.losers) ? data.losers : [],
				volume: Array.isArray(data.volume) ? data.volume : [],
				funding: Array.isArray(data.funding) ? data.funding : [],
			}

			setTimeframe5MinData(validData)
			console.log('✅ 5min timeframe data set successfully')
		} else {
			console.warn('⚠️ Received empty or invalid 5min timeframe data')
		}
	}, [])

	const handleTimeframe1hData = useCallback((data: any) => {
		console.log('⏱️ Received 1h timeframe data:', data)
		// If data is coming in the format we expect, use it directly
		if (data && (data.gainers || data.losers)) {
			setTimeframe1hData(data as TimeframeTopData)
		}
	}, [])

	const handleTimeframe4hData = useCallback((data: any) => {
		console.log('⏱️ Received 4h timeframe data:', data)
		// If data is coming in the format we expect, use it directly
		if (data && (data.gainers || data.losers)) {
			setTimeframe4hData(data as TimeframeTopData)
		}
	}, [])

	const handleTimeframe24hData = useCallback((data: any) => {
		console.log('⏱️ Received 24h timeframe data:', data)
		// If data is coming in the format we expect, use it directly
		if (data && (data.gainers || data.losers)) {
			setTimeframe24hData(data as TimeframeTopData)
		}
	}, [])

	// Connect and disconnect methods
	const connect = useCallback(() => {
		if (!clientRef.current) return

		setConnectionStatus(ConnectionStatus.Connecting)
		console.log('🔄 Connecting to WebSocket server...')
		clientRef.current.connect()
	}, [])

	const disconnect = useCallback(() => {
		if (!clientRef.current) return

		clientRef.current.disconnect()
		setConnectionStatus(ConnectionStatus.Disconnected)
		console.log('🔌 Disconnected from WebSocket server')
	}, [])

	// Subscribe and unsubscribe methods
	const subscribe = useCallback((signalType: SignalType, callback: (data: SignalData) => void) => {
		if (!clientRef.current) return
		clientRef.current.on(signalType, callback)
		console.log(`📡 Subscribed to ${signalType} signals`)
	}, [])

	const unsubscribe = useCallback((signalType: SignalType, callback: (data: SignalData) => void) => {
		if (!clientRef.current) return
		clientRef.current.off(signalType, callback)
		console.log(`📴 Unsubscribed from ${signalType} signals`)
	}, [])

	// Set up event listeners
	useEffect(() => {
		const client = clientRef.current
		if (!client) return

		console.log('🔄 Setting up WebSocket event handlers')

		// Register handlers
		client.on('connect', handleConnect)
		client.on('disconnect', handleDisconnect)
		client.on('error', handleError)
		client.on('reconnecting', handleReconnecting)

		// Register standard signals
		client.on(SignalType.Volatility, handleVolatilitySignal as any)
		client.on(SignalType.Volume, handleVolumeSignal as any)
		client.on(SignalType.PriceChange, handlePriceChangeSignal as any)
		client.on(SignalType.Timeframe, handleTimeframeData as any)

		// Also register direct signal handlers for backward compatibility
		client.on('volatilitySpike', handleVolatilitySignal as any)
		client.on('volatilityRange', handleVolatilitySignal as any)
		client.on('signal:volatility', handleVolatilitySignal as any)
		client.on('signal:volatilityRange', handleVolatilitySignal as any)

		client.on('volumeSpike', handleVolumeSignal as any)
		client.on('priceChange', handlePriceChangeSignal as any)

		// For 5-minute timeframe data
		client.on('timeframe5min', handleTimeframe5MinData as any)
		client.on('top:gainers:5min', (data) => {
			if (timeframe5MinData) {
				setTimeframe5MinData({
					...timeframe5MinData,
					gainers: data
				})
			} else {
				setTimeframe5MinData({
					gainers: data,
					losers: [],
					volume: [],
					funding: []
				})
			}
		})
		client.on('top:losers:5min', (data) => {
			if (timeframe5MinData) {
				setTimeframe5MinData({
					...timeframe5MinData,
					losers: data
				})
			} else {
				setTimeframe5MinData({
					gainers: [],
					losers: data,
					volume: [],
					funding: []
				})
			}
		})
		client.on('top:volume:5min', (data) => {
			console.log('📊 Received top:volume:5min:', data)

			// Ensure data is an array
			let volumeData = data
			if (!Array.isArray(volumeData)) {
				console.warn('⚠️ Volume data is not an array, trying to convert:', volumeData)
				try {
					if (typeof volumeData === 'string') {
						volumeData = JSON.parse(volumeData)
					} else if (volumeData && typeof volumeData === 'object' && volumeData.payload) {
						volumeData = volumeData.payload
					} else if (volumeData && typeof volumeData === 'object') {
						volumeData = [volumeData]
					} else {
						volumeData = []
					}
				} catch (e) {
					console.error('❌ Failed to parse volume data:', e)
					volumeData = []
				}
			}

			// Final validation
			if (!Array.isArray(volumeData)) {
				console.error('❌ Failed to convert volume data to array, using empty array')
				volumeData = []
			}

			// Update dedicated state for topVolume5min
			setTopVolume5min(volumeData)

			if (timeframe5MinData) {
				setTimeframe5MinData({
					...timeframe5MinData,
					volume: volumeData
				})
			} else {
				setTimeframe5MinData({
					gainers: [],
					losers: [],
					volume: volumeData,
					funding: []
				})
			}
		})
		client.on('top:funding:5min', (data) => {
			console.log('💹 Received top:funding:5min:', data)

			// Ensure data is an array
			let fundingData = data
			if (!Array.isArray(fundingData)) {
				console.warn('⚠️ Funding data is not an array, trying to convert:', fundingData)
				try {
					if (typeof fundingData === 'string') {
						fundingData = JSON.parse(fundingData)
					} else if (fundingData && typeof fundingData === 'object' && fundingData.payload) {
						fundingData = fundingData.payload
					} else if (fundingData && typeof fundingData === 'object') {
						fundingData = [fundingData]
					} else {
						fundingData = []
					}
				} catch (e) {
					console.error('❌ Failed to parse funding data:', e)
					fundingData = []
				}
			}

			// Final validation
			if (!Array.isArray(fundingData)) {
				console.error('❌ Failed to convert funding data to array, using empty array')
				fundingData = []
			}

			// Update dedicated state for topFunding5min
			setTopFunding5min(fundingData)

			if (timeframe5MinData) {
				setTimeframe5MinData({
					...timeframe5MinData,
					funding: fundingData
				})
			} else {
				setTimeframe5MinData({
					gainers: [],
					losers: [],
					volume: [],
					funding: fundingData
				})
			}
		})

		// For top gainers/losers without specific timeframe (map them to 5min)
		client.on('top:gainers:', (data) => {
			console.log('📈 Received top:gainers: without timeframe:', data)

			// Extract the correct data from the payload structure and ensure it's an array
			let gainersData = data?.payload || data

			// Convert to array if needed
			if (!Array.isArray(gainersData)) {
				console.warn('⚠️ Gainers data is not an array, trying to convert:', gainersData)
				try {
					if (typeof gainersData === 'string') {
						gainersData = JSON.parse(gainersData)
					} else if (gainersData && typeof gainersData === 'object') {
						gainersData = [gainersData]
					} else {
						gainersData = []
					}
				} catch (e) {
					console.error('❌ Failed to parse gainers data:', e)
					gainersData = []
				}
			}

			// Final validation - ensure it's an array
			if (!Array.isArray(gainersData)) {
				console.error('❌ Failed to convert gainers data to array, using empty array')
				gainersData = []
			}

			console.log('📈 Processed gainers data to use:', gainersData)

			// Update dedicated state for topGainers5min
			setTopGainers5min(gainersData)
			console.log('📊 Updated topGainers5min state')

			if (timeframe5MinData) {
				console.log('📊 Updating existing timeframe5MinData with gainers')
				setTimeframe5MinData({
					...timeframe5MinData,
					gainers: gainersData
				})
			} else {
				console.log('📊 Creating new timeframe5MinData with gainers')
				setTimeframe5MinData({
					gainers: gainersData,
					losers: [],
					volume: [],
					funding: []
				})
			}

			// Debug what's in the state after update
			setTimeout(() => {
				console.log('📊 Current timeframe5MinData after update:', timeframe5MinData)
				console.log('📊 Current topGainers5min after update:', topGainers5min)
			}, 100)
		})

		client.on('top:losers:', (data) => {
			console.log('📉 Received top:losers: without timeframe:', data)

			// Extract the correct data from the payload structure and ensure it's an array
			let losersData = data?.payload || data

			// Convert to array if needed
			if (!Array.isArray(losersData)) {
				console.warn('⚠️ Losers data is not an array, trying to convert:', losersData)
				try {
					if (typeof losersData === 'string') {
						losersData = JSON.parse(losersData)
					} else if (losersData && typeof losersData === 'object') {
						losersData = [losersData]
					} else {
						losersData = []
					}
				} catch (e) {
					console.error('❌ Failed to parse losers data:', e)
					losersData = []
				}
			}

			// Final validation - ensure it's an array
			if (!Array.isArray(losersData)) {
				console.error('❌ Failed to convert losers data to array, using empty array')
				losersData = []
			}

			console.log('📉 Processed losers data to use:', losersData)

			// Update dedicated state for topLosers5min
			setTopLosers5min(losersData)
			console.log('📊 Updated topLosers5min state')

			if (timeframe5MinData) {
				console.log('📊 Updating existing timeframe5MinData with losers')
				setTimeframe5MinData({
					...timeframe5MinData,
					losers: losersData
				})
			} else {
				console.log('📊 Creating new timeframe5MinData with losers')
				setTimeframe5MinData({
					gainers: [],
					losers: losersData,
					volume: [],
					funding: []
				})
			}

			// Debug what's in the state after update
			setTimeout(() => {
				console.log('📊 Current timeframe5MinData after update:', timeframe5MinData)
				console.log('📊 Current topLosers5min after update:', topLosers5min)
			}, 100)
		})

		// For 1h timeframe data
		client.on('timeframe1h', handleTimeframe1hData as any)
		client.on('top:gainers:1h', (data) => {
			console.log('📈 Received top:gainers:1h:', data)
			if (timeframe1hData) {
				setTimeframe1hData({
					...timeframe1hData,
					gainers: data
				})
			} else {
				setTimeframe1hData({
					gainers: data,
					losers: []
				})
			}
		})
		client.on('top:losers:1h', (data) => {
			console.log('📉 Received top:losers:1h:', data)
			if (timeframe1hData) {
				setTimeframe1hData({
					...timeframe1hData,
					losers: data
				})
			} else {
				setTimeframe1hData({
					gainers: [],
					losers: data
				})
			}
		})

		// For 4h timeframe data
		client.on('timeframe4h', handleTimeframe4hData as any)
		client.on('top:gainers:4h', (data) => {
			console.log('📈 Received top:gainers:4h:', data)
			if (timeframe4hData) {
				setTimeframe4hData({
					...timeframe4hData,
					gainers: data
				})
			} else {
				setTimeframe4hData({
					gainers: data,
					losers: []
				})
			}
		})
		client.on('top:losers:4h', (data) => {
			console.log('📉 Received top:losers:4h:', data)
			if (timeframe4hData) {
				setTimeframe4hData({
					...timeframe4hData,
					losers: data
				})
			} else {
				setTimeframe4hData({
					gainers: [],
					losers: data
				})
			}
		})

		// For 24h timeframe data
		client.on('timeframe24h', handleTimeframe24hData as any)
		client.on('top:gainers:24h', (data) => {
			console.log('📈 Received top:gainers:24h:', data)
			if (timeframe24hData) {
				setTimeframe24hData({
					...timeframe24hData,
					gainers: data
				})
			} else {
				setTimeframe24hData({
					gainers: data,
					losers: []
				})
			}
		})
		client.on('top:losers:24h', (data) => {
			console.log('📉 Received top:losers:24h:', data)
			if (timeframe24hData) {
				setTimeframe24hData({
					...timeframe24hData,
					losers: data
				})
			} else {
				setTimeframe24hData({
					gainers: [],
					losers: data
				})
			}
		})

		// Also register legacy trigger handlers
		client.on('trigger:gainers-1h', (data) => {
			console.log('📊 Received trigger:gainers-1h:', data)
		})
		client.on('trigger:losers-1h', (data) => {
			console.log('📊 Received trigger:losers-1h:', data)
		})
		client.on('trigger:gainers-4h', (data) => {
			console.log('📊 Received trigger:gainers-4h:', data)
		})
		client.on('trigger:losers-4h', (data) => {
			console.log('📊 Received trigger:losers-4h:', data)
		})
		client.on('trigger:gainers-24h', (data) => {
			console.log('📊 Received trigger:gainers-24h:', data)
		})
		client.on('trigger:losers-24h', (data) => {
			console.log('📊 Received trigger:losers-24h:', data)
		})

		// Cleanup function
		return () => {
			console.log('🧹 Cleaning up WebSocket event handlers')

			client.off('connect', handleConnect)
			client.off('disconnect', handleDisconnect)
			client.off('error', handleError)
			client.off('reconnecting', handleReconnecting)

			client.off(SignalType.Volatility, handleVolatilitySignal as any)
			client.off(SignalType.Volume, handleVolumeSignal as any)
			client.off(SignalType.PriceChange, handlePriceChangeSignal as any)
			client.off(SignalType.Timeframe, handleTimeframeData as any)

			client.off('volatilitySpike', handleVolatilitySignal as any)
			client.off('volatilityRange', handleVolatilitySignal as any)
			client.off('signal:volatility', handleVolatilitySignal as any)
			client.off('signal:volatilityRange', handleVolatilitySignal as any)

			client.off('volumeSpike', handleVolumeSignal as any)
			client.off('priceChange', handlePriceChangeSignal as any)

			client.off('timeframe5min', handleTimeframe5MinData as any)
			client.off('top:gainers:5min', handleTimeframe5MinData as any)
			client.off('top:losers:5min', handleTimeframe5MinData as any)
			client.off('top:volume:5min', handleTimeframe5MinData as any)
			client.off('top:funding:5min', handleTimeframe5MinData as any)

			// Also clean up the non-timeframed handlers
			client.off('top:gainers:', null as any)
			client.off('top:losers:', null as any)

			client.off('top:gainers:1h', handleTimeframe1hData as any)
			client.off('top:losers:1h', handleTimeframe1hData as any)

			client.off('timeframe4h', handleTimeframe4hData as any)
			client.off('top:gainers:4h', handleTimeframe4hData as any)
			client.off('top:losers:4h', handleTimeframe4hData as any)

			client.off('timeframe24h', handleTimeframe24hData as any)
			client.off('top:gainers:24h', handleTimeframe24hData as any)
			client.off('top:losers:24h', handleTimeframe24hData as any)

			client.off('trigger:gainers-1h', null as any)
			client.off('trigger:losers-1h', null as any)
			client.off('trigger:gainers-4h', null as any)
			client.off('trigger:losers-4h', null as any)
			client.off('trigger:gainers-24h', null as any)
			client.off('trigger:losers-24h', null as any)
		}
	}, [
		handleConnect,
		handleDisconnect,
		handleError,
		handleReconnecting,
		handleVolatilitySignal,
		handleVolumeSignal,
		handlePriceChangeSignal,
		handleTimeframeData,
		handleTimeframe5MinData,
		handleTimeframe1hData,
		handleTimeframe4hData,
		handleTimeframe24hData,
		timeframe5MinData,
		timeframe1hData,
		timeframe4hData,
		timeframe24hData
	])

	// Auto-connect if specified
	useEffect(() => {
		if (mergedConfig.autoConnect && clientRef.current) {
			console.log('🚀 Auto-connecting to WebSocket server')
			connect()
		}

		return () => {
			if (clientRef.current && clientRef.current.isActive()) {
				console.log('🧹 Disconnecting WebSocket on cleanup')
				clientRef.current.disconnect()
			}
		}
	}, [connect, mergedConfig.autoConnect])

	return {
		connectionStatus,
		connect,
		disconnect,
		subscribe,
		unsubscribe,
		volatilitySignals,
		volumeSignals,
		priceChangeSignals,
		timeframeData,
		timeframe5MinData,
		timeframe1hData,
		timeframe4hData,
		timeframe24hData,
		topGainers5min,
		topLosers5min,
		topVolume5min,
		topFunding5min,
		error
	}
}

export default useSignalSocket 