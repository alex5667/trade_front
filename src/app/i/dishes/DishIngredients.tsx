'use client'

import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { DishResponse } from '@/types/dish.type'

import DishInput from './DishInput'
import SelectionIngredient from './SelectionIngredient'
import { useUpdateDishMutation } from '@/services/dish.service'

type Props = {
	dish: DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void
}

const DishIngredients = ({ dish, setDish }: Props) => {
	const [output, setOutput] = useState(0)
	const [sum, setSum] = useState(0)
	console.log('DishIngredients', dish)
	const [updateDish] = useUpdateDishMutation()
	// Функция для удаления ингредиента по индексу
	const handleDeleteIngredient = async (index: number) => {
		if (setDish) {
			const ingredients = dish.ingredients.filter((_, i) => i !== index)
			const updatedData = { ...dish, ingredients } as DishResponse
			const dishResponse = await updateDish({
				id: dish.id,
				data: updatedData
			}).unwrap()
			if (JSON.stringify(dishResponse) !== JSON.stringify(updatedData)) {
				setDish(prevDish => {
					return { ...prevDish, ...dishResponse }
				})
			}
		}
	}
	const handleAddIngredient = useCallback(async () => {
		if (!setDish) return

		// Создаем новый ингредиент с начальными значениями
		const newIngredient = {
			ingredient: undefined,
			grossWeight: 0,
			coldLossPercent: 0,
			heatLossPercent: 0
		}

		// Обновляем состояние блюда, добавляя новый ингредиент
		setDish(prevDish => ({
			...prevDish,
			ingredients: [...prevDish.ingredients, newIngredient]
		}))
	}, [setDish])

	// const handleAddIngredient = async () => {
	// 	setDish &&
	// 		setDish(prev => ({
	// 			...prev,
	// 			ingredients: [
	// 				...prev.ingredients,
	// 				{
	// 					ingredient: undefined,
	// 					grossWeight: 0,
	// 					coldLossPercent: 0,
	// 					heatLossPercent: 0
	// 				}
	// 			]
	// 		}))
	// }

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
			return acc + outputWeight
		}, 0)
		setOutput(out)

		const sumVal = dish.ingredients.reduce((acc, curr) => {
			const price =
				curr.ingredient?.price && curr.grossWeight
					? curr.ingredient.price * curr.grossWeight
					: 0
			return acc + price
		}, 0)
		setSum(sumVal)
	}, [dish.ingredients])

	return (
		<div className='p-4'>
			<h2 className='text-lg font-bold mb-4'>Ингредиенты блюда</h2>
			<Button onClick={handleAddIngredient}>Добавить ингредиент</Button>
			<div>
				<div>
					<span className='mr-2'>Выход (чистый вес)</span>
					<span>{output.toFixed(3)}</span>
				</div>
				<div>
					<span className='mr-2'>Сумма</span>
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
							<th className='border'>Ед. изм.</th>
							<th className='border px-4 py-2'>Сумма</th>
							<th className='border px-4 py-2'>
								Отход при холодной обработке (%)
							</th>
							<th className='border px-4 py-2'>
								Отход при тепловой обработке (%)
							</th>
							<th className='border px-4 py-2'>Выход (чистый вес)</th>
							<th className='border px-4 py-2'>Удалить</th>
						</tr>
					</thead>
					<tbody>
						{dish.ingredients.map((ingredient, index) => {
							const ingredientSum =
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
										<SelectionIngredient
											dish={dish}
											ingredient={ingredient.ingredient}
											setDish={setDish}
										/>
									</td>
									<td className='border px-4 py-2'>
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
									<td className='border px-4 py-2'>
										{ingredientSum.toFixed(2)}
									</td>
									<td className='border px-4 py-2'>
										<DishInput
											dish={dish}
											ingredientKey='coldLossPercent'
											ingredientId={ingredient.ingredient?.id}
											setDish={setDish}
											defaultValue={ingredient.coldLossPercent?.toFixed(0)}
										/>
									</td>
									<td className='border px-4 py-2'>
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
									<td className='border px-4 py-2'>
										<button
											className='bg-red-500 text-white px-2 py-1 rounded'
											onClick={() => handleDeleteIngredient(index)}
										>
											Удалить
										</button>
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

export default memo(DishIngredients)
DishIngredients.displayName = 'DishIngredients'
