import { useCallback, useState } from 'react'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

interface UseAliasInputProps {
	defaultInputValue: string | undefined
	aliasItem: IngredientAliasResponse | undefined
	ingredient: IngredientResponse
	setIngredient: (
		value: React.SetStateAction<IngredientResponse | null>
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
			if (ingredient.id) {
				if (aliasItem?.id) {
					const updatedAlias: IngredientAliasResponse = {
						id: aliasItem.id,
						ingredientId: ingredient.id,
						...updatedData
					}
					const updatedAliases = [
						...(ingredient.aliases ?? []).filter(
							alias => alias.id !== aliasItem.id
						),
						updatedAlias
					]
					setIngredient({ ...ingredient, aliases: updatedAliases })
				}
				// else {
				// 	const newAlias: IngredientAliasResponse = {
				// 		ingredientId: ingredient.id,
				// 		alias: value
				// 	}
				// 	const updatedAliases = [...(ingredient.aliases ?? []), newAlias]
				// 	setIngredient({ ...ingredient, aliases: updatedAliases })
				// }
			}
		},
		[aliasItem, setIngredient, ingredient]
	)

	// Обработчик изменения значения в input
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value
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
