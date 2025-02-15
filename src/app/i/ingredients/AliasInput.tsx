import cn from 'clsx'
import { useRef } from 'react'

import { IngredientAliasFormState } from '@/types/ingredient-alias.type'
import { IngredientFormState } from '@/types/ingredient.type'

import styles from './AliasPage.module.scss'
import { useAliasInput } from './useAliasInput'

type AliasInputProps = {
	aliasItem: IngredientAliasFormState | undefined
	ingredient: IngredientFormState
	setIngredient: (
		value: React.SetStateAction<IngredientFormState | null>
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
