import cn from 'clsx'
import { useRef } from 'react'

import { MealConsumptionResponse } from '@/types/mealConsumption.type'

import styles from './ConsumptionPage.module.scss'
import { useConsumptionInput } from './hooks/useConsumptionInput'

type ConsumptionInputProps = {
	institutionSlug: string
	consumptionItem: MealConsumptionResponse | undefined
	dateForDay: string
	mealSlug: string
}

const ConsumptionInput = ({
	institutionSlug,
	consumptionItem,
	dateForDay,
	mealSlug
}: ConsumptionInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const defaultInputValue = consumptionItem ? consumptionItem.quantity : 0
	const { inputValue, handleChange, setInputValue } = useConsumptionInput({
		defaultInputValue,
		inputRef,
		institutionSlug,
		consumptionItem,
		dateForDay,
		mealSlug
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
		<input
			ref={inputRef}
			className={cn(styles.input)}
			value={inputValue}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	)
}

export default ConsumptionInput

ConsumptionInput.displayName = 'ConsumptionInput'
