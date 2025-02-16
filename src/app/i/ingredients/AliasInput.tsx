import cn from 'clsx'
import { useRef } from 'react'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import styles from './AliasPage.module.scss'
import { useAliasInput } from './useAliasInput'

type AliasInputProps = {
	aliasItem: IngredientAliasResponse | undefined
	ingredient: IngredientResponse
	setIngredient: (
		value: React.SetStateAction<IngredientResponse | null>
	) => void
}

const AliasInput = ({
	aliasItem,
	setIngredient,
	ingredient
}: AliasInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { inputValue, handleChange } = useAliasInput({
		defaultInputValue: aliasItem ? aliasItem.alias : '',
		aliasItem,
		setIngredient,
		ingredient
	})

	return (
		<input
			ref={inputRef}
			className={cn(styles.input)}
			value={inputValue}
			onChange={handleChange}
		/>
	)
}

export default AliasInput

AliasInput.displayName = 'AliasInput'
