import { useCreateDishMutation, useUpdateDishMutation } from '@/services/dish.service'
import { DishResponse } from '@/types/dish.type'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'

interface UseDishInputProps {
	inputRef: MutableRefObject<HTMLInputElement | null>
	data: DishResponse
	key: keyof DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void,
	isIngredient: boolean
}

export function useDishInput<T extends keyof DishResponse>({
	inputRef,
	data,
	key,
	setDish
}: UseDishInputProps) {
	const [inputValue, setInputValue] = useState(data[key] as DishResponse[T])

	const [updateDish] = useUpdateDishMutation()
	const [createDish] = useCreateDishMutation()
	useEffect(() => {
		setInputValue(data[key] as DishResponse[T])

	}, [data, key])
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce(async (value: any) => {
			try {
				const updatedData = { ...data, [key]: value }

				if (data?.id) {
					const dish = await updateDish({ id: data.id, data: updatedData }).unwrap()
					if (JSON.stringify(dish) !== JSON.stringify(updatedData)) {
						setDish && setDish(updatedData)
					}
				} else {
					const dish = await createDish(updatedData).unwrap()
					setDish && setDish(dish)

				}
			} catch (error) {
				console.error("Ошибка при обновлении/создании блюда:", error)
			}
		}, 500),
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