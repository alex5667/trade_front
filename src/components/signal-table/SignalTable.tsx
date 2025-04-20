'use client'

import { useSignalSocket } from '@/hooks/useSignalSocket'

import { TimeframeCoinsTable } from './TimeframeCoinsTable'
import { VolatilityTable } from './VolatilityTable'

export function SignalTable() {
	const signalData = useSignalSocket()
	const socketConnectionStatus = signalData.connectionStatus

	// Convert socket status to UI-friendly status
	const getUIConnectionStatus = (): {
		status: 'connecting' | 'connected' | 'error' | 'reconnecting'
		message: string
	} => {
		if (socketConnectionStatus === 'connected') {
			return { status: 'connected', message: '' }
		}

		if (socketConnectionStatus.startsWith('reconnecting')) {
			return {
				status: 'reconnecting',
				message: 'Попытка переподключения к серверу сигналов...'
			}
		}

		if (
			socketConnectionStatus.startsWith('error') ||
			socketConnectionStatus === 'max_retries_reached' ||
			socketConnectionStatus === 'reconnect_failed'
		) {
			return {
				status: 'error',
				message:
					'Ошибка подключения к серверу сигналов. Пожалуйста, проверьте соединение или обновите страницу.'
			}
		}

		return {
			status: 'connecting',
			message: 'Подключение к серверу сигналов...'
		}
	}

	const { status, message } = getUIConnectionStatus()

	// Is this a persistent connection error?
	const isPersistentError =
		socketConnectionStatus === 'max_retries_reached' ||
		socketConnectionStatus === 'reconnect_failed' ||
		socketConnectionStatus.includes('websocket error')

	// Check if any data is available
	const hasAnyData = () => {
		return (
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
			signalData?.triggerLosers24h?.length > 0 ||
			signalData?.topGainers1h?.length > 0 ||
			signalData?.topLosers1h?.length > 0 ||
			signalData?.topGainers4h?.length > 0 ||
			signalData?.topLosers4h?.length > 0 ||
			signalData?.topGainers24h?.length > 0 ||
			signalData?.topLosers24h?.length > 0
		)
	}

	return (
		<div className='p-4 w-full h-full overflow-y-auto max-h-screen'>
			<h2 className='text-xl font-bold mb-2 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10'>
				🔥 Сигналы в реальном времени
			</h2>

			{status === 'connecting' && (
				<p className='text-yellow-500 mb-4 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800'>
					<span className='inline-block w-2 h-2 mr-2 bg-yellow-500 rounded-full animate-pulse'></span>
					{message}
				</p>
			)}

			{status === 'reconnecting' && (
				<p className='text-blue-500 mb-4 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800'>
					<span className='inline-block w-2 h-2 mr-2 bg-blue-500 rounded-full animate-pulse'></span>
					{message}
				</p>
			)}

			{status === 'error' && (
				<div className='mb-4'>
					<p className='text-red-500 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800'>
						<span className='inline-block w-2 h-2 mr-2 bg-red-500 rounded-full'></span>
						{message}
						<button
							onClick={() => window.location.reload()}
							className='ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700'
						>
							Обновить
						</button>
					</p>

					{isPersistentError && (
						<div className='mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700'>
							<h3 className='font-medium mb-1'>Возможные причины ошибки:</h3>
							<ul className='text-sm list-disc pl-5 space-y-1'>
								<li>Блокировка WebSocket соединений на вашей сети</li>
								<li>Прокси-сервер или брандмауэр блокирует соединение</li>
								<li>Временные проблемы с сервером</li>
							</ul>
							<div className='mt-2'>
								<p className='text-sm mb-2'>Попробуйте следующие решения:</p>
								<div className='flex flex-wrap gap-2'>
									<button
										onClick={() => {
											// Try connecting with HTTP polling only
											window.location.search = '?transport=polling'
											window.location.reload()
										}}
										className='px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700'
									>
										Использовать HTTP-соединение
									</button>
									<button
										onClick={() => window.location.reload()}
										className='px-3 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-700'
									>
										Переподключиться
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			{!hasAnyData() && status !== 'error' && (
				<p className='text-gray-500 mb-4 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700'>
					<span className='inline-block w-2 h-2 mr-2 bg-gray-400 rounded-full animate-pulse'></span>
					Ожидание данных сигналов...
				</p>
			)}
			<section>
				<h2 className='text-lg font-bold mt-8 mb-4'>
					Монеты с изменениями по фьючам 24ч интервал 5м
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TimeframeCoinsTable
						coins={signalData?.topGainers5min || []}
						title='растущих монет (5мин)'
						timeframe='5мин'
						isGainer={true}
					/>

					<TimeframeCoinsTable
						coins={signalData?.topLosers5min || []}
						title='падающих монет (5мин)'
						timeframe='5мин'
						isGainer={false}
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TimeframeCoinsTable
						coins={signalData?.topVolume5min || []}
						title='объемных монет (5мин)'
						timeframe='5мин'
						isGainer={true}
						isVolume={true}
					/>

					<TimeframeCoinsTable
						coins={signalData?.topFunding5min || []}
						title='фандинг (5мин)'
						timeframe='5мин'
						isGainer={true}
						isFunding={true}
					/>
				</div>
			</section>
			<section>
				<VolatilityTable
					signals={signalData?.volatilitySpikes || []}
					title='Волатильность по свече 1м(фильтр 0.8)'
				/>

				<VolatilityTable
					signals={signalData?.volatilityRanges || []}
					title='Волатильность в диапазоне 30мин'
				/>
			</section>
			<div className='space-y-6 pb-8'>
				{/* <VolumeSpikeTable signals={signalData?.volumeSpikes || []} />

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
				/> */}

				{/* Timeframe-specific top coins with change values */}
				{/* <h2 className='text-lg font-bold mt-8 mb-4'>
					Монеты по таймфреймам с изменениями по споту
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TimeframeCoinsTable
						coins={signalData?.topGainers1h || []}
						title='растущих монет (1ч)'
						timeframe='1ч'
						isGainer={true}
					/>

					<TimeframeCoinsTable
						coins={signalData?.topLosers1h || []}
						title='падающих монет (1ч)'
						timeframe='1ч'
						isGainer={false}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TimeframeCoinsTable
						coins={signalData?.topGainers4h || []}
						title='растущих монет (4ч)'
						timeframe='4ч'
						isGainer={true}
					/>

					<TimeframeCoinsTable
						coins={signalData?.topLosers4h || []}
						title='падающих монет (4ч)'
						timeframe='4ч'
						isGainer={false}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<TimeframeCoinsTable
						coins={signalData?.topGainers24h || []}
						title='растущих монет (24ч)'
						timeframe='24ч'
						isGainer={true}
					/>

					<TimeframeCoinsTable
						coins={signalData?.topLosers24h || []}
						title='падающих монет (24ч)'
						timeframe='24ч'
						isGainer={false}
					/>
				</div> */}

				{/* Trigger coins tables */}
				{/* <h2 className='text-lg font-bold mt-8 mb-4'>Триггеры по таймфреймам</h2>
				
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
				</div> */}
			</div>
		</div>
	)
}
