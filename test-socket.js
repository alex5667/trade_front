const WebSocket = require('ws')

// Connect to the WebSocket server
const socket = new WebSocket('ws://localhost:4200')

// Connection opened
socket.addEventListener('open', event => {
	console.log('Connected to WebSocket server')

	// Send a test message
	socket.send(
		JSON.stringify({ type: 'ping', message: 'Hello from test client' })
	)
})

// Listen for messages
socket.addEventListener('message', event => {
	console.log('Message from server:', event.data)

	try {
		const data = JSON.parse(event.data)
		console.log('Parsed data:', data)
	} catch (e) {
		console.error('Error parsing message:', e)
	}
})

// Listen for errors
socket.addEventListener('error', event => {
	console.error('WebSocket error:', event)
})

// Listen for close
socket.addEventListener('close', event => {
	console.log('Connection closed:', event.code, event.reason)
})

// Keep the connection alive for testing
setTimeout(() => {
	console.log('Test complete, closing connection')
	socket.close()
}, 60000) // 1 minute timeout
