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

import styles from './VolatilitySpike.module.scss'

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

	// Background class for status message
	const getStatusClass = () => {
		if (connectionError) return styles.statusError
		return styles.statusWarning
	}

	return (
		<>
			{/* Render the table with signals */}
			<div className={styles.pageWrap}>
				<h1 className={styles.title}>Volatility Spike Signals</h1>
				<ConnectionStatus />
				{!isConnected && (
					<div className={getStatusClass()}>{getConnectionMessage()}</div>
				)}
				{isConnected && signalCount === 0 ? (
					<div className={styles.emptyBox}>
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
