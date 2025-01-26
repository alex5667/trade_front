import { MutableRefObject, SetStateAction, useCallback, useState } from 'react'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import { debounce } from '@/utils/debounce'

import {
	useCreateAliasMutation,
	useUpdateAliasMutation
} from '@/services/ingredient-alias.service'

interface useAliasInput {
	defaultInputValue: string
	inputRef: MutableRefObject<HTMLInputElement | null>
	aliasItem: IngredientAliasResponse | undefined
	aliasKey: number
	ingredient: IngredientResponse
	setIngredient: (value: SetStateAction<IngredientResponse | null>) => void
}

export function useAliasInput({
	defaultInputValue,
	inputRef,
	aliasItem,
	aliasKey,
	setIngredient,
	ingredient
}: useAliasInput) {
	const [inputValue, setInputValue] = useState(defaultInputValue)
	const [updateAlias] = useUpdateAliasMutation()
	const [createAlias] = useCreateAliasMutation()

	// Дебаунс обработчик изменений
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce(async (value: string) => {
			const updatedData = {
				ingredientId: aliasItem?.ingredientId,
				alias: value
			}

			if (aliasItem?.id) {
				await updateAlias({
					id: aliasItem.id,
					data: updatedData
				})
			} else {
				const response = await createAlias(updatedData)
				if (response.data) {
					console.log('response.data', response.data)
					const aliases = [...ingredient.aliases, response.data]
					const updatedIngredient = {
						...ingredient,
						aliases
					}
					console.log('updatedIngredient', updatedIngredient)
					setIngredient(() => updatedIngredient)
				}
			}

			if (inputRef.current) {
				inputRef.current.blur()
			}
		}, 500),
		[inputRef, aliasItem, updateAlias, createAlias, setIngredient]
	)

	// Обработчик изменения input
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value
			setInputValue(newValue)
			debouncedInputChange(newValue)
		},
		[debouncedInputChange]
	)

	return {
		inputValue,
		handleChange,
		setInputValue
	}
}
