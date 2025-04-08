'use client'

import { SetStateAction, useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import {
	EntityType,
	SimpleAutocompleteInput
} from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'
import { ActiveComponentProps } from '@/components/сreator-editor/CreatorEditor'

import { useUpdateDishCategoryMutation } from '@/services/dish-category.service'
import { useUpdateDishMutation } from '@/services/dish.service'
import { useUpdateIngredientMutation } from '@/services/ingredient.service'
import { useUpdateInstitutionMutation } from '@/services/institution.service'
import { useUpdateMealMutation } from '@/services/meal.service'
import { useUpdateWarehouseMutation } from '@/services/warehouse.service'

const fetchQueries = {
	institution: useUpdateInstitutionMutation,
	meal: useUpdateMealMutation,
	ingredient: useUpdateIngredientMutation,
	dishCategory: useUpdateDishCategoryMutation,
	warehouse: useUpdateWarehouseMutation,
	dish: useUpdateDishMutation
} as const

interface EditorProps<T extends EntityType> {
	initialState?: T | null
	type: keyof typeof fetchQueries
	resetActiveComponent: (active: ActiveComponentProps) => void
}

const Editor = <T extends EntityType>({
	resetActiveComponent,
	initialState = null,
	type
}: EditorProps<T>) => {
	const [item, setItem] = useState<T | null>(initialState)
	const [inputKey, setInputKey] = useState(0)

	const [updateInstitution] = useUpdateInstitutionMutation()
	const [updateMeal] = useUpdateMealMutation()
	const [updateIngredient] = useUpdateIngredientMutation()
	const [updateDishCategory] = useUpdateDishCategoryMutation()
	const [updateWarehouse] = useUpdateWarehouseMutation()
	const [updateDish] = useUpdateDishMutation()

	// Эффект для очистки состояния при монтировании компонента
	useEffect(() => {
		// Сбрасываем состояние при монтировании компонента
		if (!initialState) {
			setItem(null)
			setInputKey(prev => prev + 1) // Обновляем ключ для форсированного ререндера
		}

		// Очистка при размонтировании
		return () => {
			setItem(null)
		}
	}, [initialState])

	// Выбираем функцию мутации в зависимости от type
	const update =
		type === 'institution'
			? updateInstitution
			: type === 'meal'
				? updateMeal
				: type === 'ingredient'
					? updateIngredient
					: type === 'dishCategory'
						? updateDishCategory
						: type === 'dish'
							? updateDish
							: updateWarehouse

	// Мемоизированная функция для обновления состояния item
	const memoizedSetItem = useCallback((value: SetStateAction<T | null>) => {
		setItem(prev => {
			const updatedValue = typeof value === 'function' ? value(prev) : value

			// Если значение null или undefined, однозначно возвращаем null
			if (updatedValue === null || updatedValue === undefined) {
				return null
			}

			// Иначе объединяем объекты
			return { ...(structuredClone(prev ?? {}) as T), ...updatedValue }
		})

		// Если установлено null значение, обновляем ключ для ререндера
		if (value === null) {
			setInputKey(prev => prev + 1)
		}
	}, [])

	// Обработчик сохранения
	const handleSave = async () => {
		if (!item || !item.id) return

		try {
			;(await update({
				id: item.id,
				data: item as any
			}).unwrap()) as T

			// Сначала устанавливаем item в null, чтобы очистить данные
			setItem(null)
			// Обновляем ключ для форсированного ререндера SimpleAutocompleteInput
			setInputKey(prev => prev + 1)
			// Затем сбрасываем активный компонент
			resetActiveComponent(null)
		} catch (error) {
			console.error('Ошибка при обновлении элемента:', error)
		}
	}

	return (
		<div className='flex flex-col relative min-w-full'>
			<Button
				className='mb-2'
				onClick={handleSave}
			>
				Сохранить изменения
			</Button>
			<span className='text-base font-medium mb-2'>Введите наименование</span>
			<SimpleAutocompleteInput<T>
				key={inputKey}
				fetchFunction={type}
				className='flex flex-col w-[70%] items-start relative'
				setItem={memoizedSetItem}
				item={item}
			/>
		</div>
	)
}

export default Editor
