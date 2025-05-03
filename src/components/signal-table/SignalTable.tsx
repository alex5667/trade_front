'use client'

import { memo, useCallback, useEffect, useMemo } from 'react'

import {
	TimeframeCoin as OldTimeframeCoin,
	VolatilitySpikeSignal
} from '@/types/signal.types'

import {
	FundingCoin as NewFundingCoin,
	TimeframeCoin as NewTimeframeCoin,
	VolatilitySignal as NewVolatilitySignal,
	VolumeCoin as NewVolumeCoin
} from '@/hooks/signal-socket/types'
import { useSignalSocket } from '@/hooks/signal-socket/useSignalSocket'

import {
	checkHasAnyData,
	getUIConnectionStatus,
	isPersistentError
} from '@/utils/statusHelpers'

import styles from './Signal-table.module.scss'
import { ConnectionStatus } from './connection-status/ConnectionStatus'
import { NoDataIndicator } from './no-data-indicator/NoDataIndicator'
import { TimeframeSection } from './timeframe-section/TimeframeSection'
import { VolatilitySection } from './volatility-section/VolatilitySection'

/**
 * Adapter function to convert from new TimeframeCoin type to the old one
 */
const adaptTimeframeCoins = (
	coins: NewTimeframeCoin[] | any[]
): OldTimeframeCoin[] => {
	if (!coins || !Array.isArray(coins)) {
		console.log('⚠️ adaptTimeframeCoins received invalid data:', coins)
		return []
	}

	console.log('🔄 adaptTimeframeCoins processing:', coins)

	const result = coins.map(coin => {
		// Handle both possible structures (API sends data in different formats)
		const symbol = typeof coin.symbol === 'string' ? coin.symbol : ''
		let changeValue = '0'

		// Handle different ways the change data might be structured
		if (coin.changePercent !== undefined) {
			// Parse the value to ensure proper formatting
			const percentValue =
				typeof coin.changePercent === 'string'
					? parseFloat(coin.changePercent)
					: parseFloat(coin.changePercent.toString())

			// If it's a valid number and very small, it might be in decimal format
			// (i.e., 0.05 instead of 5%)
			if (!isNaN(percentValue) && Math.abs(percentValue) < 0.1) {
				changeValue = (percentValue * 100).toString()
			} else {
				changeValue = coin.changePercent.toString()
			}
		} else if (coin.change !== undefined) {
			// Parse the value to ensure proper formatting
			const changeVal =
				typeof coin.change === 'string'
					? parseFloat(coin.change)
					: parseFloat(coin.change.toString())

			// If it's a valid number and very small, it might be in decimal format
			if (!isNaN(changeVal) && Math.abs(changeVal) < 0.1) {
				changeValue = (changeVal * 100).toString()
			} else {
				changeValue =
					typeof coin.change === 'string' ? coin.change : coin.change.toString()
			}
		} else if (typeof coin === 'object' && coin !== null) {
			// Try to extract change from any property that might contain it
			const possibleChangeProps = [
				'change',
				'changePercent',
				'priceChangePercent'
			]
			for (const prop of possibleChangeProps) {
				if (prop in coin && coin[prop] !== undefined) {
					const val = coin[prop]
					// Handle numeric values
					if (typeof val === 'number') {
						// If very small, likely decimal format
						if (Math.abs(val) < 0.1) {
							changeValue = (val * 100).toString()
						} else {
							changeValue = val.toString()
						}
					}
					// Handle string values
					else if (typeof val === 'string') {
						const numVal = parseFloat(val)
						if (!isNaN(numVal) && Math.abs(numVal) < 0.1) {
							changeValue = (numVal * 100).toString()
						} else {
							changeValue = val
						}
					}
					// Handle other types
					else {
						changeValue = String(val)
					}
					break
				}
			}
		}

		// Ensure the value is set correctly
		const value =
			coin.price !== undefined
				? coin.price
				: typeof coin === 'object' && coin !== null && 'value' in coin
					? coin.value
					: 0

		// Debug log
		console.log(
			`📊 Timeframe coin ${symbol}: change=${changeValue}, price=${value}`
		)

		return {
			symbol,
			change: changeValue,
			value
		} as OldTimeframeCoin
	})

	console.log('✅ adaptTimeframeCoins result:', result)
	return result
}

