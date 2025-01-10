'use client'

import { SetStateAction, useEffect, useState } from 'react'

import { DishResponse } from '@/types/dish.type'

import DishInput from './DishInput'

type Props = {
	dish: DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void
}

const DishIngredients = ({ dish, setDish }: Props) => {
	console.log('DishIngredients dish', dish)
	const [output, setOutput] = useState(0)
	const [sum, setSum] = useState(0)
	useEffect(() => {
		const out = dish.ingredients.reduce((acc, curr) => {
			let outputWeight = curr.grossWeight || 0

			if (curr.grossWeight) {
				if (curr.coldLossPercent) {
					outputWeight *= 1 - curr.coldLossPercent / 100
				}
				if (curr.heatLossPercent) {
					outputWeight *= 1 - curr.heatLossPercent / 100
				}
			}
			acc += outputWeight
			return acc
		}, 0)
		setOutput(out)

		const sum = dish.ingredients.reduce((acc, curr) => {
			const price =
				curr.ingredient?.price && curr.grossWeight
					? curr.ingredient.price * curr.grossWeight
					: 0
			acc += price
			return acc
		}, 0)

		setSum(sum)
	}, [dish])
	return (
		<div className='p-4'>
			<h2 className='text-lg font-bold mb-4'>Ингредиенты блюда</h2>
			<div>
				<div>
					<span>Выход (чистый вес)</span>
					<span>{output.toFixed(3)}</span>
				</div>
				<div>
					<span>Сумма</span>
					<span>{sum.toFixed(2)}</span>
				</div>
			</div>
			{dish.ingredients.length > 0 ? (
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
						{dish.ingredients.map((ingredient, index) => {
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
									</td>
									<td className='border px-4 py-2'>
										{/* {ingredient.ingredient?.id} */}
										{/* {ingredient.grossWeight?.toFixed(3) || '-'} */}
										<DishInput
											dish={dish}
											ingredientKey='grossWeight'
											ingredientId={ingredient.ingredient?.id}
											setDish={setDish}
											defaultValue={ingredient.grossWeight?.toFixed(3)}
										/>
									</td>
									<td className='border px-4 py-2'>{price.toFixed(2)}</td>
									<td className='border px-4 py-2'>
										{ingredient.ingredient?.unit || '-'}
									</td>
									<td className='border px-4 py-2'>{sum.toFixed(2)}</td>
									<td className='border px-4 py-2'>
										{/* {ingredient.coldLossPercent?.toFixed(0) || '-'} */}
										<DishInput
											dish={dish}
											ingredientKey='coldLossPercent'
											ingredientId={ingredient.ingredient?.id}
											setDish={setDish}
											defaultValue={ingredient.coldLossPercent?.toFixed(0)}
										/>
									</td>
									<td className='border px-4 py-2'>
										{/* {ingredient.heatLossPercent?.toFixed(0) || '-'} */}
										<DishInput
											dish={dish}
											ingredientKey='heatLossPercent'
											ingredientId={ingredient.ingredient?.id}
											setDish={setDish}
											defaultValue={ingredient.heatLossPercent?.toFixed(0)}
										/>
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
