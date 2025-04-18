'use client'

interface TopCoinsTableProps {
	coins: string[]
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
					</tr>
				</thead>
				<tbody>
					{coins.length > 0 ? (
						coins.map((symbol, idx) => (
							<tr
								key={idx}
								className='hover:bg-gray-50 dark:hover:bg-gray-700'
							>
								<td className='p-2 border'>{symbol}</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={1}
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
