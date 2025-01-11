import { useCreateDishMutation, useUpdateDishMutation } from '@/services/dish.service'
import { DishResponse } from '@/types/dish.type'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'

interface UseDishInputProps {
	inputRef: MutableRefObject<HTMLInputElement | null>
	data: DishResponse
	key?: keyof DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void,
	defaultValue?: string | number
	ingredientKey?: string
	ingredientId?: number


}

export function useDishInput<T extends keyof DishResponse>({
	inputRef,
	data,
	key,
	setDish, defaultValue, ingredientKey, ingredientId
}: UseDishInputProps) {
	const [inputValue, setInputValue] = useState(
		key ? data[key] : defaultValue
	)
	const [updateDish] = useUpdateDishMutation()
	const [createDish] = useCreateDishMutation()
	useEffect(() => {
		if (key) {

			setInputValue(data[key] as DishResponse[T])
		}
		if (defaultValue) {
			setInputValue(defaultValue)

		}

	}, [data, key, defaultValue])
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce(async (value: any) => {


			try {
				let updatedData = { ...data } as DishResponse
				if (key) {
					updatedData = { ...data, [key]: value }
				}
				if (ingredientKey && ingredientId) {
					const ingredients = data.ingredients.map((ingredient, index) => {
						if (ingredient.ingredient?.id === ingredientId) {
							return { ...ingredient, [ingredientKey]: +value }
						}
						return ingredient
					})

					updatedData = {
						...data, ingredients: ingredients
					}
				}

				if (data?.id) {
					const dish = await updateDish({ id: data.id, data: updatedData }).unwrap()
					if (JSON.stringify(dish) !== JSON.stringify(updatedData)) {
						setDish && setDish((prevDish) => { return { ...prevDish, ...dish } })
					}
				} else {
					const dish = await createDish(updatedData).unwrap()

					setDish && setDish(() => dish) // Directly set the new dish


				}
			} catch (error) {
				console.error("Ошибка при обновлении/создании блюда:", error)
			}
		}, 700),
		[data, key, updateDish, createDish, inputRef]
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