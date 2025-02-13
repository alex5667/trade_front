import dayjs from 'dayjs'

import { IngredientStats, PurchasingData } from '@/types/purchasing.type'

// Тип для пропсов компонента
interface PurchasingDetailProps {
	weekDishes: PurchasingData
}

// Компонент для отображения данных
const PurchasingDetail = ({ weekDishes }: PurchasingDetailProps) => {
	return (
		<div className='p-6'>
			<h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
				Планирование
			</h1>
			{Object.entries(weekDishes).map(([date, meals]) => (
				<div
					key={date}
					className='mb-8'
				>
					<h2 className='text-2xl font-semibold mb-4 text-gray-700'>
						{dayjs(date).format('DD-MM-YYYY')}
					</h2>
					{Object.entries(meals).map(([mealType, groups]) => (
						<div
							key={mealType}
							className='mb-6'
						>
							<h3 className='text-xl font-semibold mb-2 text-gray-600'>
								{mealType}
							</h3>
							{Object.entries(groups).map(([group, ingredients]) => (
								<div
									key={group}
									className='mb-4'
								>
									<h4 className='text-lg font-medium mb-2 text-gray-500'>
										{group}
									</h4>
									{Array.isArray(ingredients) && ingredients.length > 0 ? (
										<div className='overflow-x-auto'>
											<table className='w-full border-collapse border border-gray-200'>
												<thead className='bg-db-sidebar'>
													<tr>
														<th className='border border-gray-300 px-4 py-2 text-left'>
															Ингредиент
														</th>
														<th className='border border-gray-300 px-4 py-2 text-center'>
															Вес (кг)
														</th>
														<th className='border border-gray-300 px-4 py-2 text-center'>
															Стоимость
														</th>
														<th className='border border-gray-300 px-4 py-2 text-center'>
															Количество
														</th>
													</tr>
												</thead>
												<tbody>
													{ingredients.map((ingredient, index) =>
														Object.entries(
															ingredient as Record<string, IngredientStats>
														).map(([name, stats]) => (
															<tr
																key={`${name}-${index}`}
																className='border-b'
															>
																<td className='border border-gray-300 px-4 py-2'>
																	{name}
																</td>
																<td className='border border-gray-300 px-4 py-2 text-center'>
																	{(stats as IngredientStats)?.grossWeight ||
																		'N/A'}
																</td>
																<td className='border border-gray-300 px-4 py-2 text-center'>
																	{(stats as IngredientStats)?.coast || 'N/A'}
																</td>
																<td className='border border-gray-300 px-4 py-2 text-center'>
																	{(stats as IngredientStats)?.quantity ||
																		'N/A'}
																</td>
															</tr>
														))
													)}
												</tbody>
											</table>
										</div>
									) : (
										<p className='text-gray-500'>Нет данных</p>
									)}
								</div>
							))}
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default PurchasingDetail
