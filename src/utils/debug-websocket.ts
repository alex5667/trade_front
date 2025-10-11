/**
 * Утилита для отладки WebSocket соединения и данных Volatility Range
 * 
 * Использование в консоли браузера:
 * ```javascript
 * import { debugWebSocket } from '@/utils/debug-websocket'
 * debugWebSocket.checkAll()
 * ```
 * 
 * Или через window (если экспортировано):
 * ```javascript
 * window.__debugWS()
 * ```
 */

/**
 * Проверяет статус WebSocket подключения
 */
export function checkWebSocketConnection() {
	console.log('=== 🔌 WebSocket Connection Status ===')

	if (typeof window === 'undefined') {
		console.log('❌ Not running in browser environment')
		return
	}

	// Проверяем статус через window.__socketStats
	const stats = (window as any).__socketStats?.()
	if (stats) {
		console.log('✅ Socket Stats:', stats)
		console.log(`Connected: ${stats.connected ? '✅' : '❌'}`)
		console.log(`Connecting: ${stats.isConnecting ? '⏳' : '✅'}`)
		console.log(`Reconnect Attempts: ${stats.reconnectAttempts}`)
		console.log(`URL: ${stats.url}`)
	} else {
		console.log('❌ Socket stats not available. WebSocket might not be initialized.')
	}
}

/**
 * Проверяет данные в Redux Store
 */
export function checkReduxStore() {
	console.log('\n=== 📦 Redux Store Data ===')

	if (typeof window === 'undefined') {
		console.log('❌ Not running in browser environment')
		return
	}

	// Попытка получить store из Redux DevTools
	const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
	const store = (window as any).store

	let state: any = null

	if (devTools) {
		try {
			// Redux DevTools Extension API
			const instances = devTools.instances
			if (instances && instances.size > 0) {
				const firstInstance = Array.from(instances.values())[0] as any
				state = firstInstance.getState?.()
			}
		} catch (e) {
			console.log('⚠️ Could not get state from Redux DevTools:', e)
		}
	}

	if (!state && store?.getState) {
		state = store.getState()
	}

	if (!state) {
		console.log('❌ Redux store not accessible. Make sure Redux DevTools is installed or store is exposed to window.')
		return
	}

	// Проверяем данные волатильности
	const volatilityRange = state.volatilityRange
	const volatilitySpike = state.volatilitySpike
	const connection = state.connection

	console.log('Connection State:', connection)
	console.log(`Is Connected: ${connection?.isConnected ? '✅' : '❌'}`)
	console.log(`Connection Error: ${connection?.lastError || 'None'}`)

	console.log('\nVolatility Range Signals:')
	console.log(`  Count: ${volatilityRange?.signals?.length || 0}`)
	console.log(`  Last Updated: ${volatilityRange?.lastUpdated ? new Date(volatilityRange.lastUpdated).toLocaleString() : 'Never'}`)
	if (volatilityRange?.signals?.length > 0) {
		console.log('  Latest signals:', volatilityRange.signals.slice(0, 3))
	} else {
		console.log('  ⚠️ No signals in store')
	}

	console.log('\nVolatility Spike Signals:')
	console.log(`  Count: ${volatilitySpike?.signals?.length || 0}`)
	console.log(`  Last Updated: ${volatilitySpike?.lastUpdated ? new Date(volatilitySpike.lastUpdated).toLocaleString() : 'Never'}`)

	return state
}

/**
 * Подписывается на новые сигналы для отладки
 */
export function listenForSignals() {
	console.log('\n=== 👂 Setting Up Signal Listeners ===')

	if (typeof window === 'undefined') {
		console.log('❌ Not running in browser environment')
		return
	}

	// Пытаемся получить socket client
	let client: any = null

	// Способ 1: через window.__socketClient
	if ((window as any).__socketClient) {
		client = (window as any).__socketClient
	}

	// Способ 2: через прямой импорт (если доступен)
	if (!client && typeof require !== 'undefined') {
		try {
			const { getSocketIOClient } = require('@/services/socket-io.service')
			client = getSocketIOClient()
		} catch (e) {
			console.log('⚠️ Could not import socket client:', e)
		}
	}

	if (!client) {
		console.log('❌ Socket client not available')
		return
	}

	console.log('✅ Socket client found, setting up listeners...')

	const events = [
		'volatilityRange',
		'signal:volatilityRange',
		'volatilitySpike',
		'signal:volatility',
		'stream:volatilityRange'
	]

	events.forEach(eventName => {
		client.on(eventName, (data: any) => {
			console.log(`\n🔥 [DEBUG] Received ${eventName}:`, data)
			console.log(`  Symbol: ${data?.symbol}`)
			console.log(`  Type: ${data?.type}`)
			console.log(`  Timestamp: ${data?.timestamp || data?.receivedAt}`)
		})
	})

	console.log(`✅ Listening for events: ${events.join(', ')}`)
}

/**
 * Отправляет тестовое событие через WebSocket
 */
export function sendTestPing() {
	console.log('\n=== 🏓 Sending Test Ping ===')

	if (typeof window === 'undefined') {
		console.log('❌ Not running in browser environment')
		return
	}

	const client = (window as any).__socketClient
	if (!client) {
		console.log('❌ Socket client not available')
		return
	}

	client.emit('ping', { timestamp: Date.now() })
	console.log('✅ Ping sent. Check for pong response in logs.')
}

/**
 * Запускает все проверки
 */
export function checkAll() {
	console.clear()
	console.log('🔍 Starting WebSocket Debug Check...\n')

	checkWebSocketConnection()
	const state = checkReduxStore()
	listenForSignals()
	sendTestPing()

	console.log('\n=== 📋 Summary ===')
	console.log('Check the logs above for any issues.')
	console.log('If no signals are coming in:')
	console.log('1. Check backend is running on http://localhost:4202')
	console.log('2. Check backend is emitting volatilityRange events')
	console.log('3. Check Network tab for WebSocket messages')
	console.log('4. Check browser console for errors')

	return state
}

// Экспортируем для использования в window
export const debugWebSocket = {
	checkWebSocketConnection,
	checkReduxStore,
	listenForSignals,
	sendTestPing,
	checkAll
}

// Делаем доступным через window для удобства
if (typeof window !== 'undefined') {
	; (window as any).__debugWS = checkAll
		; (window as any).__debugWebSocket = debugWebSocket
}

