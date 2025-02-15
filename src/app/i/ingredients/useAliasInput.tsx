import { useCallback, useState } from 'react'

import { IngredientAliasFormState } from '@/types/ingredient-alias.type'
import { IngredientFormState } from '@/types/ingredient.type'

interface UseAliasInputProps {
	defaultInputValue: string | undefined
	aliasItem: IngredientAliasFormState | undefined
	ingredient: IngredientFormState
	setIngredient: (
		value: React.SetStateAction<IngredientFormState | null>
	) => void
}

export function useAliasInput({
	defaultInputValue,
	aliasItem,
	setIngredient,
	ingredient
}: UseAliasInputProps) {
	const [inputValue, setInputValue] = useState(defaultInputValue)

	const handleAliasUpdate = useCallback(
		async (value: string) => {
			const updatedData = {
				// ingredientId: aliasItem?.ingredientId ?? ingredient.id,
				alias: value
			}

			if (aliasItem?.id) {
				const updatedAlias: IngredientAliasFormState = {
					id: aliasItem.id,
					...updatedData
				}
				const updatedAliases = [
					...(ingredient.aliases ?? []).filter(
						alias => alias.id !== aliasItem.id
					),
					updatedAlias
				]
				setIngredient({ ...ingredient, aliases: updatedAliases })
			} else {
				const newAlias: IngredientAliasFormState = {
					ingredientId: ingredient.id,
					alias: value
				}
				const updatedAliases = [...(ingredient.aliases ?? []), newAlias]
				setIngredient({ ...ingredient, aliases: updatedAliases })
			}
		},
		[aliasItem, setIngredient, ingredient]
	)

	// Обработчик изменения значения в input
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value
			console.log('newValue', newValue)
			setInputValue(newValue)
			handleAliasUpdate(newValue)
		},
		[handleAliasUpdate]
	)

	return {
		inputValue,
		handleChange
	}
}
