'use client'

import { SetStateAction, useCallback, useState } from 'react'

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

	const [updateInstitution] = useUpdateInstitutionMutation()
	const [updateMeal] = useUpdateMealMutation()
	const [updateIngredient] = useUpdateIngredientMutation()
	const [updateDishCategory] = useUpdateDishCategoryMutation()
	const [updateWarehouse] = useUpdateWarehouseMutation()
	const [updateDish] = useUpdateDishMutation()

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
			return updatedValue
				? { ...(structuredClone(prev ?? {}) as T), ...updatedValue }
				: null
		})
	}, [])

	// Обработчик сохранения
	const handleSave = async () => {
		if (!item || !item.id) return

		try {
			const responseItem = (await update({
				id: item.id,
				data: item as any
			}).unwrap()) as T

			setItem(responseItem)
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
				fetchFunction={type}
				className='flex flex-col w-[70%] items-start relative'
				setItem={memoizedSetItem}
				item={item}
			/>
		</div>
	)
}

export default Editor
