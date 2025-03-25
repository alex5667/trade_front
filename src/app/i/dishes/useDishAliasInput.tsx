import { useCallback, useState } from 'react'

import { DishAliasResponse } from '@/types/dish-alias.type'
import { DishFormState } from '@/types/dish.type'

import { debounce } from '@/utils/debounce'

interface UseDishAliasInputProps {
	defaultInputValue: string | undefined
	aliasItem: DishAliasResponse | undefined
	dish: DishFormState
	setDish: (value: React.SetStateAction<DishFormState>) => void
}

export function useDishAliasInput({
	defaultInputValue,
	aliasItem,
	setDish,
	dish
}: UseDishAliasInputProps) {
	const [inputValue, setInputValue] = useState(defaultInputValue || '')

	// Мемоизация handleAliasUpdate
	const handleAliasUpdate = useCallback(
		(value: string) => {
			if (!dish.id || !value.trim()) return

			const aliases = dish.aliases || []
			if (aliases.some(a => a.alias === value && a.id !== aliasItem?.id)) return // Проверка дубликатов

			const updatedData: DishAliasResponse = {
				id: aliasItem?.id ?? Date.now(),
				alias: value,
				dishId: dish.id
			}

			setDish(prev => {
				const updatedAliases = aliasItem?.id
					? (prev.aliases || []).map(alias =>
							alias.id === aliasItem.id ? updatedData : alias
						)
					: [...(prev.aliases || []), updatedData]

				return { ...prev, aliases: updatedAliases }
			})

			// Убираем отправку на сервер - обновления будут отправлены
			// при нажатии кнопки "Сохранить" в DishCard
		},
		[aliasItem?.id, dish.id, dish.aliases, setDish]
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
