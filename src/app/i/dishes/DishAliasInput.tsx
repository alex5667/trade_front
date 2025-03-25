import cn from 'clsx'
import { useRef } from 'react'

import { DishAliasResponse } from '@/types/dish-alias.type'
import { DishFormState } from '@/types/dish.type'

import styles from './DishPage.module.scss'
import { useDishAliasInput } from './useDishAliasInput'

type DishAliasInputProps = {
	aliasItem: DishAliasResponse | undefined
	dish: DishFormState
	setDish: (value: React.SetStateAction<DishFormState>) => void
}

const DishAliasInput = ({ aliasItem, setDish, dish }: DishAliasInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { inputValue, handleChange } = useDishAliasInput({
		defaultInputValue: aliasItem ? aliasItem.alias : '',
		aliasItem,
		setDish,
		dish
	})

	return (
		<input
			ref={inputRef}
			className={cn(styles.input)}
			value={inputValue}
			onChange={handleChange}
			placeholder='Введите синоним блюда'
			type='text'
			aria-label='Синоним блюда'
		/>
	)
}

export default DishAliasInput

DishAliasInput.displayName = 'DishAliasInput'
