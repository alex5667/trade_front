'use client'

import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { DishResponse } from '@/types/dish.type'
import { IngredientResponse } from '@/types/ingredient.type'

import {
	useCreateDishMutation,
	useUpdateDishMutation
} from '@/services/dish.service'

export type SelectionIngredientProps = {
	dish: DishResponse
	ingredient: IngredientResponse | undefined
	setDish?: (value: SetStateAction<DishResponse>) => void
}

const SelectionIngredient = ({
	dish,
	ingredient: parentIngredient,
	setDish
}: SelectionIngredientProps) => {
	console.log('parentIngredient', parentIngredient)
	// Изначально значение берётся из parentIngredient (если оно задано)
	const [ingredientSelection, setIngredientSelection] =
		useState<IngredientResponse | null>(
			parentIngredient?.id ? parentIngredient : null
		)
	console.log('ingredientSelection', ingredientSelection)

	const [updateDish] = useUpdateDishMutation()
	const [createDish] = useCreateDishMutation()
	const clearIngredients = dish.ingredients.filter(ing => ing.ingredient?.id)
	const memoizedSetIngredientSelection = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredientSelection(value)
		},
		[]
	)

	useEffect(() => {
		// Если выбранный ингредиент не валиден – не обновляем
		if (
			!ingredientSelection ||
			!('id' in ingredientSelection) ||
			!ingredientSelection.id
		) {
			console.log(
				'Нет валидного выбранного ингредиента, обновление не выполняется',
				ingredientSelection
			)
			return
		}

		let updatedIngredients

		if (parentIngredient?.id) {
			// Редактирование существующей записи.
			// Ищем запись по parentIngredient.id в текущем массиве ингредиентов
			const ingredientIndex = clearIngredients.findIndex(
				ing => ing.ingredient?.id === parentIngredient.id
			)

			if (ingredientIndex === -1) {
				// Если запись не найдена (например, рассинхронизация) – добавляем новый ингредиент.
				updatedIngredients = [
					...clearIngredients,
					{
						ingredient: ingredientSelection,
						grossWeight: 0,
						coldLossPercent: 0,
						heatLossPercent: 0
					}
				]
			} else {
				// Если запись найдена, проверяем, изменился ли выбранный ингредиент.
				if (
					clearIngredients[ingredientIndex].ingredient?.id ===
					ingredientSelection.id
				) {
					// Если выбранный ингредиент совпадает с текущим – выходим.
					return
				}
				updatedIngredients = clearIngredients.map((ing, idx) =>
					idx === ingredientIndex
						? { ...ing, ingredient: ingredientSelection }
						: ing
				)
			}
		} else {
			// Если parentIngredient отсутствует – добавляем новую запись.
			updatedIngredients = [
				...clearIngredients,
				{
					ingredient: ingredientSelection,
					grossWeight: 0,
					coldLossPercent: 0,
					heatLossPercent: 0
				}
			]
		}

		// Если новый массив ингредиентов совпадает с текущим – обновление не требуется.
		if (
			JSON.stringify(updatedIngredients) === JSON.stringify(clearIngredients)
		) {
			console.log(
				'Новый массив ингредиентов совпадает с текущим, обновление не требуется.'
			)
			return
		}

		const updatedData = { ...dish, ingredients: updatedIngredients }
		console.log('updatedData', updatedData)

		const updateOrCreateDish = async () => {
			try {
				if (dish?.id) {
					const dishResponse = await updateDish({
						id: dish.id,
						data: updatedData
					}).unwrap()
					// Обновляем состояние блюда из ответа API
					setDish && setDish(prevDish => ({ ...prevDish, ...dishResponse }))
				} else {
					const dishResponse = await createDish(updatedData).unwrap()
					setDish && setDish(() => dishResponse)
				}
			} catch (error) {
				console.error('Ошибка при обновлении/создании блюда:', error)
			}
		}

		updateOrCreateDish()
		// Зависимости: вызываем эффект только при изменении выбранного ингредиента, parentIngredient или dish.id
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		ingredientSelection?.id,
		parentIngredient?.id,
		dish.id,
		updateDish,
		createDish,
		setDish
	])

	return (
		<SimpleAutocompleteInput
			fetchFunction='ingredient'
			item={ingredientSelection}
			isVisibleCard={false}
			setItem={memoizedSetIngredientSelection}
		/>
	)
}

const areEqual = (
	prevProps: SelectionIngredientProps,
	nextProps: SelectionIngredientProps
): boolean => {
	if (prevProps.dish.id !== nextProps.dish.id) {
		return false
	}
	if (prevProps.dish.name !== nextProps.dish.name) {
		return false
	}
	if (prevProps.dish.ingredients.length !== nextProps.dish.ingredients.length) {
		return false
	}
	for (let i = 0; i < prevProps.dish.ingredients.length; i++) {
		const prevIng = prevProps.dish.ingredients[i].ingredient
		const nextIng = nextProps.dish.ingredients[i].ingredient
		if (prevIng?.id !== nextIng?.id) {
			return false
		}
	}
	if (prevProps.ingredient?.id !== nextProps.ingredient?.id) {
		return false
	}
	if (prevProps.setDish !== nextProps.setDish) {
		return false
	}
	return true
}

export default memo(SelectionIngredient, areEqual)
SelectionIngredient.displayName = 'SelectionIngredient'
