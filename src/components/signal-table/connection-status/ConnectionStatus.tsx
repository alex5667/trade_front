'use client'

/**
 * ConnectionStatus Component
 * ------------------------------
 * Displays the current WebSocket connection status
 */
import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	selectConnectionError,
	selectConnectionStatus
} from '@/store/signals/selectors/signals.selectors'
import {
	connected,
	connecting,
	disconnected
} from '@/store/signals/slices/connection.slice'

import { getWebSocketClient } from '@/services/websocket.service'

export const ConnectionStatus = () => {
	const componentId = useRef(`connection-status-${Date.now()}`)
	const dispatch = useDispatch()

	// Get connection status and error from Redux
	const status = useSelector(selectConnectionStatus)
	const error = useSelector(selectConnectionError)
	const prevStatusRef = useRef(status)
	const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

	// Manual reconnect function - only used when user clicks button
	const handleReconnect = useCallback(() => {
		console.log(`🔄 [${componentId.current}] Manual reconnection attempt`)

		// First update UI state to show we're connecting
		dispatch(connecting())

		const wsClient = getWebSocketClient()

		// Check if already connected
		if (wsClient.isActive()) {
			console.log(
				`✅ [${componentId.current}] Already connected, updating status`
			)
			dispatch(connected())
			return
		}

		// Otherwise try to connect
		wsClient.connect()
	}, [dispatch, componentId])

	// Periodically check the actual connection status to keep Redux in sync
	// This helps handle cases where the WS connection drops without firing events
	useEffect(() => {
		// Set up periodic check for actual WebSocket status
		const checkActualStatus = () => {
			const wsClient = getWebSocketClient()
			const isActive = wsClient.isActive()

			// If WebSocket status doesn't match Redux state, update Redux
			if (isActive && status !== 'connected') {
				console.log(
					`⚠️ [${componentId.current}] State mismatch, actual: connected, redux: ${status}`
				)
				dispatch(connected())
			} else if (!isActive && status === 'connected') {
				console.log(
					`⚠️ [${componentId.current}] State mismatch, actual: disconnected, redux: ${status}`
				)
				dispatch(disconnected())
			}
		}

		// Check immediately and then set interval
		checkActualStatus()
		checkIntervalRef.current = setInterval(checkActualStatus, 5000)

		return () => {
			if (checkIntervalRef.current) {
				clearInterval(checkIntervalRef.current)
			}
		}
	}, [status, dispatch, componentId])

	// Log status changes
	useEffect(() => {
		if (prevStatusRef.current !== status) {
			console.log(
				`📡 [${componentId.current}] Connection status changed: ${prevStatusRef.current} -> ${status}`
			)
			prevStatusRef.current = status

			// If the socket reports it's connected but Redux state doesn't reflect that,
			// update the Redux state
			const wsClient = getWebSocketClient()
			if (wsClient.isActive() && status !== 'connected') {
				console.log(
					`⚠️ [${componentId.current}] State mismatch, correcting to connected`
				)
				dispatch(connected())
			}
		}
	}, [status, dispatch, componentId])

	// Component lifecycle logging
	useEffect(() => {
		console.log(`🔄 [${componentId.current}] ConnectionStatus effect started`)
		return () => {
			console.log(`🛑 [${componentId.current}] ConnectionStatus unmounted`)
		}
	}, [])

	// Map status to display text and CSS class
	const getStatusInfo = () => {
		switch (status) {
			case 'connected':
				return { text: 'Connected', className: 'text-green-500' }
			case 'connecting':
				return { text: 'Connecting...', className: 'text-yellow-500' }
			case 'disconnected':
				return { text: 'Disconnected', className: 'text-red-500' }
			case 'error':
				return { text: 'Connection Error', className: 'text-red-500' }
			default:
				return { text: 'Unknown', className: 'text-gray-500' }
		}
	}

	const { text, className } = getStatusInfo()

	return (
		<div className='flex items-center space-x-2 bg-gray-800 p-2 mb-3 rounded-md'>
			<div
				className={`w-3 h-3 rounded-full ${
					className.includes('green')
						? 'bg-green-500'
						: className.includes('yellow')
							? 'bg-yellow-500'
							: 'bg-red-500'
				}`}
			/>
			<span className={className}>{text}</span>

			{/* Show error message if any */}
			{error && <span className='text-xs text-red-400 ml-2'>{error}</span>}

			{/* Manual reconnect button if not connected */}
			{status !== 'connected' && (
				<button
					onClick={handleReconnect}
					className='ml-auto text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded'
				>
					Reconnect
				</button>
			)}
		</div>
	)
}
