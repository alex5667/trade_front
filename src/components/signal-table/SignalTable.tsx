'use client'

import { useEffect, useState } from 'react'

import { useSignalSocket } from '@/hooks/useSignalSocket'

import { PriceChangeTable } from './PriceChangeTable'
import { TopCoinsTable } from './TopCoinsTable'
import { TriggerCoinsTable } from './TriggerCoinsTable'
import { VolatilityTable } from './VolatilityTable'
import { VolumeSpikeTable } from './VolumeSpikeTable'

export function SignalTable() {
	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'error'
	>('connecting')

	const signalData = useSignalSocket()

	useEffect(() => {
		const checkConnection = () => {
			if (
				signalData?.volatilitySpikes?.length > 0 ||
				signalData?.topGainers?.length > 0 ||
				signalData?.topLosers?.length > 0 ||
				signalData?.volumeSpikes?.length > 0 ||
				signalData?.priceChanges?.length > 0 ||
				signalData?.volatilityRanges?.length > 0 ||
				signalData?.triggerGainers1h?.length > 0 ||
				signalData?.triggerLosers1h?.length > 0 ||
				signalData?.triggerGainers4h?.length > 0 ||
				signalData?.triggerLosers4h?.length > 0 ||
				signalData?.triggerGainers24h?.length > 0 ||
				signalData?.triggerLosers24h?.length > 0
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

			<div className='space-y-6'>
				<VolatilityTable
					signals={signalData?.volatilitySpikes || []}
					title='Волатильность'
				/>

				<VolatilityTable
					signals={signalData?.volatilityRanges || []}
					title='Волатильность в диапазоне'
				/>

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

				{/* Trigger coins tables */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TriggerCoinsTable
						coins={signalData?.triggerGainers1h || []}
						title='триггера для растущих монет (1ч)'
						timeframe='1ч'
						isGainer={true}
					/>

					<TriggerCoinsTable
						coins={signalData?.triggerLosers1h || []}
						title='триггера для падающих монет (1ч)'
						timeframe='1ч'
						isGainer={false}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TriggerCoinsTable
						coins={signalData?.triggerGainers4h || []}
						title='триггера для растущих монет (4ч)'
						timeframe='4ч'
						isGainer={true}
					/>

					<TriggerCoinsTable
						coins={signalData?.triggerLosers4h || []}
						title='триггера для падающих монет (4ч)'
						timeframe='4ч'
						isGainer={false}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TriggerCoinsTable
						coins={signalData?.triggerGainers24h || []}
						title='триггера для растущих монет (24ч)'
						timeframe='24ч'
						isGainer={true}
					/>

					<TriggerCoinsTable
						coins={signalData?.triggerLosers24h || []}
						title='триггера для падающих монет (24ч)'
						timeframe='24ч'
						isGainer={false}
					/>
				</div>
			</div>
		</div>
	)
}
