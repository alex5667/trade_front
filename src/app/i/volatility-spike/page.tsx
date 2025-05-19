'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { VolatilitySpikeComponent } from '@/components/Signals/VolatilitySignal/VolatilitySpikeComponent'
import { ConnectionStatus } from '@/components/signal-table/connection-status/ConnectionStatus'

import {
	selectConnectionError,
	selectConnectionStatus,
	selectVolatilitySpikeLastUpdated,
	selectVolatilitySpikeSignals
} from '@/store/signals'

export default function VolatilitySpikeSignalsPage() {
	const [isInitialized, setIsInitialized] = useState(false)
	const volatilitySpikeSignals = useSelector(selectVolatilitySpikeSignals)
	const lastUpdated = useSelector(selectVolatilitySpikeLastUpdated)
	const connectionStatus = useSelector(selectConnectionStatus)
	const connectionError = useSelector(selectConnectionError)
	console.log('volatilitySpikeSignals', volatilitySpikeSignals)
	console.log('connectionStatus', connectionStatus)

	// Use memoization to avoid recalculating the same data on each render
	const signalCount = useMemo(
		() => volatilitySpikeSignals?.length || 0,
		[volatilitySpikeSignals]
	)

	const isConnected = connectionStatus

	// Safely log signals without potentially causing message channel issues
	useEffect(() => {
		if (signalCount > 0 && isInitialized) {
			console.log(`Volatility spike signals loaded: ${signalCount}`)
		}
	}, [signalCount, isInitialized, lastUpdated])

	// Mark component as initialized after mounting
	useEffect(() => {
		setIsInitialized(true)
		return () => {
			setIsInitialized(false)
		}
	}, [])

	// Connection status message based on the connection state
	const getConnectionMessage = () => {
		if (connectionError) {
			return `Error connecting to WebSocket server: ${connectionError}`
		}
		return 'WebSocket disconnected. Waiting for reconnection...'
	}

	// Background color for status message
	const getStatusBgColor = () => {
		if (connectionError) {
			return 'bg-red-100 text-red-800'
		}
		return 'bg-yellow-100 text-yellow-800'
	}

	return (
		<>
			{/* Render the table with signals */}
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>Volatility Spike Signals</h1>
				<ConnectionStatus />
				{!isConnected && (
					<div className={`mb-4 p-3 rounded ${getStatusBgColor()}`}>
						{getConnectionMessage()}
					</div>
				)}
				{isConnected && signalCount === 0 ? (
					<div className='p-4 bg-gray-100 text-gray-700 rounded'>
						No volatility spike signals available. Waiting for data...
					</div>
				) : (
					<VolatilitySpikeComponent
						maxSignals={20}
						title='Volatility Spike Signals'
					/>
				)}
			</div>
		</>
	)
}
