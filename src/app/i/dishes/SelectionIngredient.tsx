import {
	SetStateAction,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'

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
	// Локальное состояние для выбранного ингредиента
	const [ingredientSelection, setIngredientSelection] =
		useState<IngredientResponse | null>(
			parentIngredient?.id ? parentIngredient : null
		)

	const [updateDish] = useUpdateDishMutation()
	const [createDish] = useCreateDishMutation()

	// Фильтруем ингредиенты блюда, оставляя только те, у которых задан ingredient.id
	// const clearIngredients = (dish.ingredients ?? []).filter(
	// 	ing => ing.ingredient?.id
	// )

	// Мемоизированное обновление локального состояния выбранного ингредиента
	const memoizedSetIngredientSelection = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredientSelection(value)
		},
		[]
	)

	// Используем ref-флаг для предотвращения зацикливания обновлений
	const updatePendingRef = useRef(false)

	// Эффект обновления блюда при изменении выбранного ингредиента.
	// Зависимости: только изменения ingredientSelection и родительского ingredient.
	useEffect(
		() => {
			if (!ingredientSelection?.id) {
				console.log('Нет валидного выбранного ингредиента')
				return
			}

			// Используем текущее блюдо из состояния (dish) для вычисления нового массива ингредиентов.
			// Мы не включаем dish в зависимости эффекта, чтобы избежать зацикливания.
			const currentIngredients = dish.ingredients || []

			let updatedIngredients = [...currentIngredients]

			if (parentIngredient?.id) {
				const ingredientIndex = currentIngredients.findIndex(
					ing => ing.ingredient?.id === parentIngredient.id
				)

				if (ingredientIndex === -1) {
					// Если родительского ингредиента нет в списке, добавляем новый ингредиент.
					updatedIngredients.push({
						ingredient: ingredientSelection,
						grossWeight: 0,
						coldLossPercent: 0,
						heatLossPercent: 0
					})
				} else if (
					currentIngredients[ingredientIndex].ingredient?.id !==
					ingredientSelection.id
				) {
					// Если ингредиент изменился, обновляем его.
					updatedIngredients[ingredientIndex] = {
						...currentIngredients[ingredientIndex],
						ingredient: ingredientSelection
					}
				} else {
					// Если выбранный ингредиент совпадает с уже существующим – ничего не делаем.
					return
				}
			} else {
				// Если родительский ингредиент не задан, добавляем новый ингредиент.
				updatedIngredients.push({
					ingredient: ingredientSelection,
					grossWeight: 0,
					coldLossPercent: 0,
					heatLossPercent: 0
				})
			}

			// Сравниваем текущий и обновленный массив ингредиентов.
			if (
				JSON.stringify(currentIngredients) ===
				JSON.stringify(updatedIngredients)
			) {
				console.log('Массив ингредиентов не изменился')
				return
			}
			const validIngredients = updatedIngredients.filter(
				ing => ing.ingredient !== undefined
			)

			const updatedDish = { ...dish, ingredients: validIngredients }
			console.log('updatedDish', updatedDish)

			// Если обновление уже выполняется, не запускаем новое.
			if (updatePendingRef.current) {
				console.log('Обновление уже в процессе')
				return
			}
			updatePendingRef.current = true

			const updateOrCreateDish = async () => {
				try {
					if (dish.id) {
						const dishResponse = await updateDish({
							id: dish.id,
							data: updatedDish
						}).unwrap()
						setDish && setDish(prevDish => ({ ...prevDish, ...dishResponse }))
					} else {
						const dishResponse = await createDish(updatedDish).unwrap()
						setDish && setDish(() => dishResponse)
					}
				} catch (error) {
					console.error('Ошибка при обновлении/создании блюда:', error)
				} finally {
					updatePendingRef.current = false
				}
			}

			updateOrCreateDish()
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			ingredientSelection?.id,
			parentIngredient?.id,
			updateDish,
			createDish,
			setDish
		]
	)

	return (
		// <div>truble</div>
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
