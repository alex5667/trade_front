'use client'

/**
 * ConnectionStatus Component
 * ------------------------------
 * Displays the current Socket.IO connection status
 */
import { useCallback, useEffect, useRef, useState } from 'react'
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

import { getSocketIOClient } from '@/services/socket-io.service'

export const ConnectionStatus = () => {
	const componentId = useRef(`connection-status-${Date.now()}`)
	const dispatch = useDispatch()

	// Get connection status and error from Redux (boolean)
	const isConnected = useSelector(selectConnectionStatus)
	const error = useSelector(selectConnectionError)

	// Local state to track connection process
	const [isConnecting, setIsConnecting] = useState(false)

	const prevStatusRef = useRef(isConnected)
	const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

	// Manual reconnect function - only used when user clicks button
	const handleReconnect = useCallback(() => {
		console.log(`🔄 [${componentId.current}] Manual reconnection attempt`)

		// First update local state to show we're connecting
		setIsConnecting(true)
		dispatch(connecting())

		const wsClient = getSocketIOClient()

		// Check if already connected
		if (wsClient.isActive()) {
			console.log(
				`✅ [${componentId.current}] Already connected, updating status`
			)
			dispatch(connected())
			setIsConnecting(false)
			return
		}

		// Otherwise try to connect
		wsClient.connect()

		// Set timeout to stop connecting state if connection takes too long
		setTimeout(() => {
			setIsConnecting(false)
		}, 5000)
	}, [dispatch, componentId])

	// Periodically check the actual connection status to keep Redux in sync
	// This helps handle cases where the Socket.IO connection drops without firing events
	useEffect(() => {
		// Set up periodic check for actual Socket.IO status
		const checkActualStatus = () => {
			const wsClient = getSocketIOClient()
			const isActive = wsClient.isActive()

			// If Socket.IO status doesn't match Redux state, update Redux
			if (isActive && !isConnected) {
				console.log(
					`⚠️ [${componentId.current}] State mismatch, actual: connected, redux: ${isConnected}`
				)
				dispatch(connected())
				setIsConnecting(false)
			} else if (!isActive && isConnected) {
				console.log(
					`⚠️ [${componentId.current}] State mismatch, actual: disconnected, redux: ${isConnected}`
				)
				dispatch(disconnected())
				setIsConnecting(false)
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
	}, [isConnected, dispatch, componentId])

	// Log status changes
	useEffect(() => {
		if (prevStatusRef.current !== isConnected) {
			console.log(
				`📡 [${componentId.current}] Connection status changed: ${prevStatusRef.current} -> ${isConnected}`
			)
			prevStatusRef.current = isConnected

			// If the socket reports it's connected but Redux state doesn't reflect that,
			// update the Redux state
			const wsClient = getSocketIOClient()
			if (wsClient.isActive() && !isConnected) {
				console.log(
					`⚠️ [${componentId.current}] State mismatch, correcting to connected`
				)
				dispatch(connected())
			}

			// Reset connecting state when connection status changes
			if (isConnected) {
				setIsConnecting(false)
			}
		}
	}, [isConnected, dispatch, componentId])

	// Component lifecycle logging
	useEffect(() => {
		console.log(`🔄 [${componentId.current}] ConnectionStatus effect started`)
		return () => {
			console.log(`🛑 [${componentId.current}] ConnectionStatus unmounted`)
		}
	}, [])

	// Map status to display text and CSS class
	const getStatusInfo = () => {
		if (isConnecting) {
			return { text: 'Connecting...', className: 'text-yellow-500' }
		}

		if (error) {
			return { text: 'Connection Error', className: 'text-red-500' }
		}

		if (isConnected) {
			return { text: 'Connected', className: 'text-green-500' }
		}

		return { text: 'Disconnected', className: 'text-red-500' }
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
			{!isConnected && !isConnecting && (
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
