import { useCallback, useEffect, useRef, useState } from 'react'
import { TradeSignalClient } from './TradeSignalClient'
import {
	ConnectionStatus,
	PriceChangeData,
	SignalData,
	SignalType,
	Timeframe5MinData,
	TimeframeTopData,
	VolatilitySignal,
	VolumeChangeData
} from './types'

interface UseSignalSocketConfig {
	autoConnect?: boolean
	baseUrl?: string
	maxReconnectAttempts?: number
	reconnectDelay?: number
}

interface UseSignalSocketResult {
	connectionStatus: ConnectionStatus
	connect: () => void
	disconnect: () => void
	subscribe: (signalType: SignalType, callback: (data: SignalData) => void) => void
	unsubscribe: (signalType: SignalType, callback: (data: SignalData) => void) => void
	volatilitySignals: VolatilitySignal[]
	volumeSignals: VolumeChangeData[]
	priceChangeSignals: PriceChangeData[]
	timeframeData: TimeframeTopData | null
	timeframe5MinData: Timeframe5MinData | null
	error: Error | null
}

/**
 * React hook for connecting to and managing WebSocket signal data
 */
export function useSignalSocket(config?: UseSignalSocketConfig): UseSignalSocketResult {
	const defaultConfig = {
		autoConnect: true,
		baseUrl: 'wss://api.trade-signals.io',
		maxReconnectAttempts: 5,
		reconnectDelay: 2000,
	}

	const mergedConfig = { ...defaultConfig, ...config }

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
	}, [])

	const handleDisconnect = useCallback((code: number, reason: string) => {
		if (code === 1000) {
			// Normal closure
			setConnectionStatus(ConnectionStatus.Disconnected)
		} else {
			setConnectionStatus(ConnectionStatus.Reconnecting)
		}
	}, [])

	const handleError = useCallback((err: Error) => {
		setError(err)
		setConnectionStatus(ConnectionStatus.Failed)
	}, [])

	const handleReconnecting = useCallback(() => {
		setConnectionStatus(ConnectionStatus.Reconnecting)
	}, [])

	const handleVolatilitySignal = useCallback((data: VolatilitySignal) => {
		setVolatilitySignals(prev => {
			// Keep the most recent 50 signals
			const updated = [...prev, data].slice(-50)

			// Sort by timestamp, newest first
			return updated.sort((a, b) => b.timestamp - a.timestamp)
		})
	}, [])

	const handleVolumeSignal = useCallback((data: VolumeChangeData) => {
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
		setTimeframeData(data)
	}, [])

	const handleTimeframe5MinData = useCallback((data: Timeframe5MinData) => {
		setTimeframe5MinData(data)
	}, [])

	// Connect and disconnect methods
	const connect = useCallback(() => {
		if (!clientRef.current) return

		setConnectionStatus(ConnectionStatus.Connecting)
		clientRef.current.connect()
	}, [])

	const disconnect = useCallback(() => {
		if (!clientRef.current) return

		clientRef.current.disconnect()
		setConnectionStatus(ConnectionStatus.Disconnected)
	}, [])

	// Subscribe and unsubscribe methods
	const subscribe = useCallback((signalType: SignalType, callback: (data: SignalData) => void) => {
		if (!clientRef.current) return
		clientRef.current.on(signalType, callback)
	}, [])

	const unsubscribe = useCallback((signalType: SignalType, callback: (data: SignalData) => void) => {
		if (!clientRef.current) return
		clientRef.current.off(signalType, callback)
	}, [])

	// Set up event listeners
	useEffect(() => {
		const client = clientRef.current
		if (!client) return

		// Register handlers
		client.on('connect', handleConnect)
		client.on('disconnect', handleDisconnect)
		client.on('error', handleError)
		client.on('reconnecting', handleReconnecting)

		// Register signal handlers
		client.on(SignalType.Volatility, handleVolatilitySignal as any)
		client.on(SignalType.Volume, handleVolumeSignal as any)
		client.on(SignalType.PriceChange, handlePriceChangeSignal as any)
		client.on(SignalType.Timeframe, handleTimeframeData as any)
		client.on('timeframe5min', handleTimeframe5MinData as any)

		// Cleanup function
		return () => {
			client.off('connect', handleConnect)
			client.off('disconnect', handleDisconnect)
			client.off('error', handleError)
			client.off('reconnecting', handleReconnecting)

			client.off(SignalType.Volatility, handleVolatilitySignal as any)
			client.off(SignalType.Volume, handleVolumeSignal as any)
			client.off(SignalType.PriceChange, handlePriceChangeSignal as any)
			client.off(SignalType.Timeframe, handleTimeframeData as any)
			client.off('timeframe5min', handleTimeframe5MinData as any)
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
		handleTimeframe5MinData
	])

	// Auto-connect if specified
	useEffect(() => {
		if (mergedConfig.autoConnect && clientRef.current) {
			connect()
		}

		return () => {
			if (clientRef.current && clientRef.current.isActive()) {
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
		error
	}
}

export default useSignalSocket 