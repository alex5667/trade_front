import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { DishFormState, DishResponse } from '@/types/dish.type'

import styles from './DishIngredients.module.scss'
import DishInput from './DishInput'
import SelectionIngredient from './SelectionIngredient'
import { useUpdateDishMutation } from '@/services/dish.service'

type Props = {
	dish: DishFormState
	setDish?: (value: SetStateAction<DishFormState>) => void
}

const DishIngredients = ({ dish, setDish }: Props) => {
	const [output, setOutput] = useState(0)
	const [sum, setSum] = useState(0)
	const [updateDish] = useUpdateDishMutation()

	const handleDeleteIngredient = async (index: number) => {
		if (setDish) {
			const ingredients =
				dish.ingredients &&
				dish.ingredients.length > 0 &&
				dish.ingredients.filter((_, i) => i !== index)
			const updatedData = { ...dish, ingredients } as DishResponse
			if (dish.id) {
				const dishResponse = await updateDish({
					id: dish.id,
					data: updatedData
				}).unwrap()
				if (JSON.stringify(dishResponse) !== JSON.stringify(updatedData)) {
					setDish(prevDish => ({ ...prevDish, ...dishResponse }))
				}
			}
		}
	}

	const handleAddIngredient = useCallback(async () => {
		if (!setDish) return

		const newIngredient = {
			ingredient: undefined,
			grossWeight: 0,
			coldLossPercent: 0,
			heatLossPercent: 0
		}

		setDish(prevDish => ({
			...prevDish,
			ingredients: [...(prevDish.ingredients ?? []), newIngredient]
		}))
	}, [setDish])

	useEffect(() => {
		const calculateOutputAndSum = () => {
			const out =
				dish.ingredients?.reduce((acc, curr) => {
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
				}, 0) || 0

			const sumVal =
				dish.ingredients?.reduce((acc, curr) => {
					const price =
						curr.ingredient?.price && curr.grossWeight
							? +curr.ingredient.price * curr.grossWeight
							: 0
					return acc + price
				}, 0) || 0

			setOutput(out)
			setSum(sumVal)
		}

		calculateOutputAndSum()
	}, [dish.ingredients])

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.title}>Ингредиенты блюда</h2>
			<Button onClick={handleAddIngredient}>Добавить ингредиент</Button>
			<div className={styles.outputSumContainer}>
				<div className={styles.outputSumItem}>
					<span className={styles.outputSumLabel}>Выход (чистый вес)</span>
					<span>{output.toFixed(3)}</span>
				</div>
				<div className={styles.outputSumItem}>
					<span className={styles.outputSumLabel}>Сумма</span>
					<span>{sum.toFixed(2)}</span>
				</div>
			</div>
			{dish.ingredients && dish.ingredients.length > 0 ? (
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Название ингредиента</th>
							<th>Вес (брутто)</th>
							<th>Цена за ед.изм.</th>
							<th>Ед. изм.</th>
							<th>Сумма</th>
							<th>Отход при холодной обработке (%)</th>
							<th>Отход при тепловой обработке (%)</th>
							<th>Выход (чистый вес)</th>
							<th>Удалить</th>
						</tr>
					</thead>
					<tbody>
						{dish.ingredients.map((ingredient, index) => {
							const ingredientSum =
								ingredient.ingredient?.price && ingredient.grossWeight
									? +ingredient.ingredient.price * ingredient.grossWeight
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
									<td>
										<SelectionIngredient
											dish={dish}
											ingredient={ingredient.ingredient}
											setDish={setDish}
										/>
									</td>
									<td>
										<DishInput
											dish={dish}
											ingredientKey='grossWeight'
											ingredientId={ingredient.ingredient?.id}
											setDish={setDish}
											defaultValue={ingredient.grossWeight?.toFixed(3)}
										/>
									</td>
									<td>{Number(price).toFixed(2)}</td>
									<td>{ingredient.ingredient?.unit || '-'}</td>
									<td>{ingredientSum.toFixed(2)}</td>
									<td>
										<DishInput
											dish={dish}
											ingredientKey='coldLossPercent'
											ingredientId={ingredient.ingredient?.id}
											setDish={setDish}
											defaultValue={ingredient.coldLossPercent?.toFixed(0)}
										/>
									</td>
									<td>
										<DishInput
											dish={dish}
											ingredientKey='heatLossPercent'
											ingredientId={ingredient.ingredient?.id}
											setDish={setDish}
											defaultValue={ingredient.heatLossPercent?.toFixed(0)}
										/>
									</td>
									<td>{outputWeight.toFixed(3) || '-'}</td>
									<td>
										<button
											className={styles.deleteButton}
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
				<p className={styles.noData}>Нет данных об ингредиентах.</p>
			)}
		</div>
	)
}

export default memo(DishIngredients)
DishIngredients.displayName = 'DishIngredients'
