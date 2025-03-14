import { SetStateAction, useRef } from 'react'

import { formatValue } from '@/utils/formatValue'

import { FieldInput } from '../fields/FieldInput'

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
		<FieldInput
			ref={inputRef}
			id={`card-input-${(keyName as string) || 'default'}`}
			value={safeValue}
			onChange={handleChange}
			onFocus={handleFocus}
			extra='w-full bg-db-sidebar-light w-[80%] h-full'
			style={{
				paddingTop: '8px',
				paddingBottom: '8px'
			}}
		/>
	)
}

export default CardInput
CardInput.displayName = 'CardInput'
