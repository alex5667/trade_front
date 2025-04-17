'use client'

import { PriceChangeSignal } from '@/types/signal.types'

interface PriceChangeTableProps {
	signals: PriceChangeSignal[]
}

export function PriceChangeTable({ signals }: PriceChangeTableProps) {
	return (
		<div className='overflow-x-auto'>
			<table className='w-full text-sm border'>
				<thead>
					<tr className='bg-gray-100 dark:bg-gray-800'>
						<th className='p-2 border'>Монета</th>
						<th className='p-2 border'>Интервал</th>
						<th className='p-2 border'>Изменение цены</th>
						<th className='p-2 border'>Процент</th>
						<th className='p-2 border'>Время</th>
					</tr>
				</thead>
				<tbody>
					{signals.length > 0 ? (
						signals.map((signal, idx) => (
							<tr
								key={idx}
								className='hover:bg-gray-50 dark:hover:bg-gray-700'
							>
								<td className='p-2 border'>{signal.symbol}</td>
								<td className='p-2 border'>{signal.interval}</td>
								<td className='p-2 border'>{signal.priceChange}</td>
								<td
									className={`p-2 border font-bold ${signal.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
								>
									{signal.priceChangePercent >= 0 ? '+' : ''}
									{signal.priceChangePercent}%
								</td>
								<td className='p-2 border'>
									{new Date(signal.timestamp).toLocaleTimeString()}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={5}
								className='p-4 text-center'
							>
								Ожидание сигналов изменения цены...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
