import dayjs from 'dayjs'

import { PurchasingsAggregate } from '@/types/purchasing.type'

interface PurchasingAggregaterops {
	totalIngredientByWeek: PurchasingsAggregate
}

const PurchasingAggregate = ({
	totalIngredientByWeek
}: PurchasingAggregaterops) => {
	const { dates, week } = totalIngredientByWeek

	return (
		<div className='p-6  min-h-screen'>
			<h1 className='text-3xl font-bold mb-6 text-center'>
				Данные по закупкам
			</h1>

			{/* Раздел с данными по датам */}
			<section className='mb-10'>
				<h2 className='text-2xl font-semibold mb-4'>По датам</h2>
				{Object.entries(dates).map(([date, ingredients]) => (
					<div
						key={date}
						className='border border-gray-300  rounded-lg shadow-md p-4 mb-6'
					>
						<h3 className='text-lg  mb-2 '>
							{dayjs(date).format('DD-MM-YYYY')}
						</h3>
						{Object.keys(ingredients).length === 0 ? (
							<p className='text-gray-500'>Нет данных</p>
						) : (
							<div className='overflow-x-auto'>
								<table className='w-full border-collapse border border-gray-200'>
									<thead className='bg-db-sidebar'>
										<tr>
											<th className='border border-gray-300 px-4 py-2 text-left'>
												Ингредиент
											</th>
											<th className='border border-gray-300 px-4 py-2 text-center'>
												Gross Weight
											</th>
											<th className='border border-gray-300 px-4 py-2 text-center'>
												Coast
											</th>
											<th className='border border-gray-300 px-4 py-2 text-center'>
												Quantity
											</th>
										</tr>
									</thead>
									<tbody>
										{Object.entries(ingredients).map(([ingredient, stats]) => (
											<tr
												key={ingredient}
												className='border-b'
											>
												<td className='border border-gray-300 px-4 py-2'>
													{ingredient}
												</td>
												<td className='border border-gray-300 px-4 py-2 text-center'>
													{stats.grossWeight}
												</td>
												<td className='border border-gray-300 px-4 py-2 text-center'>
													{stats.coast}
												</td>
												<td className='border border-gray-300 px-4 py-2 text-center'>
													{stats.quantity}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				))}
			</section>

			{/* Раздел с итогами за неделю */}
			<section>
				<h2 className='text-2xl font-semibold mb-4'>Итог за неделю</h2>
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse border border-gray-200'>
						<thead className='bg-db-sidebar'>
							<tr>
								<th className='border border-gray-300 px-4 py-2 text-left'>
									Ингредиент
								</th>
								<th className='border border-gray-300 px-4 py-2 text-center'>
									Gross Weight
								</th>
								<th className='border border-gray-300 px-4 py-2 text-center'>
									Coast
								</th>
								<th className='border border-gray-300 px-4 py-2 text-center'>
									Quantity
								</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(week).map(([ingredient, stats]) => (
								<tr
									key={ingredient}
									className='border-b'
								>
									<td className='border border-gray-300 px-4 py-2'>
										{ingredient}
									</td>
									<td className='border border-gray-300 px-4 py-2 text-center'>
										{stats.grossWeight}
									</td>
									<td className='border border-gray-300 px-4 py-2 text-center'>
										{stats.coast}
									</td>
									<td className='border border-gray-300 px-4 py-2 text-center'>
										{stats.quantity}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}

export default PurchasingAggregate
