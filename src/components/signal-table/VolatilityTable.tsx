'use client'

import { VolatilitySpikeSignal } from '@/types/signal.types'

interface VolatilityTableProps {
	signals: VolatilitySpikeSignal[]
	title?: string
}

export function VolatilityTable({
	signals,
	title = 'Волатильность'
}: VolatilityTableProps) {
	return (
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
						{signals.length > 0 && signals[0].range !== undefined && (
							<th className='p-2 border'>Диапазон</th>
						)}
						{signals.length > 0 && signals[0].avgRange !== undefined && (
							<th className='p-2 border'>Ср. диапазон</th>
						)}
						<th className='p-2 border'>Время</th>
					</tr>
				</thead>
				<tbody>
					{signals.length > 0 ? (
						signals.map((signal, idx) => {
							// Extract timestamp
							const date = new Date(signal.timestamp)
							const timeString = date.toLocaleTimeString()

							return (
								<tr
									key={idx}
									className='hover:bg-gray-50 dark:hover:bg-gray-700'
								>
									<td className='p-2 border'>{signal.symbol}</td>
									<td className='p-2 border'>{signal.interval}</td>
									<td className='p-2 border'>{signal.open}</td>
									<td className='p-2 border'>{signal.high}</td>
									<td className='p-2 border'>{signal.low}</td>
									<td className='p-2 border'>{signal.close}</td>
									<td className='p-2 border text-red-600 font-bold'>
										{signal.volatility}%
									</td>
									{signal.range !== undefined && (
										<td className='p-2 border'>{signal.range}</td>
									)}
									{signal.avgRange !== undefined && (
										<td className='p-2 border'>{signal.avgRange}</td>
									)}
									<td className='p-2 border'>{timeString}</td>
								</tr>
							)
						})
					) : (
						<tr>
							<td
								colSpan={7}
								className='p-4 text-center'
							>
								Ожидание сигналов {title.toLowerCase()}...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
