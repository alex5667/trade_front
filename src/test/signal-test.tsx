'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SignalSocketInitializer } from '@/components/signal-table/SignalSocketInitializer'

import { TypeRootState } from '@/store/store'

import { runApiTestSuite, testApiHealth } from './api-test'
import { startMockSignalGenerator } from './mock-signal-generator'
import { testDataConsistency, testWebSocketClient } from './websocket-test'
import { getWebSocketClient } from '@/services/websocket.service'

// Test component to verify signal processing
export default function SignalTest() {
	const dispatch = useDispatch()
	const [connectionStatus, setConnectionStatus] = useState('disconnected')
	const [mockActive, setMockActive] = useState(false)
	const [mockCleanup, setMockCleanup] = useState<(() => void) | null>(null)
	const [wsTestActive, setWsTestActive] = useState(false)
	const [wsTestCleanup, setWsTestCleanup] = useState<(() => void) | null>(null)
	const [consistencyTestActive, setConsistencyTestActive] = useState(false)
	const [consistencyTestCleanup, setConsistencyTestCleanup] = useState<
		(() => void) | null
	>(null)
	const [apiTestResults, setApiTestResults] = useState<any>(null)
	const [apiTestRunning, setApiTestRunning] = useState(false)

	// Select data from Redux store
	const volatilitySignals = useSelector(
		(state: TypeRootState) => state.volatility?.signals || []
	)
	const volumeSignals = useSelector(
		(state: TypeRootState) => state.volume?.signals || []
	)
	const priceChangeSignals = useSelector(
		(state: TypeRootState) => state.priceChange?.signals || []
	)
	const topGainers5min = useSelector(
		(state: TypeRootState) => state.timeframe?.['5min']?.gainers || []
	)
	const topLosers5min = useSelector(
		(state: TypeRootState) => state.timeframe?.['5min']?.losers || []
	)

	// Check connection manually
	useEffect(() => {
		const client = getWebSocketClient()
		const isConnected = client.isActive()
		setConnectionStatus(isConnected ? 'connected' : 'disconnected')

		const checkConnection = setInterval(() => {
			const isActive = client.isActive()
			setConnectionStatus(isActive ? 'connected' : 'disconnected')
		}, 5000)

		// Run API health check on load
		const checkApiHealth = async () => {
			const health = await testApiHealth()
			setApiTestResults({ health })
		}

		checkApiHealth()

		return () => {
			clearInterval(checkConnection)
			// Clean up mock generator if active
			if (mockCleanup) {
				mockCleanup()
			}
			// Clean up WebSocket test if active
			if (wsTestCleanup) {
				wsTestCleanup()
			}
			// Clean up consistency test if active
			if (consistencyTestCleanup) {
				consistencyTestCleanup()
			}
		}
	}, [mockCleanup, wsTestCleanup, consistencyTestCleanup])

	// Toggle mock signal generator
	const handleToggleMock = () => {
		if (mockActive && mockCleanup) {
			// Stop mock generator
			mockCleanup()
			setMockCleanup(null)
			setMockActive(false)
		} else {
			// Start mock generator
			const cleanup = startMockSignalGenerator()
			setMockCleanup(() => cleanup)
			setMockActive(true)
		}
	}

	// Toggle WebSocket test
	const handleToggleWsTest = () => {
		if (wsTestActive && wsTestCleanup) {
			// Stop WebSocket test
			wsTestCleanup()
			setWsTestCleanup(null)
			setWsTestActive(false)
		} else {
			// Start WebSocket test
			const cleanup = testWebSocketClient()
			setWsTestCleanup(() => cleanup)
			setWsTestActive(true)
		}
	}

	// Toggle consistency test
	const handleToggleConsistencyTest = () => {
		if (consistencyTestActive && consistencyTestCleanup) {
			// Stop consistency test
			consistencyTestCleanup()
			setConsistencyTestCleanup(null)
			setConsistencyTestActive(false)
		} else {
			// Start consistency test
			const cleanup = testDataConsistency()
			setConsistencyTestCleanup(() => cleanup)
			setConsistencyTestActive(true)
		}
	}

	// Run API test suite
	const handleRunApiTest = async () => {
		setApiTestRunning(true)
		setApiTestResults(null)

		try {
			const results = await runApiTestSuite()
			setApiTestResults(results)
		} catch (error) {
			setApiTestResults({
				overallStatus: 'error',
				error: error instanceof Error ? error.message : 'Unknown error'
			})
		} finally {
			setApiTestRunning(false)
		}
	}

	return (
		<div className='p-8'>
			<h1 className='text-2xl font-bold mb-6'>Signal Test Panel</h1>

			{/* Socket initializer component */}
			<SignalSocketInitializer />

			{/* Test controls */}
			<div className='mb-6'>
				<h2 className='text-xl font-semibold mb-2'>Test Controls</h2>
				<div className='flex flex-wrap items-center gap-4'>
					<button
						onClick={handleToggleMock}
						className={`px-4 py-2 rounded font-medium ${
							mockActive
								? 'bg-red-500 hover:bg-red-600 text-white'
								: 'bg-green-500 hover:bg-green-600 text-white'
						}`}
					>
						{mockActive ? 'Stop Mock Generator' : 'Start Mock Generator'}
					</button>
					{mockActive && (
						<span className='text-green-500 animate-pulse'>
							● Mock signals active
						</span>
					)}

					<button
						onClick={handleToggleWsTest}
						className={`px-4 py-2 rounded font-medium ${
							wsTestActive
								? 'bg-red-500 hover:bg-red-600 text-white'
								: 'bg-blue-500 hover:bg-blue-600 text-white'
						}`}
					>
						{wsTestActive ? 'Stop WebSocket Test' : 'Start WebSocket Test'}
					</button>
					{wsTestActive && (
						<span className='text-blue-500 animate-pulse'>
							● WebSocket test active
						</span>
					)}

					<button
						onClick={handleToggleConsistencyTest}
						className={`px-4 py-2 rounded font-medium ${
							consistencyTestActive
								? 'bg-red-500 hover:bg-red-600 text-white'
								: 'bg-purple-500 hover:bg-purple-600 text-white'
						}`}
					>
						{consistencyTestActive
							? 'Stop Consistency Test'
							: 'Start Consistency Test'}
					</button>
					{consistencyTestActive && (
						<span className='text-purple-500 animate-pulse'>
							● Consistency test active
						</span>
					)}

					<button
						onClick={handleRunApiTest}
						disabled={apiTestRunning}
						className={`px-4 py-2 rounded font-medium ${
							apiTestRunning
								? 'bg-gray-400 cursor-not-allowed text-white'
								: 'bg-yellow-500 hover:bg-yellow-600 text-white'
						}`}
					>
						{apiTestRunning ? 'API Test Running...' : 'Run API Tests'}
					</button>
				</div>
			</div>

			{/* Connection status */}
			<div className='mb-6'>
				<h2 className='text-xl font-semibold mb-2'>Connection Status</h2>
				<div
					className={`p-4 rounded ${connectionStatus === 'connected' || mockActive ? 'bg-green-100' : 'bg-red-100'}`}
				>
					{connectionStatus === 'connected' || mockActive
						? '✅ Connected'
						: '❌ Disconnected'}
					{mockActive && ' (Using mock data)'}
				</div>
			</div>

			{/* API Test Results */}
			{apiTestResults && (
				<div className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>API Test Results</h2>
					<div
						className={`p-4 rounded ${
							apiTestResults.overallStatus === 'success'
								? 'bg-green-100'
								: apiTestResults.overallStatus === 'partial'
									? 'bg-yellow-100'
									: 'bg-red-100'
						}`}
					>
						<div className='font-bold mb-2'>
							Status:{' '}
							{apiTestResults.overallStatus === 'success'
								? '✅ Success'
								: apiTestResults.overallStatus === 'partial'
									? '⚠️ Partial Success'
									: '❌ Failed'}
						</div>

						{apiTestResults.health && (
							<div className='mb-2'>
								<div className='font-semibold'>Health Check:</div>
								<div
									className={
										apiTestResults.health.status === 'success'
											? 'text-green-600'
											: 'text-red-600'
									}
								>
									{apiTestResults.health.status === 'success' ? '✅ ' : '❌ '}
									{apiTestResults.health.message}
								</div>
							</div>
						)}

						{apiTestResults.auth && (
							<div className='mb-2'>
								<div className='font-semibold'>Authentication:</div>
								<div
									className={
										apiTestResults.auth.status === 'success'
											? 'text-green-600'
											: 'text-red-600'
									}
								>
									{apiTestResults.auth.status === 'success'
										? '✅ Success'
										: '❌ Failed'}
									{apiTestResults.auth.error &&
										`: ${apiTestResults.auth.error}`}
								</div>
							</div>
						)}

						{apiTestResults.marketData && (
							<div>
								<div className='font-semibold'>Market Data API:</div>
								<div
									className={
										apiTestResults.marketData.errors.length === 0
											? 'text-green-600'
											: 'text-yellow-600'
									}
								>
									{apiTestResults.marketData.errors.length === 0
										? '✅ All endpoints successful'
										: `⚠️ ${apiTestResults.marketData.errors.length} endpoints failed`}
								</div>

								{apiTestResults.marketData.errors.length > 0 && (
									<div className='mt-2 text-sm'>
										<div className='font-semibold'>Errors:</div>
										<ul className='list-disc pl-5'>
											{apiTestResults.marketData.errors.map(
												(error: any, index: number) => (
													<li key={index}>
														{error.name} ({error.path}): {error.error}
													</li>
												)
											)}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Data verification section */}
			<div className='grid grid-cols-2 gap-6'>
				{/* Volatility signals */}
				<div className='border p-4 rounded'>
					<h2 className='text-lg font-semibold mb-2'>Volatility Signals</h2>
					<p>Count: {volatilitySignals.length}</p>
					<div className='mt-2 max-h-40 overflow-y-auto'>
						{volatilitySignals.slice(0, 5).map((signal, index) => (
							<div
								key={index}
								className='text-xs p-2 bg-gray-50 mb-1'
							>
								{signal.symbol}: {signal.volatility?.toFixed(2)} (
								{new Date(signal.timestamp).toLocaleTimeString()})
							</div>
						))}
					</div>
				</div>

				{/* Volume signals */}
				<div className='border p-4 rounded'>
					<h2 className='text-lg font-semibold mb-2'>Volume Signals</h2>
					<p>Count: {volumeSignals.length}</p>
					<div className='mt-2 max-h-40 overflow-y-auto'>
						{volumeSignals.slice(0, 5).map((signal, index) => (
							<div
								key={index}
								className='text-xs p-2 bg-gray-50 mb-1'
							>
								{signal.symbol}: {signal.volume?.toLocaleString()} (
								{new Date(signal.timestamp).toLocaleTimeString()})
							</div>
						))}
					</div>
				</div>

				{/* Price change signals */}
				<div className='border p-4 rounded'>
					<h2 className='text-lg font-semibold mb-2'>Price Change Signals</h2>
					<p>Count: {priceChangeSignals.length}</p>
					<div className='mt-2 max-h-40 overflow-y-auto'>
						{priceChangeSignals.slice(0, 5).map((signal, index) => (
							<div
								key={index}
								className='text-xs p-2 bg-gray-50 mb-1'
							>
								{signal.symbol}: {signal.priceChangePercent?.toFixed(2)}% (
								{new Date(signal.timestamp).toLocaleTimeString()})
							</div>
						))}
					</div>
				</div>

				{/* Top gainers 5min */}
				<div className='border p-4 rounded'>
					<h2 className='text-lg font-semibold mb-2'>Top Gainers (5min)</h2>
					<p>Count: {topGainers5min.length}</p>
					<div className='mt-2 max-h-40 overflow-y-auto'>
						{topGainers5min.slice(0, 5).map((coin, index) => (
							<div
								key={index}
								className='text-xs p-2 bg-gray-50 mb-1'
							>
								{coin.symbol}: {coin.percentChange?.toFixed(2)}% (
								{new Date(coin.timestamp).toLocaleTimeString()})
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Data consistency check */}
			<div className='mt-6 p-4 bg-blue-50 rounded'>
				<h2 className='text-lg font-semibold mb-2'>Data Consistency Check</h2>
				<ul className='list-disc pl-5'>
					<li>
						Volatility Signals:{' '}
						{volatilitySignals.length > 0 ? '✅ Data present' : '❌ No data'}
					</li>
					<li>
						Volume Signals:{' '}
						{volumeSignals.length > 0 ? '✅ Data present' : '❌ No data'}
					</li>
					<li>
						Price Change Signals:{' '}
						{priceChangeSignals.length > 0 ? '✅ Data present' : '❌ No data'}
					</li>
					<li>
						Top Gainers 5min:{' '}
						{topGainers5min.length > 0 ? '✅ Data present' : '❌ No data'}
					</li>
					<li>
						Top Losers 5min:{' '}
						{topLosers5min.length > 0 ? '✅ Data present' : '❌ No data'}
					</li>
				</ul>
			</div>
		</div>
	)
}
