'use client'

import { getWebSocketClient } from '@/services/websocket.service'

/**
 * This function tests the WebSocket client functionality
 * by setting up event listeners and monitoring messages.
 */
export const testWebSocketClient = () => {
	console.log('Starting WebSocket client test...')

	// Get WebSocket client instance
	const client = getWebSocketClient()

	// Track test statistics
	const stats = {
		messagesReceived: 0,
		connectionAttempts: 0,
		errors: 0,
		eventTypes: {} as Record<string, number>
	}

	// Set up event listeners for various signal types
	const eventTypes = [
		'connect', 'disconnect', 'error', 'pong',
		'signal:volatility', 'volatilitySpike', 'volatilityRange',
		'volumeSpike', 'priceChange',
		'top:gainers:5min', 'top:losers:5min', 'top:volume:5min', 'top:funding:5min',
		'top:gainers:24h', 'top:losers:24h',
		'trigger:gainers-5min', 'trigger:losers-5min', 'trigger:volume-5min',
		'trigger:funding-5min', 'trigger:gainers-24h', 'trigger:losers-24h'
	]

	// Generic event handler for logging and stats
	const handleEvent = (eventName: string) => (data: any) => {
		stats.messagesReceived++

		// Track event type counts
		stats.eventTypes[eventName] = (stats.eventTypes[eventName] || 0) + 1

		console.log(`[WebSocket Test] Received ${eventName} event:`, data)
	}

	// Set up listeners for each event type
	eventTypes.forEach(eventType => {
		client.on(eventType, handleEvent(eventType))
	})

	// Special handlers for connection events
	client.on('connect', () => {
		console.log('[WebSocket Test] Connected to server')
	})

	client.on('disconnect', () => {
		console.log('[WebSocket Test] Disconnected from server')
		stats.connectionAttempts++
	})

	client.on('error', (error: Error | unknown) => {
		console.error('[WebSocket Test] Error:', error)
		stats.errors++
	})

	// Connect to the WebSocket server
	client.connect()

	// Set up interval to report statistics
	const statsInterval = setInterval(() => {
		console.log('\n[WebSocket Test] Statistics:')
		console.log('------------------------')
		console.log(`Messages received: ${stats.messagesReceived}`)
		console.log(`Connection attempts: ${stats.connectionAttempts}`)
		console.log(`Errors: ${stats.errors}`)
		console.log(`Connection status: ${client.isActive() ? 'Connected' : 'Disconnected'}`)
		console.log('\nEvent types received:')

		Object.entries(stats.eventTypes).forEach(([type, count]) => {
			console.log(`  ${type}: ${count}`)
		})

		console.log('------------------------\n')
	}, 10000)

	// Return a cleanup function
	return () => {
		console.log('[WebSocket Test] Cleaning up...')

		// Remove all event listeners
		eventTypes.forEach(eventType => {
			client.off(eventType, handleEvent(eventType))
		})

		// Disconnect client
		client.disconnect()

		// Clear stats interval
		clearInterval(statsInterval)

		console.log('[WebSocket Test] Cleanup complete')
	}
}

/**
 * Function to test WebSocket with a custom message handler
 */
export const testWebSocketWithHandler = (
	messageHandler: (eventType: string, data: any) => void,
	duration = 60000
) => {
	console.log(`Starting WebSocket test with custom handler for ${duration / 1000}s...`)

	// Get WebSocket client instance
	const client = getWebSocketClient()

	// Set up event listeners for various signal types
	const eventTypes = [
		'signal:volatility', 'volatilitySpike', 'volatilityRange',
		'volumeSpike', 'priceChange',
		'top:gainers:5min', 'top:losers:5min', 'top:volume:5min', 'top:funding:5min',
		'top:gainers:24h', 'top:losers:24h'
	]

	// Create handlers for each event type
	const handlers: Record<string, (data: any) => void> = {}

	eventTypes.forEach(eventType => {
		handlers[eventType] = (data: any) => {
			messageHandler(eventType, data)
		}

		// Attach the handler to the WebSocket client
		client.on(eventType, handlers[eventType])
	})

	// Connect to the WebSocket server
	client.connect()

	// Set up timeout to end test after specified duration
	const timeout = setTimeout(() => {
		console.log('[WebSocket Test] Test duration completed')
		cleanup()
	}, duration)

	// Cleanup function
	const cleanup = () => {
		// Remove all event listeners
		eventTypes.forEach(eventType => {
			client.off(eventType, handlers[eventType])
		})

		// Disconnect client
		client.disconnect()

		// Clear timeout
		clearTimeout(timeout)

		console.log('[WebSocket Test] Test complete')
	}

	// Return cleanup function so test can be stopped early
	return cleanup
}

/**
 * Function to test data consistency between events
 */
export const testDataConsistency = () => {
	console.log('Starting data consistency test...')

	// Tracking data structures
	const symbolData: Record<string, {
		volatility?: number,
		volume?: number,
		price?: number,
		percentChange?: number,
		lastUpdate: number
	}> = {}

	// Handler for all messages
	const handleMessage = (eventType: string, data: any) => {
		if (!data || !data.symbol) return

		const symbol = data.symbol
		const timestamp = data.timestamp || Date.now()

		// Initialize if symbol doesn't exist
		if (!symbolData[symbol]) {
			symbolData[symbol] = { lastUpdate: timestamp }
		}

		// Update data fields based on event type
		if (eventType.includes('volatility') && data.volatility) {
			symbolData[symbol].volatility = data.volatility
		}

		if (eventType.includes('volume') && data.volume) {
			symbolData[symbol].volume = data.volume
		}

		if (eventType.includes('price') && data.price) {
			symbolData[symbol].price = data.price
		}

		if ((eventType.includes('gainers') || eventType.includes('losers')) && data.percentChange) {
			symbolData[symbol].percentChange = data.percentChange
		}

		symbolData[symbol].lastUpdate = timestamp

		// Log the update
		console.log(`[Consistency] Updated ${symbol} from ${eventType}:`, symbolData[symbol])
	}

	// Start test with our custom handler
	const cleanup = testWebSocketWithHandler(handleMessage, 30000)

	// Return cleanup function
	return cleanup
} 