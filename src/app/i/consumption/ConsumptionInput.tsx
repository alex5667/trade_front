import { useRef } from 'react'

import { FieldInput } from '@/components/ui/fields/FieldInput'

import { MealConsumptionResponse } from '@/types/meal-consumption.type'

import styles from './ConsumptionPage.module.scss'
import { useConsumptionInput } from './hooks/useConsumptionInput'

type ConsumptionInputProps = {
	institutionId: number
	consumptionItem: MealConsumptionResponse | undefined
	dateForDay: string
	mealId: number
}

const ConsumptionInput = ({
	institutionId,
	consumptionItem,
	dateForDay,
	mealId
}: ConsumptionInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const defaultInputValue = consumptionItem ? consumptionItem.quantity : 0
	const { inputValue, handleChange, setInputValue } = useConsumptionInput({
		defaultInputValue,
		inputRef,
		institutionId,
		consumptionItem,
		dateForDay,
		mealId
	})

	const handleFocus = () => {
		if (inputValue === 0) {
			setInputValue('')
		}
	}

	const handleBlur = () => {
		if (inputValue === '' || isNaN(Number(inputValue))) {
			setInputValue(0)
		}
	}
	return (
		<FieldInput
			ref={inputRef}
			extra={styles.input}
			value={inputValue}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	)
}

export default ConsumptionInput

ConsumptionInput.displayName = 'ConsumptionInput'
