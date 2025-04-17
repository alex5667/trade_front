'use client'

import { useEffect, useState } from 'react'

import { useSignalSocket } from '@/hooks/useSignalSocket'

import { PriceChangeTable } from './PriceChangeTable'
import { TabSelector } from './TabSelector'
import { TopCoinsTable } from './TopCoinsTable'
import { VolatilityTable } from './VolatilityTable'
import { VolumeSpikeTable } from './VolumeSpikeTable'

type TabType =
	| 'volatility'
	| 'volume'
	| 'priceChange'
	| 'topGainers'
	| 'topLosers'
	| 'volatilityRanges'

export function SignalTable() {
	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'error'
	>('connecting')
	const [activeTab, setActiveTab] = useState<TabType>('volatility')

	const signalData = useSignalSocket()

	useEffect(() => {
		const checkConnection = () => {
			if (
				signalData?.volatilitySpikes?.length > 0 ||
				signalData?.topGainers?.length > 0 ||
				signalData?.topLosers?.length > 0 ||
				signalData?.volumeSpikes?.length > 0 ||
				signalData?.priceChanges?.length > 0 ||
				signalData?.volatilityRanges?.length > 0
			) {
				setConnectionStatus('connected')
			} else {
				// After 5 seconds, if still no signals, show connected anyway
				setTimeout(() => {
					setConnectionStatus('connected')
				}, 5000)
			}
		}

		window.addEventListener('load', () => {
			console.log('Window loaded, checking connection')
			checkConnection()
		})

		// In case window is already loaded
		checkConnection()

		return () => {
			window.removeEventListener('load', checkConnection)
		}
	}, [signalData])

	const renderActiveTab = () => {
		switch (activeTab) {
			case 'volatility':
				return (
					<VolatilityTable
						signals={signalData?.volatilitySpikes || []}
						title='Волатильность'
					/>
				)
			case 'volatilityRanges':
				return (
					<VolatilityTable
						signals={signalData?.volatilityRanges || []}
						title='Волатильность в диапазоне'
					/>
				)
			case 'volume':
				return <VolumeSpikeTable signals={signalData?.volumeSpikes || []} />
			case 'priceChange':
				return <PriceChangeTable signals={signalData?.priceChanges || []} />
			case 'topGainers':
				return (
					<TopCoinsTable
						coins={signalData?.topGainers || []}
						title='растущих монетах'
						isGainer={true}
					/>
				)
			case 'topLosers':
				return (
					<TopCoinsTable
						coins={signalData?.topLosers || []}
						title='падающих монетах'
						isGainer={false}
					/>
				)
			default:
				return <VolatilityTable signals={signalData?.volatilitySpikes || []} />
		}
	}

	return (
		<div className='p-4'>
			<h2 className='text-xl font-bold mb-2'>🔥 Сигналы в реальном времени</h2>

			{connectionStatus === 'connecting' && (
				<p className='text-yellow-500 mb-2'>
					Подключение к серверу сигналов...
				</p>
			)}

			{connectionStatus === 'error' && (
				<p className='text-red-500 mb-2'>
					Ошибка подключения к серверу сигналов
				</p>
			)}

			<TabSelector
				activeTab={activeTab}
				onChange={setActiveTab}
			/>

			{renderActiveTab()}
		</div>
	)
}
