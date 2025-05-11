const WebSocket = require('ws')

// Configuration
const WS_URL = 'ws://127.0.0.1:4200'
const TEST_DURATION = 60000 // 1 minute
const PING_INTERVAL = 30000 // 30 seconds

// Statistics
let stats = {
	messagesReceived: 0,
	messagesParsed: 0,
	errors: 0,
	messageTypes: {},
	lastMessageTime: null
}

// Connect to the WebSocket server
console.log(`Connecting to WebSocket server at ${WS_URL}...`)
const socket = new WebSocket(WS_URL)

// Connection opened
socket.addEventListener('open', event => {
	console.log('✅ Connected to WebSocket server')

	// Start sending periodic pings
	const pingInterval = setInterval(() => {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
		}
	}, PING_INTERVAL)

	// Clear interval on close
	socket.addEventListener('close', () => {
		clearInterval(pingInterval)
	})
})

// Listen for messages
socket.addEventListener('message', event => {
	stats.messagesReceived++
	stats.lastMessageTime = Date.now()

	try {
		const data = JSON.parse(event.data)
		stats.messagesParsed++

		// Track message types
		const eventType = data.event || data.type || 'unknown'
		stats.messageTypes[eventType] = (stats.messageTypes[eventType] || 0) + 1

		// Log message details
		console.log(`📨 Received ${eventType} message:`, {
			timestamp: new Date().toISOString(),
			data: data
		})

		// Validate message format
		validateMessageFormat(data)
	} catch (e) {
		stats.errors++
		console.error('❌ Error parsing message:', e)
		console.log('Raw message:', event.data)
	}
})

// Listen for errors
socket.addEventListener('error', event => {
	stats.errors++
	console.error('❌ WebSocket error:', event)
})

// Listen for close
socket.addEventListener('close', event => {
	console.log('🔌 Connection closed:', {
		code: event.code,
		reason: event.reason,
		wasClean: event.wasClean
	})
})

// Validate message format
function validateMessageFormat(data) {
	const requiredFields = {
		volatilitySpike: ['type', 'symbol', 'interval', 'volatility', 'timestamp'],
		volatilityRange: [
			'type',
			'symbol',
			'interval',
			'range',
			'avgRange',
			'timestamp'
		],
		'signal:volatility': [
			'type',
			'symbol',
			'interval',
			'volatility',
			'timestamp'
		],
		'signal:volatilityRange': [
			'type',
			'symbol',
			'interval',
			'range',
			'avgRange',
			'timestamp'
		]
	}

	const eventType = data.event || data.type
	if (requiredFields[eventType]) {
		const missingFields = requiredFields[eventType].filter(
			field => !data[field]
		)
		if (missingFields.length > 0) {
			console.warn(
				`⚠️ Message missing required fields for ${eventType}:`,
				missingFields
			)
		}
	}
}

// Print statistics periodically
const statsInterval = setInterval(() => {
	const now = Date.now()
	const timeSinceLastMessage = stats.lastMessageTime
		? now - stats.lastMessageTime
		: null

	console.log('\n📊 WebSocket Statistics:')
	console.log('------------------------')
	console.log(`Messages received: ${stats.messagesReceived}`)
	console.log(`Messages parsed: ${stats.messagesParsed}`)
	console.log(`Errors: ${stats.errors}`)
	console.log('\nMessage types:')
	Object.entries(stats.messageTypes).forEach(([type, count]) => {
		console.log(`  ${type}: ${count}`)
	})
	if (timeSinceLastMessage) {
		console.log(`\nTime since last message: ${timeSinceLastMessage}ms`)
	}
	console.log('------------------------\n')
}, 10000)

// Cleanup on exit
process.on('SIGINT', () => {
	console.log('\n🛑 Test complete, closing connection...')
	clearInterval(statsInterval)
	socket.close()
	process.exit(0)
})

// Keep the connection alive for testing
setTimeout(() => {
	console.log('\n⏱️ Test duration complete, closing connection...')
	clearInterval(statsInterval)
	socket.close()
	process.exit(0)
}, TEST_DURATION)