/**
 * Adapter function to convert from new VolumeCoin type to the old TimeframeCoin type
 */
const adaptVolumeCoins = (
	coins: NewVolumeCoin[] | any[]
): OldTimeframeCoin[] => {
	if (!coins || !Array.isArray(coins)) {
		console.log('⚠️ adaptVolumeCoins received invalid data:', coins)
		return []
	}

	console.log('🔄 adaptVolumeCoins processing:', coins)

	const result = coins.map(coin => {
		// Handle both possible structures (API sends data in different formats)
		const symbol = typeof coin.symbol === 'string' ? coin.symbol : ''
		let changeValue = '0'

		// Try to find volume change value from any relevant property
		if (coin.volumeChangePercent !== undefined) {
			// Parse the value to ensure proper formatting
			const percentValue =
				typeof coin.volumeChangePercent === 'string'
					? parseFloat(coin.volumeChangePercent)
					: parseFloat(coin.volumeChangePercent.toString())

			// If it's a valid number and very small, it might be in decimal format
			if (!isNaN(percentValue) && Math.abs(percentValue) < 0.1) {
				changeValue = (percentValue * 100).toString()
			} else {
				changeValue = coin.volumeChangePercent.toString()
			}
		} else if (typeof coin === 'object' && coin !== null) {
			// Look for properties that might contain volume change information
			const possibleChangeProps = [
				'change',
				'volumeChange',
				'volumeChangePercent'
			]
			for (const prop of possibleChangeProps) {
				if (prop in coin && coin[prop] !== undefined) {
					const val = coin[prop]
					// Handle numeric values
					if (typeof val === 'number') {
						// If very small, likely decimal format
						if (Math.abs(val) < 0.1) {
							changeValue = (val * 100).toString()
						} else {
							changeValue = val.toString()
						}
					}
					// Handle string values
					else if (typeof val === 'string') {
						const numVal = parseFloat(val)
						if (!isNaN(numVal) && Math.abs(numVal) < 0.1) {
							changeValue = (numVal * 100).toString()
						} else {
							changeValue = val
						}
					}
					// Handle other types
					else {
						changeValue = String(val)
					}
					break
				}
			}
		}

		// Ensure the value is set correctly
		const value =
			coin.price !== undefined
				? coin.price
				: typeof coin === 'object' && coin !== null && 'value' in coin
					? coin.value
					: 0

		// Debug log
		console.log(
			`📊 Volume coin ${symbol}: change=${changeValue}, price=${value}`
		)

		return {
			symbol,
			change: changeValue,
			value
		} as OldTimeframeCoin
	})

	console.log('✅ adaptVolumeCoins result:', result)
	return result
}

/**
 * Adapter function to convert from new FundingCoin type to the old TimeframeCoin type
 */
