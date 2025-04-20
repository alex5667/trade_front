'use client'

import { memo, useCallback, useMemo } from 'react'

import { useSignalSocket } from '@/hooks/useSignalSocket'

import {
	checkHasAnyData,
	getUIConnectionStatus,
	isPersistentError
} from '@/utils/statusHelpers'

import ConnectionStatus from './ConnectionStatus'
import NoDataIndicator from './NoDataIndicator'
import TimeframeSection from './TimeframeSection'
import VolatilitySection from './VolatilitySection'
import styles from './signal-table.module.scss'

/**
 * SignalTable - Main component for displaying real-time signals from WebSocket
 * Includes connection status, various timeframe tables, and volatility data
 */
export const SignalTable = memo(function SignalTable() {
	// Use a single hook to get all socket data
	const signalData = useSignalSocket()

	// Memoize status calculations to prevent unnecessary re-renders
	const connectionStatus = useMemo(
		() => getUIConnectionStatus(signalData.connectionStatus),
		[signalData.connectionStatus]
	)

	const persistent = useMemo(
		() => isPersistentError(signalData.connectionStatus),
		[signalData.connectionStatus]
	)

	// Memoized check for any available data
	const hasAnyData = useCallback(
		() => checkHasAnyData(signalData),
		[signalData]
	)

	return (
		<div className={styles.signalTableContainer}>
			<h2 className={styles.sectionTitle}>🔥 Сигналы в реальном времени</h2>

			{/* Connection status indicators */}
			<ConnectionStatus
				status={connectionStatus.status}
				message={connectionStatus.message}
				isPersistentError={persistent}
			/>

			{/* Show when no data is available */}
			<NoDataIndicator
				hasAnyData={hasAnyData()}
				isError={connectionStatus.status === 'error'}
			/>

			{/* Timeframe section for 5min data */}
			<h2 className={styles.subSectionTitle}>
				Монеты с изменениями по фьючам 24ч интервал 5м
			</h2>

			<TimeframeSection
				gainers={signalData?.topGainers5min || []}
				losers={signalData?.topLosers5min || []}
				volume={signalData?.topVolume5min || []}
				funding={signalData?.topFunding5min || []}
				timeframe='5мин'
			/>

			{/* Volatility section */}
			<VolatilitySection
				volatilitySpikes={signalData?.volatilitySpikes || []}
				volatilityRanges={signalData?.volatilityRanges || []}
			/>

			{/* Additional content section - currently commented out */}
			<div className={styles.contentSection}>
				{/* Commented components are preserved from original code but not rendered
					Enable these sections as needed */}
				{/* 
				<VolumeSpikeTable signals={signalData?.volumeSpikes || []} />
				<PriceChangeTable signals={signalData?.priceChanges || []} />
				<TopCoinsTable
					coins={signalData?.topGainers || []}
					title='растущих монетах'
					isGainer={true}
				/>
				<TopCoinsTable
					coins={signalData?.topLosers || []}
					title='падающих монетах'
					isGainer={false}
				/>
				*/}
			</div>
		</div>
	)
})
