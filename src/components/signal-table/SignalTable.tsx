'use client'

import { useEffect, useState } from 'react'

import { useSignalSocket } from '@/hooks/useSignalSocket'

export function SignalTable() {
	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'error'
	>('connecting')
	const signals = useSignalSocket()

	useEffect(() => {
		const checkConnection = () => {
			if (signals.length > 0) {
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
	}, [signals])

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

			<div className='overflow-x-auto'>
				<table className='w-full text-sm border'>
					<thead>
						<tr className='bg-gray-100 dark:bg-gray-800'>
							<th className='p-2 border'>Монета</th>
							<th className='p-2 border'>Интервал</th>
							<th className='p-2 border'>Открытие</th>
							<th className='p-2 border'>Макс</th>
							<th className='p-2 border'>Мин</th>
							<th className='p-2 border'>Закрытие</th>
							<th className='p-2 border'>Волатильность</th>
						</tr>
					</thead>
					<tbody>
						{signals.length > 0 ? (
							signals.map((signal, idx) => {
								// Check signal format and handle accordingly
								const k = signal.k || signal

								if (!k) {
									console.error('Invalid signal format:', signal)
									return null
								}

								// Calculate volatility
								const vol = (
									((parseFloat(k.h) - parseFloat(k.l)) / parseFloat(k.o)) *
									100
								).toFixed(2)

								return (
									<tr
										key={idx}
										className='hover:bg-gray-50 dark:hover:bg-gray-700'
									>
										<td className='p-2 border'>{k.s}</td>
										<td className='p-2 border'>{k.i}</td>
										<td className='p-2 border'>{k.o}</td>
										<td className='p-2 border'>{k.h}</td>
										<td className='p-2 border'>{k.l}</td>
										<td className='p-2 border'>{k.c}</td>
										<td className='p-2 border text-red-600 font-bold'>
											{vol}%
										</td>
									</tr>
								)
							})
						) : (
							<tr>
								<td
									colSpan={7}
									className='p-4 text-center'
								>
									Ожидание сигналов... (проверьте что сервер запущен на{' '}
									{process.env.NEXT_PUBLIC_SOCKET_URL ||
										'http://localhost:4200'}
									)
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