const adaptFundingCoins = (
	coins: NewFundingCoin[] | any[]
): OldTimeframeCoin[] => {
	if (!coins || !Array.isArray(coins)) {
		console.log('⚠️ adaptFundingCoins received invalid data:', coins)
		return []
	}

	console.log('🔄 adaptFundingCoins processing:', coins)

	const result = coins.map(coin => {
		// Handle both possible structures (API sends data in different formats)
		const symbol = typeof coin.symbol === 'string' ? coin.symbol : ''

		// For funding coins, we need to extract the funding rate properly
		let fundingRateValue = '0'
		if (coin.fundingRate !== undefined) {
			// Convert to string and ensure it's in percentage format
			const rate =
				typeof coin.fundingRate === 'string'
					? parseFloat(coin.fundingRate)
					: parseFloat(coin.fundingRate.toString())

			// If it's small (likely in decimal format), multiply to get percentage
			if (Math.abs(rate) < 0.1) {
				fundingRateValue = (rate * 100).toString()
			} else {
				fundingRateValue = rate.toString()
			}
		} else if (typeof coin === 'object' && coin !== null) {
			// Try alternative properties that might contain funding rate
			const possibleRateProps = ['rate', 'fundingRate', 'change']
			for (const prop of possibleRateProps) {
				if (prop in coin && coin[prop] !== undefined) {
					let value = coin[prop]

					// Convert to numeric and ensure it's properly formatted
					if (typeof value === 'number') {
						// If it's small (likely in decimal format), multiply to get percentage
						if (Math.abs(value) < 0.1) {
							value = value * 100
						}
						fundingRateValue = value.toString()
					} else if (typeof value === 'string') {
						const numValue = parseFloat(value)
						if (!isNaN(numValue) && Math.abs(numValue) < 0.1) {
							fundingRateValue = (numValue * 100).toString()
						} else {
							fundingRateValue = value
						}
					}
					break
				}
			}
		}

		// Ensure the value is set correctly (original price)
		const value =
			coin.price !== undefined
				? coin.price
				: typeof coin === 'object' && coin !== null && 'value' in coin
					? coin.value
					: 0

		console.log(
			`📊 Funding coin ${symbol}: rate=${fundingRateValue}, price=${value}`
		)

		return {
			symbol,
			change: fundingRateValue,
			value
		} as OldTimeframeCoin
	})

	console.log('✅ adaptFundingCoins result:', result)
	return result
}

/**
 * Adapter function to convert from new VolatilitySignal to the old VolatilitySpikeSignal
 */
