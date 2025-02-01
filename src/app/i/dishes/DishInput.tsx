import cn from 'clsx'
import { SetStateAction, useRef } from 'react'

import { DishResponse } from '@/types/dish.type'

import { formatValue } from '@/utils/formatValue'

import { useDishInput } from './useDishInput'

export type DishInputProps = {
	dish: DishResponse
	keyName?: keyof DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void
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
