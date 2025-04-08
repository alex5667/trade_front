'use client'

import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import {
	EntityType,
	SimpleAutocompleteInput
} from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'
import { ActiveComponentProps } from '@/components/сreator-editor/CreatorEditor'

import { useDeleteDishCategoryMutation } from '@/services/dish-category.service'
import { useDeleteDishMutation } from '@/services/dish.service'
import { useDeleteIngredientMutation } from '@/services/ingredient.service'
import { useDeleteInstitutionMutation } from '@/services/institution.service'
import { useDeleteMealMutation } from '@/services/meal.service'
import { useDeleteWarehouseMutation } from '@/services/warehouse.service'

const deleteQueries = {
	institution: useDeleteInstitutionMutation,
	meal: useDeleteMealMutation,
	ingredient: useDeleteIngredientMutation,
	dishCategory: useDeleteDishCategoryMutation,
	warehouse: useDeleteWarehouseMutation,
	dish: useDeleteDishMutation
} as const

interface DeleterProps<T extends EntityType> {
	type: keyof typeof deleteQueries
	resetActiveComponent: (active: ActiveComponentProps) => void
}

const Deleter = <T extends EntityType>({
	resetActiveComponent,
	type
}: DeleterProps<T>) => {
	const [item, setItem] = useState<T | null>(null)
	const [inputKey, setInputKey] = useState(0)
	const [confirmDelete, setConfirmDelete] = useState(false)

	const [deleteInstitution] = useDeleteInstitutionMutation()
	const [deleteMeal] = useDeleteMealMutation()
	const [deleteIngredient] = useDeleteIngredientMutation()
	const [deleteDishCategory] = useDeleteDishCategoryMutation()
	const [deleteWarehouse] = useDeleteWarehouseMutation()
	const [deleteDish] = useDeleteDishMutation()

	// Эффект для очистки состояния при монтировании компонента
	useEffect(() => {
		return () => {
			setItem(null)
			setConfirmDelete(false)
		}
	}, [])

	// Выбираем функцию удаления в зависимости от type
	const deleteEntity =
		type === 'institution'
			? deleteInstitution
			: type === 'meal'
				? deleteMeal
				: type === 'ingredient'
					? deleteIngredient
					: type === 'dishCategory'
						? deleteDishCategory
						: type === 'dish'
							? deleteDish
							: deleteWarehouse

	// Мемоизированная функция для обновления состояния item
	const memoizedSetItem = useCallback(
		(value: React.SetStateAction<T | null>) => {
			setItem(prev => {
				const updatedValue = typeof value === 'function' ? value(prev) : value

				// Если значение null или undefined, однозначно возвращаем null
				if (updatedValue === null || updatedValue === undefined) {
					return null
				}

				// Иначе объединяем объекты
				return { ...(structuredClone(prev ?? {}) as T), ...updatedValue }
			})

			// Сбрасываем подтверждение при изменении выбранного элемента
			setConfirmDelete(false)

			// Если установлено null значение, обновляем ключ для ререндера
			if (value === null) {
				setInputKey(prev => prev + 1)
			}
		},
		[]
	)

	// Обработчик удаления
	const handleDelete = async () => {
		if (!item || !item.id) return

		try {
			await deleteEntity(item.id).unwrap()

			// Сбрасываем состояние
			setItem(null)
			setConfirmDelete(false)
			// Обновляем ключ для форсированного ререндера SimpleAutocompleteInput
			setInputKey(prev => prev + 1)
			// Затем сбрасываем активный компонент
			resetActiveComponent(null)
		} catch (error) {
			console.error('Ошибка при удалении элемента:', error)
		}
	}

	return (
		<div className='flex flex-col relative min-w-full p-4 border border-red-300 rounded-md'>
			<h2 className='text-xl font-bold mb-4'>Удаление</h2>
			<div className='mb-4'>
				<span className='text-base font-medium mb-2 block'>
					Выберите элемент для удаления
				</span>
				<SimpleAutocompleteInput<T>
					key={inputKey}
					fetchFunction={type}
					className='flex flex-col w-[70%] items-start relative'
					setItem={memoizedSetItem}
					item={item}
				/>
			</div>

			{item && (
				<div className='mt-4'>
					{!confirmDelete ? (
						<Button
							className='bg-red-500 hover:bg-red-600'
							onClick={() => setConfirmDelete(true)}
						>
							Подготовить к удалению
						</Button>
					) : (
						<div className=' p-4 rounded-md'>
							<p className='font-bold text-red-600 mb-2'>
								Вы уверены, что хотите удалить &quot;{item.name}&quot;?
							</p>
							<p className='text-red-600 mb-4'>Это действие нельзя отменить!</p>

							<div className='flex gap-4'>
								<Button
									className='bg-red-600 hover:bg-red-700'
									onClick={handleDelete}
								>
									Подтвердить удаление
								</Button>
								<Button
									className='bg-gray-500 hover:bg-gray-600'
									onClick={() => setConfirmDelete(false)}
								>
									Отмена
								</Button>
							</div>
						</div>
					)}
				</div>
			)}

			<div className='flex justify-end mt-6'>
				<Button
					className='btn btn-secondary'
					onClick={() => resetActiveComponent(null)}
				>
					Назад
				</Button>
			</div>
		</div>
	)
}

export default Deleter