const adaptVolatilitySignals = (
	signals: NewVolatilitySignal[] | undefined
): VolatilitySpikeSignal[] => {
	if (!signals || !Array.isArray(signals)) return []

	return signals.map(signal => {
		// Базовый объект сигнала
		const baseSignal: VolatilitySpikeSignal = {
			type: signal.hasOwnProperty('range')
				? 'volatilityRange'
				: 'volatilitySpike',
			symbol: signal.symbol,
			interval: '1m',
			open: signal.price || 0,
			high: signal.price || 0,
			low: signal.price || 0,
			close: signal.price || 0,
			volatility: signal.volatility || 0,
			timestamp: signal.timestamp
		}

		// Для сигналов с полной информацией о свече
		if (
			signal.hasOwnProperty('open') ||
			signal.hasOwnProperty('high') ||
			signal.hasOwnProperty('low') ||
			signal.hasOwnProperty('close')
		) {
			baseSignal.open = (signal as any).open || signal.price || 0
			baseSignal.high = (signal as any).high || signal.price || 0
			baseSignal.low = (signal as any).low || signal.price || 0
			baseSignal.close = (signal as any).close || signal.price || 0
		}

		// Добавляем range и avgRange если они есть
		if (signal.hasOwnProperty('range')) {
			baseSignal.range = (signal as any).range
		}

		if (signal.hasOwnProperty('avgRange')) {
			baseSignal.avgRange = (signal as any).avgRange
		}

		return baseSignal
	})
}

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

	// Add debug printing for connection status and data
	useEffect(() => {
		console.log('SignalTable - Current connection status:', connectionStatus)
		console.log('SignalTable - Has any data:', hasAnyData())
		console.log('SignalTable - Data available:', {
			timeframe5MinData: signalData.timeframe5MinData,
			timeframe1hData: signalData.timeframe1hData,
			timeframe4hData: signalData.timeframe4hData,
			timeframe24hData: signalData.timeframe24hData,
			volatilitySignals: signalData.volatilitySignals?.length || 0,
			topGainers5min: signalData.topGainers5min?.length || 0,
			topLosers5min: signalData.topLosers5min?.length || 0
		})

		if (signalData.topGainers5min?.length) {
			console.log(
				'SignalTable - topGainers5min sample:',
				signalData.topGainers5min[0]
			)
		}

		if (signalData.topLosers5min?.length) {
			console.log(
				'SignalTable - topLosers5min sample:',
				signalData.topLosers5min[0]
			)
		}
	}, [connectionStatus, hasAnyData, signalData])

	// Check if we have data for each timeframe
	const has1hData = useMemo(
		() =>
			signalData.timeframe1hData &&
			(signalData.timeframe1hData.gainers?.length > 0 ||
				signalData.timeframe1hData.losers?.length > 0),
		[signalData.timeframe1hData]
	)

	const has4hData = useMemo(
		() =>
			signalData.timeframe4hData &&
			(signalData.timeframe4hData.gainers?.length > 0 ||
				signalData.timeframe4hData.losers?.length > 0),
		[signalData.timeframe4hData]
	)

	const has24hData = useMemo(
		() =>
			signalData.timeframe24hData &&
			(signalData.timeframe24hData.gainers?.length > 0 ||
				signalData.timeframe24hData.losers?.length > 0),
		[signalData.timeframe24hData]
	)

	// Adapt timeframe data for 5min
	const adaptedTimeframe5MinData = useMemo(() => {
		if (!signalData.timeframe5MinData) {
			console.log('⚠️ timeframe5MinData is missing in signalData')
			return null
		}

		console.log(
			'🔄 Processing timeframe5MinData:',
			signalData.timeframe5MinData
		)

		// Check if gainers and losers arrays exist
		if (!signalData.timeframe5MinData.gainers) {
			console.log('⚠️ No gainers array in timeframe5MinData')
		} else {
			console.log(
				'✅ Found gainers in timeframe5MinData:',
				signalData.timeframe5MinData.gainers
			)
		}

		if (!signalData.timeframe5MinData.losers) {
			console.log('⚠️ No losers array in timeframe5MinData')
		} else {
			console.log(
				'✅ Found losers in timeframe5MinData:',
				signalData.timeframe5MinData.losers
			)
		}

		const result = {
			gainers: adaptTimeframeCoins(signalData.timeframe5MinData.gainers),
			losers: adaptTimeframeCoins(signalData.timeframe5MinData.losers),
			volume: adaptVolumeCoins(signalData.timeframe5MinData.volume),
			funding: adaptFundingCoins(signalData.timeframe5MinData.funding)
		}

		console.log('🔄 Adapted 5min timeframe data:', result)
		return result
	}, [signalData.timeframe5MinData])

	// Adapt timeframe data for 1h, 4h, 24h
	const adaptedTimeframe1hData = useMemo(() => {
		if (!signalData.timeframe1hData) return null

		return {
			gainers: adaptTimeframeCoins(signalData.timeframe1hData.gainers),
			losers: adaptTimeframeCoins(signalData.timeframe1hData.losers)
		}
	}, [signalData.timeframe1hData])

	const adaptedTimeframe4hData = useMemo(() => {
		if (!signalData.timeframe4hData) return null

		return {
			gainers: adaptTimeframeCoins(signalData.timeframe4hData.gainers),
			losers: adaptTimeframeCoins(signalData.timeframe4hData.losers)
		}
	}, [signalData.timeframe4hData])

	const adaptedTimeframe24hData = useMemo(() => {
		if (!signalData.timeframe24hData) return null

		return {
			gainers: adaptTimeframeCoins(signalData.timeframe24hData.gainers),
			losers: adaptTimeframeCoins(signalData.timeframe24hData.losers)
		}
	}, [signalData.timeframe24hData])

	// Adapt volatility signals
	const adaptedVolatilitySignals = useMemo(() => {
		return adaptVolatilitySignals(signalData.volatilitySignals)
	}, [signalData.volatilitySignals])

	// Filter volatility signals by type
	const volatilitySpikes = useMemo(() => {
		return adaptedVolatilitySignals.filter(
			signal =>
				signal.type === 'volatilitySpike' || !signal.hasOwnProperty('range')
		)
	}, [adaptedVolatilitySignals])

	const volatilityRanges = useMemo(() => {
		// Use explicit volatilityRanges if available in signalData
		if ((signalData as any)?.volatilityRanges?.length > 0) {
			return (signalData as any).volatilityRanges
		}
		// Or filter from adapted signals
		return adaptedVolatilitySignals.filter(
			signal =>
				signal.type === 'volatilityRange' ||
				(signal.hasOwnProperty('range') && signal.hasOwnProperty('avgRange'))
		)
	}, [adaptedVolatilitySignals, signalData])

	// Log volatility signals for debugging
	useEffect(() => {
		console.log('VolatilitySpikes available:', volatilitySpikes?.length || 0)
		console.log('VolatilityRanges available:', volatilityRanges?.length || 0)
	}, [volatilitySpikes, volatilityRanges])

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
				gainers={
					(signalData.topGainers5min && Array.isArray(signalData.topGainers5min)
						? adaptTimeframeCoins(signalData.topGainers5min)
						: null) ||
					adaptedTimeframe5MinData?.gainers ||
					[]
				}
				losers={
					(signalData.topLosers5min && Array.isArray(signalData.topLosers5min)
						? adaptTimeframeCoins(signalData.topLosers5min)
						: null) ||
					adaptedTimeframe5MinData?.losers ||
					[]
				}
				volume={
					(signalData.topVolume5min && Array.isArray(signalData.topVolume5min)
						? adaptTimeframeCoins(signalData.topVolume5min)
						: null) ||
					adaptedTimeframe5MinData?.volume ||
					[]
				}
				funding={
					(signalData.topFunding5min && Array.isArray(signalData.topFunding5min)
						? adaptTimeframeCoins(signalData.topFunding5min)
						: null) ||
					adaptedTimeframe5MinData?.funding ||
					[]
				}
				timeframe='5мин'
			/>

			{/* 1h Timeframe section */}
			{has1hData && (
				<>
					<h2 className={styles.subSectionTitle}>
						Монеты с изменениями, интервал 1ч
					</h2>
					<TimeframeSection
						gainers={adaptedTimeframe1hData?.gainers || []}
						losers={adaptedTimeframe1hData?.losers || []}
						volume={[]}
						funding={[]}
						timeframe='1ч'
					/>
				</>
			)}

			{/* 4h Timeframe section */}
			{has4hData && (
				<>
					<h2 className={styles.subSectionTitle}>
						Монеты с изменениями, интервал 4ч
					</h2>
					<TimeframeSection
						gainers={adaptedTimeframe4hData?.gainers || []}
						losers={adaptedTimeframe4hData?.losers || []}
						volume={[]}
						funding={[]}
						timeframe='4ч'
					/>
				</>
			)}

			{/* 24h Timeframe section */}
			{has24hData && (
				<>
					<h2 className={styles.subSectionTitle}>
						Монеты с изменениями, интервал 24ч
					</h2>
					<TimeframeSection
						gainers={adaptedTimeframe24hData?.gainers || []}
						losers={adaptedTimeframe24hData?.losers || []}
						volume={[]}
						funding={[]}
						timeframe='24ч'
					/>
				</>
			)}

			{/* Volatility section */}
			<VolatilitySection
				volatilitySpikes={
					volatilitySpikes || (signalData as any)?.volatilitySpikes || []
				}
				volatilityRanges={
					volatilityRanges || (signalData as any)?.volatilityRanges || []
				}
			/>

			{/* Additional content section - currently commented out */}
			<div className={styles.contentSection}>
				{/* Commented components are preserved from original code but not rendered
					Enable these sections as needed */}
			</div>
		</div>
	)
})
