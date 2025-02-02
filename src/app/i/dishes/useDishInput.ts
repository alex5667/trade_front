import { useCreateDishMutation, useUpdateDishMutation } from '@/services/dish.service'
import { DishFormState, DishResponse } from '@/types/dish.type'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'

interface UseDishInputProps {
	dish: DishFormState
	inputRef?: MutableRefObject<HTMLInputElement | null>
	key?: keyof DishFormState
	setDish?: (value: SetStateAction<DishFormState>) => void,
	defaultValue?: string | number
	ingredientKey?: string
	ingredientId?: number


}

export function useDishInput<T extends keyof DishFormState>({
	inputRef,
	dish,
	key,
	setDish, defaultValue, ingredientKey, ingredientId
}: UseDishInputProps) {
	const [inputValue, setInputValue] = useState(
		key ? dish[key] : defaultValue
	)
	const [updateDish] = useUpdateDishMutation()
	const [createDish] = useCreateDishMutation()
	useEffect(() => {
		if (key) {

			setInputValue(dish[key] as DishResponse[T])
		}
		if (defaultValue) {
			setInputValue(defaultValue)

		}

	}, [dish, key, defaultValue])
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce(async (value: any) => {


			try {
				let updatedData = { ...dish } as DishFormState
				if (key) {
					updatedData = { ...dish, [key]: +value }
				}
				if (ingredientKey && ingredientId && dish.ingredients) {
					const ingredients = dish.ingredients.map((ingredient, index) => {

						if (ingredient.ingredient?.id === ingredientId) {
							return { ...ingredient, [ingredientKey]: +value }
						}
						return ingredient
					})

					updatedData = {
						...dish, ingredients: ingredients
					}
				}

				if (dish?.id) {
					const dishResponse = await updateDish({ id: dish.id, data: updatedData }).unwrap()
					if (JSON.stringify(dishResponse) !== JSON.stringify(updatedData)) {
						setDish && setDish((prevDish) => { return { ...prevDish, ...dishResponse } })
					}
				} else {
					const dishResponse = await createDish(updatedData).unwrap()

					setDish && setDish(() => dishResponse) // Directly set the new dish


				}
			} catch (error) {
				console.error("Ошибка при обновлении/создании блюда:", error)
			}
		}, 700),
		[dish, key, updateDish, createDish, inputRef]
	)

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value as DishResponse[T]
			setInputValue(newValue)
			debouncedInputChange(newValue)
		},
		[debouncedInputChange]
	)

	return {
		inputValue,
		handleChange,
		setInputValue,
	}
}