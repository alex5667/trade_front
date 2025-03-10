import { useCallback, useState } from 'react'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import { debounce } from '@/utils/debounce'

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
	const [inputValue, setInputValue] = useState(defaultInputValue || '')

	// Мемоизация handleAliasUpdate
	const handleAliasUpdate = useCallback(
		(value: string) => {
			if (!ingredient.id || !value.trim()) return

			const aliases = ingredient.aliases || []
			if (aliases.some(a => a.alias === value && a.id !== aliasItem?.id)) return // Проверка дубликатов

			const updatedData: IngredientAliasResponse = {
				id: aliasItem?.id ?? Date.now(),
				ingredientId: ingredient.id,
				alias: value
			}

			setIngredient(prev => {
				const updatedAliases = aliasItem?.id
					? aliases.map(alias =>
							alias.id === aliasItem.id ? updatedData : alias
						)
					: [...aliases, updatedData]

				return { ...prev!, aliases: updatedAliases }
			})
		},
		[aliasItem?.id, ingredient.id, ingredient.aliases, setIngredient]
	)

	// Дебаунсинг handleAliasUpdate с задержкой 300 мс
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedHandleAliasUpdate = useCallback(
		debounce(handleAliasUpdate, 300),
		[handleAliasUpdate]
	)

	// Обработчик изменения значения в input
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value
			setInputValue(newValue)
			debouncedHandleAliasUpdate(newValue) // Используем дебаунсинговую версию
		},
		[debouncedHandleAliasUpdate]
	)

	return {
		inputValue,
		handleChange
	}
}
