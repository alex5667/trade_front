import { MutableRefObject, useCallback, useState } from 'react'

import { MealConsumptionResponse } from '@/types/meal-consumption.type'

import { debounce } from '@/utils/debounce'

import {
	useCreateMealConsumptionMutation,
	useUpdateMealConsumptionMutation
} from '@/services/meal-consumption.service'

interface useConsumptionInput {
	defaultInputValue: number | string
	inputRef: MutableRefObject<HTMLInputElement | null>
	institutionId: number
	consumptionItem: MealConsumptionResponse | undefined
	dateForDay: string
	mealId: number
}
export function useConsumptionInput({
	defaultInputValue,
	inputRef,
	institutionId,
	consumptionItem,
	dateForDay,
	mealId
}: useConsumptionInput) {
	const [inputValue, setInputValue] = useState(defaultInputValue)
	const [updateMealConsumption] = useUpdateMealConsumptionMutation()
	const [createMealConsumption] = useCreateMealConsumptionMutation()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce(async (value: number) => {
			if (value === 0 && !consumptionItem?.id) {
				return
			}

			const updatedData = {
				date: dateForDay,
				institutionId: consumptionItem?.institutionId,
				mealId: consumptionItem?.mealId,
				quantity: value
			}

			if (
				consumptionItem?.id &&
				consumptionItem?.institutionId &&
				consumptionItem?.mealId
			) {
				await updateMealConsumption({
					id: consumptionItem.id,
					data: updatedData
				})
			} else {
				// For new items, we need to fetch institutionId and mealId
				const response = await createMealConsumption({
					...updatedData,
					institutionId,
					mealId
				})

				if ('data' in response && response.data) {
					// Update local state with new consumption item
					setInputValue(response.data.quantity)
				}
			}

			if (inputRef.current) {
				inputRef.current.blur()
			}
		}, 500),
		[
			inputRef,
			consumptionItem,
			dateForDay,
			mealId,
			institutionId,
			updateMealConsumption,
			createMealConsumption
		]
	)

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = +event.target.value
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
