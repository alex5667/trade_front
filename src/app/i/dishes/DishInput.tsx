import { SetStateAction, useRef } from 'react'

import { FieldInput } from '@/components/ui/fields/FieldInput'

// Укажи правильный путь
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
		key: keyName,
		setDish,
		defaultValue,
		ingredientKey,
		ingredientId
	})

	const handleFocus = () => {
		if (inputValue === 0 || inputValue === '0') {
			setInputValue('')
		}
	}

	const safeValue = formatValue(inputValue)

	return (
		<FieldInput
			ref={inputRef}
			id={`dish-input-${keyName || ingredientId || 'default'}`}
			value={safeValue}
			onChange={handleChange}
			onFocus={handleFocus} // Теперь работает
			extra='w-full bg-db-sidebar-light w-[80%]'
			// inputStyle='py-2 text-red-500'
			style={{
				paddingTop: '0.7rem',
				paddingBottom: '0.7rem'
			}}
			// isNumber={keyName === 'price' || ingredientKey === 'amount'} // Пример условия
		/>
	)
}

export default DishInput
DishInput.displayName = 'DishInput'
