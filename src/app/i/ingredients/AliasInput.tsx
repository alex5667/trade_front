import cn from 'clsx'
import { SetStateAction, useRef } from 'react'

import { IngredientAliasFormState, IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import styles from './AliasPage.module.scss'
import { useAliasInput } from './useAliasInput'

type AliasInputProps = {
	aliasItem: IngredientAliasFormState | undefined
	aliasKey: number|undefined
	ingredient: IngredientResponse
	setIngredient: (value: SetStateAction<IngredientAliasFormState | null>) => void
}

const AliasInput = ({
	aliasItem,
	setIngredient,
	aliasKey,
	ingredient
}: AliasInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const defaultInputValue = aliasItem ? aliasItem.alias : ''
	const { inputValue, handleChange, setInputValue } = useAliasInput({
		defaultInputValue,
		inputRef,
		aliasItem,
		setIngredient,
		aliasKey,
		ingredient
	})

	const handleFocus = () => {
		if (inputValue === '') {
			setInputValue('')
		}
	}

	const handleBlur = () => {
		if (inputValue === '') {
			setInputValue('')
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

export default AliasInput

AliasInput.displayName = 'AliasInput'
