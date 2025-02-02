import cn from 'clsx'
import { SetStateAction, useRef } from 'react'

import { DishFormState } from '@/types/dish.type'

import { formatValue } from '@/utils/formatValue'

import { useDishInput } from './useDishInput'

export type DishInputProps = {
	dish: DishFormState
	keyName?: keyof DishFormState
	setDish?: (value: SetStateAction<DishFormState>) => void
	defaultValue?: string | number
	ingredientKey?: string
	ingredientId?: number
}

const DishInput = ({
	dish,
	keyName,
	setDish,

	defaultValue,
	ingredientKey,
	ingredientId
}: DishInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { inputValue, handleChange, setInputValue } = useDishInput({
		inputRef,
		dish,
		setDish,
		key: keyName,
		defaultValue,
		ingredientKey,
		ingredientId
	})
	const handleFocus = () => {
		if (inputValue === 0) {
			setInputValue('')
		}
	}

	const safeValue = formatValue(inputValue)

	return (
		<input
			ref={inputRef}
			className={cn('w-full')}
			value={safeValue}
			onChange={handleChange}
			onFocus={handleFocus}
		/>
	)
}

export default DishInput
DishInput.displayName = 'DishInput'
