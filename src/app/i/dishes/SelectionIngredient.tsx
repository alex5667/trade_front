'use client'

import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { DishFormState } from '@/types/dish.type'
import { IngredientResponse } from '@/types/ingredient.type'

import {
	useCreateDishMutation,
	useUpdateDishMutation
} from '@/services/dish.service'

export type SelectionIngredientProps = {
	dish: DishFormState
	ingredient: IngredientResponse | undefined
	setDish?: (value: SetStateAction<DishFormState>) => void
}

const SelectionIngredient = ({
	dish,
	ingredient: parentIngredient,
	setDish
}: SelectionIngredientProps) => {
	console.log('parentIngredient', parentIngredient)

	const [ingredientSelection, setIngredientSelection] =
		useState<IngredientResponse | null>(
			parentIngredient?.id ? parentIngredient : null
		)
	console.log('ingredientSelection', ingredientSelection)

	const [updateDish] = useUpdateDishMutation()
	const [createDish] = useCreateDishMutation()

	// Фильтруем ингредиенты, оставляя только те, у которых есть ingredient.id
	const clearIngredients = (dish.ingredients ?? []).filter(
		ing => ing.ingredient?.id
	)

	const memoizedSetIngredientSelection = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredientSelection(value)
		},
		[]
	)

	useEffect(() => {
		if (!ingredientSelection?.id) {
			console.log('Нет валидного выбранного ингредиента')
			return
		}

		let updatedIngredients = [...clearIngredients]

		if (parentIngredient?.id) {
			const ingredientIndex = updatedIngredients.findIndex(
				ing => ing.ingredient?.id === parentIngredient.id
			)

			if (ingredientIndex === -1) {
				updatedIngredients.push({
					ingredient: ingredientSelection,
					grossWeight: 0,
					coldLossPercent: 0,
					heatLossPercent: 0
				})
			} else if (
				updatedIngredients[ingredientIndex].ingredient?.id !==
				ingredientSelection.id
			) {
				updatedIngredients[ingredientIndex] = {
					...updatedIngredients[ingredientIndex],
					ingredient: ingredientSelection
				}
			} else {
				return
			}
		} else {
			updatedIngredients.push({
				ingredient: ingredientSelection,
				grossWeight: 0,
				coldLossPercent: 0,
				heatLossPercent: 0
			})
		}

		const arraysAreEqual =
			updatedIngredients.length === clearIngredients.length &&
			updatedIngredients.every(
				(ing, idx) =>
					ing.ingredient?.id === clearIngredients[idx]?.ingredient?.id
			)

		if (arraysAreEqual) {
			console.log('Массив ингредиентов не изменился')
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
	}, [
		ingredientSelection?.id,
		parentIngredient?.id,
		dish.id,
		updateDish,
		createDish,
		setDish,
		ingredientSelection,
		clearIngredients,
		dish
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
	if (prevProps.dish.id !== nextProps.dish.id) return false
	if (prevProps.dish.name !== nextProps.dish.name) return false

	const prevIngredients = prevProps.dish.ingredients ?? []
	const nextIngredients = nextProps.dish.ingredients ?? []

	if (prevIngredients.length !== nextIngredients.length) return false

	for (let i = 0; i < prevIngredients.length; i++) {
		const prevIng = prevIngredients[i].ingredient
		const nextIng = nextIngredients[i].ingredient
		if (prevIng?.id !== nextIng?.id) return false
	}

	if (prevProps.ingredient?.id !== nextProps.ingredient?.id) return false
	if (prevProps.setDish !== nextProps.setDish) return false

	return true
}

export default memo(SelectionIngredient, areEqual)
SelectionIngredient.displayName = 'SelectionIngredient'
