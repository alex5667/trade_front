import { useCreateDishMutation, useUpdateDishMutation } from '@/services/dish.service'
import { DishFormState, DishResponse } from '@/types/dish.type'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

interface UseDishInputProps {
	dish: DishFormState
	inputRef?: MutableRefObject<HTMLInputElement | null>
	key?: keyof DishFormState
	setDish?: (value: SetStateAction<DishFormState>) => void
	defaultValue?: string | number
	ingredientKey?: string
	ingredientId?: number
}

export function useDishInput<T extends keyof DishFormState>({
	inputRef,
	dish,
	key,
	setDish,
	defaultValue,
	ingredientKey,
	ingredientId
}: UseDishInputProps) {
	const [inputValue, setInputValue] = useState(key ? dish[key] : defaultValue)

	const [updateDish] = useUpdateDishMutation()
	const [createDish] = useCreateDishMutation()

	// Храним ссылку на текущее блюдо, чтобы не включать объект в зависимости
	const dishRef = useRef(dish)
	dishRef.current = dish

	useEffect(() => {
		if (key && dish[key] !== undefined && dish[key] !== null) {
			setInputValue(dish[key] as DishResponse[T])
		} else if (defaultValue !== undefined) {
			setInputValue(defaultValue)
		}
	}, [dish.id, key, defaultValue, dish])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce(async (value: any) => {
			try {
				let updatedData = { ...dishRef.current } as DishFormState

				if (key && value !== undefined && value !== null) {
					updatedData = { ...updatedData, [key]: value }
				}

				if (ingredientKey && ingredientId && updatedData.ingredients) {
					const ingredients = updatedData.ingredients.map(ingredient =>
						ingredient.ingredient?.id === ingredientId
							? { ...ingredient, [ingredientKey]: +value }
							: ingredient
					)
					updatedData = { ...updatedData, ingredients }
				}

				if (updatedData.id) {
					const dishResponse = await updateDish({
						id: updatedData.id,
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
		}, 700),
		[updateDish, createDish, setDish, key, ingredientKey, ingredientId]
	)

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value as DishResponse[T] || ''
			setInputValue(newValue)
			debouncedInputChange(newValue)
		},
		[debouncedInputChange]
	)

	return {
		inputValue,
		handleChange,
		setInputValue
	}
}
