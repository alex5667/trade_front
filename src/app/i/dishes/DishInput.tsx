import cn from 'clsx'
import { SetStateAction, useRef } from 'react'

import { DishResponse } from '@/types/dish.type'

import { useDishInput } from './useDishInput'

export type DishInputProps = {
	dish: DishResponse
	keyName: keyof DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void
	isIngredient?: boolean
}

const DishInput = ({ dish, keyName, setDish }: DishInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { inputValue, handleChange, setInputValue } = useDishInput({
		inputRef,
		data: dish,
		key: keyName,
		setDish
	})
	const handleFocus = () => {
		if (inputValue === 0) {
			setInputValue('')
		}
	}

	const safeValue =
		typeof inputValue === 'string' || typeof inputValue === 'number'
			? inputValue
			: inputValue instanceof Date
				? inputValue.toISOString()
				: typeof inputValue === 'object' && inputValue !== null
					? JSON.stringify(inputValue)
					: ''

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
