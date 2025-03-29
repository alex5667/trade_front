'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import { FieldInput } from '@/components/ui/fields/FieldInput'
import { EntityType } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { ActiveComponentProps } from '../CreatorEditor'

import { useCreateDishCategoryMutation } from '@/services/dish-category.service'
import { useCreateDishMutation } from '@/services/dish.service'
import { useCreateIngredientMutation } from '@/services/ingredient.service'
import { useCreateInstitutionMutation } from '@/services/institution.service'
import { useCreateMealMutation } from '@/services/meal.service'
import { useCreateWarehouseMutation } from '@/services/warehouse.service'

const fetchQueries = {
	institution: useCreateInstitutionMutation,
	ingredient: useCreateIngredientMutation,
	meal: useCreateMealMutation,
	dishCategory: useCreateDishCategoryMutation,
	dish: useCreateDishMutation,
	warehouse: useCreateWarehouseMutation
}

type PartialEntity = Partial<EntityType>

interface CreatorProps<T extends PartialEntity> {
	resetActiveComponent: (active: ActiveComponentProps) => void
	initialState?: T
	type: keyof typeof fetchQueries
	EditorComponent: React.ComponentType<{
		resetActiveComponent: (active: ActiveComponentProps) => void
		entity: T
	}>
}

const Creator = <T extends PartialEntity>({
	resetActiveComponent,
	initialState,
	type,
	EditorComponent
}: CreatorProps<T>) => {
	const [entity, setEntity] = useState<T | undefined>(
		(initialState as T) ?? undefined
	)
	const [createdEntity, setCreatedEntity] = useState<T | null>(null)

	const [createEntity] = fetchQueries[type]()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setEntity(prev => ({
			...(prev as T),
			[id]: value
		}))
	}

	const handleCreate = async () => {
		try {
			if (entity) {
				const entityWithDefaults = {
					...entity,
					name: entity.name ?? '', // Ensure name is always a string
					printName: entity.printName ?? entity.name ?? '' // Ensure printName exists (copy from name if not provided)
				}

				const newEntity = (await createEntity(entityWithDefaults).unwrap()) as T
				setCreatedEntity(prev => ({
					...(prev as T),
					...newEntity
				}))
			}
		} catch (error) {
			console.error(`Ошибка при создании ${type}:`, error)
		}
	}

	if (createdEntity) {
		return (
			<EditorComponent
				resetActiveComponent={resetActiveComponent}
				entity={createdEntity}
			/>
		)
	}

	return (
		<div className='flex flex-col gap-4 p-6 border rounded-lg shadow-md w-96'>
			<h2 className='text-lg font-semibold'>Создание {type}</h2>
			{initialState &&
				Object.keys(initialState).map(field => (
					<FieldInput
						key={field}
						id={field}
						label={field}
						placeholder={`Введите ${field}`}
						type='text'
						value={(entity as any)[field] || ''}
						onChange={handleInputChange}
					/>
				))}
			<Button onClick={handleCreate}>Сохранить</Button>
		</div>
	)
}

export default Creator
