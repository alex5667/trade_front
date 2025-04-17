'use client'

import { TopCoin } from '@/types/signal.types'

interface TopCoinsTableProps {
	coins: TopCoin[]
	title: string
	isGainer?: boolean
}

export function TopCoinsTable({
	coins,
	title,
	isGainer = true
}: TopCoinsTableProps) {
	return (
		<div className='overflow-x-auto'>
			<table className='w-full text-sm border'>
				<thead>
					<tr className='bg-gray-100 dark:bg-gray-800'>
						<th className='p-2 border'>Монета</th>
						<th className='p-2 border'>Цена</th>
						<th className='p-2 border'>Изменение 24ч</th>
					</tr>
				</thead>
				<tbody>
					{coins.length > 0 ? (
						coins.map((coin, idx) => (
							<tr
								key={idx}
								className='hover:bg-gray-50 dark:hover:bg-gray-700'
							>
								<td className='p-2 border'>{coin.symbol}</td>
								<td className='p-2 border'>${coin.price.toFixed(2)}</td>
								<td
									className={`p-2 border font-bold ${coin.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
								>
									{coin.priceChangePercent >= 0 ? '+' : ''}
									{coin.priceChangePercent.toFixed(2)}%
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={3}
								className='p-4 text-center'
							>
								Ожидание данных о {title}...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
