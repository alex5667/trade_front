'use client'

import { SetStateAction } from 'react'

import { DishIngredient, DishResponse } from '@/types/dish.type'

type Props = {
	ingredients: DishIngredient[]
	dish: DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void
	keyName: keyof DishResponse
}

const DishIngredients = ({ ingredients, dish, setDish, keyName }: Props) => {
	return (
		<div className='p-4'>
			<h2 className='text-lg font-bold mb-4'>Ингредиенты блюда</h2>
			{ingredients.length > 0 ? (
				<table className='table-auto border-collapse border border-gray-300 w-full'>
					<thead>
						<tr>
							<th className='border px-4 py-2'>Название ингредиента</th>
							<th className='border px-4 py-2'>Вес (брутто)</th>
							<th className='border px-4 py-2'>Цена за ед.изм.</th>
							<th className='border '>Ед. изм.</th>
							<th className='border px-4 py-2 '>Сумма</th>
							<th className='border px-4 py-2'>
								Отход при холодной обработке (%)
							</th>
							<th className='border px-4 py-2'>
								Отход при тепловой обработке (%)
							</th>
							<th className='border px-4 py-2'>Выход (чистый вес)</th>
						</tr>
					</thead>
					<tbody>
						{ingredients.map((ingredient, index) => {
							const sum =
								ingredient.ingredient?.price && ingredient.grossWeight
									? ingredient.ingredient.price * ingredient.grossWeight
									: 0

							let outputWeight = ingredient.grossWeight || 0

							if (ingredient.grossWeight) {
								if (ingredient.coldLossPercent) {
									outputWeight *= 1 - ingredient.coldLossPercent / 100
								}
								if (ingredient.heatLossPercent) {
									outputWeight *= 1 - ingredient.heatLossPercent / 100
								}
							}
							const price = ingredient.ingredient?.price || 0

							return (
								<tr key={index}>
									<td className='border px-4 py-2'>
										{ingredient.ingredient?.printName || '-'}
										{/* <DishInput
											dish={dish}
											keyName={keyName}
											setDish={setDish}
										/> */}
									</td>
									<td className='border px-4 py-2'>
										{ingredient.grossWeight?.toFixed(3) || '-'}
									</td>
									<td className='border px-4 py-2'>{price.toFixed(2)}</td>
									<td className='border px-4 py-2'>
										{ingredient.ingredient?.unit || '-'}
									</td>
									<td className='border px-4 py-2'>{sum.toFixed(2)}</td>
									<td className='border px-4 py-2'>
										{ingredient.coldLossPercent?.toFixed(0) || '-'}
									</td>
									<td className='border px-4 py-2'>
										{ingredient.heatLossPercent?.toFixed(0) || '-'}
									</td>
									<td className='border px-4 py-2'>
										{outputWeight.toFixed(3) || '-'}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			) : (
				<p>Нет данных об ингредиентах.</p>
			)}
		</div>
	)
}

export default DishIngredients
