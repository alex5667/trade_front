import cn from 'clsx'
import { SetStateAction, useRef } from 'react'

import { formatValue } from '@/utils/formatValue'

import { useCardInput } from './useCardInput'

export type InputProps<T> = {
	item: T
	keyName?: keyof T
	setItem?: (value: SetStateAction<T>) => void
	fetchFunction: string
}

const CardInput = <T,>({
	item,
	setItem,
	keyName,
	fetchFunction
}: InputProps<T>) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { inputValue, handleChange, setInputValue } = useCardInput({
		inputRef,
		data: item,
		fetchFunction,
		setItem,
		keyName
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

export default CardInput
CardInput.displayName = 'CardInput'
