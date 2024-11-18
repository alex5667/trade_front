import { MutableRefObject, useCallback, useState } from 'react'

import { MealConsumptionResponse } from '@/types/mealConsumption.type'

import { debounce } from '@/utils/debounce'

import {
	useCreateMealConsumptionMutation,
	useUpdateMealConsumptionMutation
} from '@/services/meal-consumption.service'

interface useConsumptionInput {
	defaultInputValue: number | string
	inputRef: MutableRefObject<HTMLInputElement | null>
	institutionSlug: string
	consumptionItem: MealConsumptionResponse | undefined
	dateForDay: string
	mealSlug: string
}
export function useConsumptionInput({
	defaultInputValue,
	inputRef,
	institutionSlug,
	consumptionItem,
	dateForDay,
	mealSlug
}: useConsumptionInput) {
	const [inputValue, setInputValue] = useState(defaultInputValue)
	const [updateMealConsumption] = useUpdateMealConsumptionMutation()
	const [createMealConsumption] = useCreateMealConsumptionMutation()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce(async (value: number) => {
			const updatedData = {
				...consumptionItem,
				date: dateForDay,
				mealSlug,
				institutionSlug,
				quantity: value
			}

			if (consumptionItem?.id) {
				await updateMealConsumption({
					id: consumptionItem.id,
					data: updatedData
				})
			} else {
				await createMealConsumption(updatedData)
			}

			if (inputRef.current) {
				inputRef.current.blur()
			}
		}, 500),
		[
			inputRef,
			consumptionItem,
			dateForDay,
			mealSlug,
			institutionSlug,
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
