'use client'

import { VolumeSpikeSignal } from '@/types/signal.types'

interface VolumeSpikeTableProps {
	signals: VolumeSpikeSignal[]
}

export function VolumeSpikeTable({ signals }: VolumeSpikeTableProps) {
	return (
		<div className='overflow-x-auto'>
			<table className='w-full text-sm border'>
				<thead>
					<tr className='bg-gray-100 dark:bg-gray-800'>
						<th className='p-2 border'>Монета</th>
						<th className='p-2 border'>Интервал</th>
						<th className='p-2 border'>Объем</th>
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
								<td className='p-2 border text-purple-600 font-bold'>
									{signal.volume}
								</td>
								<td className='p-2 border'>
									{new Date(signal.timestamp).toLocaleTimeString()}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={4}
								className='p-4 text-center'
							>
								Ожидание сигналов объема...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
