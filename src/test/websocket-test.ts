'use client'

import { getSocketIOClient } from '@/services/socket-io.service'

/**
 * Socket.IO тестовый клиент
 * ------------------------------
 * Простой клиент для тестирования Socket.IO соединения
 * и получения торговых сигналов только для 24h таймфрейма
 */

// События для подписки (только 24h)
const EVENTS_TO_MONITOR = [
	'top:gainers:24h', 'top:losers:24h',
	'trigger:gainers-24h', 'trigger:losers-24h'
]

/**
 * This function tests the Socket.IO client functionality
 * by setting up event listeners and monitoring messages.
 */
export const testSocketIOClient = () => {
	console.log('Starting Socket.IO client test...')

	// Get Socket.IO client instance
	const client = getSocketIOClient()

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
		'top:gainers:24h', 'top:losers:24h',
		'trigger:gainers-24h', 'trigger:losers-24h'
	]

	// Generic event handler for logging and stats
	const handleEvent = (eventName: string) => (data: any) => {
		stats.messagesReceived++

		// Track event type counts
		stats.eventTypes[eventName] = (stats.eventTypes[eventName] || 0) + 1

		console.log(`[Socket.IO Test] Received ${eventName} event:`, data)
	}

	// Set up listeners for each event type
	eventTypes.forEach(eventType => {
		client.on(eventType, handleEvent(eventType))
	})

	// Special handlers for connection events
	client.on('connect', () => {
		console.log('[Socket.IO Test] Connected to server')
	})

	client.on('disconnect', () => {
		console.log('[Socket.IO Test] Disconnected from server')
		stats.connectionAttempts++
	})

	client.on('error', (error: Error | unknown) => {
		console.error('[Socket.IO Test] Error:', error)
		stats.errors++
	})

	// Connect to the Socket.IO server
	client.connect()

	// Print statistics every 10 seconds
	const statsInterval = setInterval(() => {
		console.log('\n📊 Socket.IO Test Statistics:')
		console.log('--------------------------------')
		console.log(`Messages received: ${stats.messagesReceived}`)
		console.log(`Connection attempts: ${stats.connectionAttempts}`)
		console.log(`Errors: ${stats.errors}`)
		console.log('\nEvent types:')
		Object.entries(stats.eventTypes).forEach(([type, count]) => {
			console.log(`  ${type}: ${count}`)
		})
		console.log('--------------------------------\n')
	}, 10000)

	// Test ping functionality every 30 seconds
	const pingInterval = setInterval(() => {
		if (client.isActive()) {
			console.log('[Socket.IO Test] Sending ping...')
			client.emit('ping', { test: 'ping', timestamp: Date.now() })
		}
	}, 30000)

	// Cleanup function
	const cleanup = () => {
		// Remove all event listeners
		eventTypes.forEach(eventType => {
			// Note: Socket.IO client doesn't have an off method in our implementation yet
			// This would need to be implemented if cleanup is required
		})

		// Clear intervals
		clearInterval(statsInterval)
		clearInterval(pingInterval)

		// Disconnect client
		client.disconnect()

		console.log('[Socket.IO Test] Test complete')
	}

	// Return cleanup function so test can be stopped early
	return cleanup
}

/**
 * Function to test Socket.IO with a custom message handler
 */
export const testSocketIOWithHandler = (
	messageHandler: (eventType: string, data: any) => void,
	duration = 60000
) => {
	console.log(`Starting Socket.IO test with custom handler for ${duration / 1000}s...`)

	// Get Socket.IO client instance
	const client = getSocketIOClient()

	// Set up event listeners for various signal types
	const eventTypes = [
		'signal:volatility', 'volatilitySpike', 'volatilityRange',
		'volumeSpike', 'priceChange',
		'top:gainers:24h', 'top:losers:24h'
	]

	// Create handlers for each event type
	const handlers: Record<string, (data: any) => void> = {}

	eventTypes.forEach(eventType => {
		handlers[eventType] = (data: any) => {
			messageHandler(eventType, data)
		}

		// Attach the handler to the Socket.IO client
		client.on(eventType, handlers[eventType])
	})

	// Connect to the Socket.IO server
	client.connect()

	// Set up timeout to end test after specified duration
	const timeout = setTimeout(() => {
		console.log('[Socket.IO Test] Test duration completed')
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

		console.log('[Socket.IO Test] Test complete')
	}

	// Return cleanup function so test can be stopped early
	return cleanup
}

// Alias for backward compatibility
export const testWebSocketClient = testSocketIOClient
export const testWebSocketWithHandler = testSocketIOWithHandler 