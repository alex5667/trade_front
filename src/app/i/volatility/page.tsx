'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { ConnectionStatus } from '@/components/signal-table/connection-status/ConnectionStatus'
import { VolatilityTable } from '@/components/signal-table/volatility-table/VolatilityTable'

import {
	selectConnectionStatus,
	selectVolatilitySignals
} from '@/store/signals'

export default function VolatilityPage() {
	const [isInitialized, setIsInitialized] = useState(false)
	const volatilitySignals = useSelector(selectVolatilitySignals)
	const connectionStatus = useSelector(selectConnectionStatus)
	console.log('volatilitySignals', volatilitySignals)
	console.log('connectionStatus', connectionStatus)

	// Use memoization to avoid recalculating the same data on each render
	const signalCount = useMemo(
		() => volatilitySignals?.length || 0,
		[volatilitySignals]
	)

	const isConnected = useMemo(
		() => connectionStatus === 'connected',
		[connectionStatus]
	)

	// Safely log signals without potentially causing message channel issues
	useEffect(() => {
		if (signalCount > 0 && isInitialized) {
			console.log(`Volatility signals loaded: ${signalCount}`)
		}
	}, [signalCount, isInitialized])

	// Mark component as initialized after mounting
	useEffect(() => {
		setIsInitialized(true)
		return () => {
			setIsInitialized(false)
		}
	}, [])

	// Connection status message based on the actual status value
	const getConnectionMessage = () => {
		switch (connectionStatus) {
			case 'connecting':
				return 'Connecting to WebSocket server...'
			case 'disconnected':
				return 'WebSocket disconnected. Waiting for reconnection...'
			case 'error':
				return 'Error connecting to WebSocket server. Please try again later.'
			default:
				return ''
		}
	}

	// Background colors for different status messages
	const getStatusBgColor = () => {
		switch (connectionStatus) {
			case 'connecting':
				return 'bg-blue-100 text-blue-800'
			case 'disconnected':
				return 'bg-yellow-100 text-yellow-800'
			case 'error':
				return 'bg-red-100 text-red-800'
			default:
				return ''
		}
	}

	return (
		<>
			{/* Render the table with signals */}
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>Volatility Signals</h1>
				<ConnectionStatus />
				{connectionStatus !== 'connected' && (
					<div className={`mb-4 p-3 rounded ${getStatusBgColor()}`}>
						{getConnectionMessage()}
					</div>
				)}
				{isConnected && signalCount === 0 ? (
					<div className='p-4 bg-gray-100 text-gray-700 rounded'>
						No volatility signals available. Waiting for data...
					</div>
				) : (
					<VolatilityTable
						signals={volatilitySignals}
						title='All Volatility Signals'
					/>
				)}
			</div>
		</>
	)
}
