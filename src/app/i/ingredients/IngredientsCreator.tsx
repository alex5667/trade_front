'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import { FieldInput } from '@/components/ui/fields/FieldInput'
import { ActiveComponentProps } from '@/components/сreator-editor/CreatorEditor'

import {
	IngredientFormState,
	IngredientResponse
} from '@/types/ingredient.type'

import IngredientsEditor from './IngredientsEditor'
import { useCreateIngredientMutation } from '@/services/ingredient.service'

interface IngredientsCreatorProps {
	resetActiveComponent: (active: ActiveComponentProps) => void
}

const IngredientsCreator = ({
	resetActiveComponent
}: IngredientsCreatorProps) => {
	const simpleIngredients: IngredientFormState = {
		name: '',
		printName: ''
	}

	const [ingredient, setIngredient] =
		useState<IngredientFormState>(simpleIngredients)
	const [createdIngredient, setCreatedIngredient] =
		useState<IngredientResponse | null>(null)
	const [createIngredient] = useCreateIngredientMutation()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setIngredient(prev => ({
			...prev,
			[id]: value // Теперь изменения корректно обновляют state
		}))
	}

	const handleCreate = async () => {
		try {
			const newIngredient = await createIngredient(ingredient).unwrap()
			setCreatedIngredient(newIngredient)
		} catch (error) {
			console.error('Ошибка при создании ингредиента:', error)
		}
	}

	if (createdIngredient) {
		return (
			<IngredientsEditor
				resetActiveComponent={resetActiveComponent}
				ingredientResponse={createdIngredient}
			/>
		)
	}

	return (
		<div className='flex flex-col gap-4 p-6 border rounded-lg shadow-md w-96'>
			<h2 className='text-lg font-semibold'>Создание ингредиента</h2>
			<FieldInput
				id='name'
				label='Наименование'
				placeholder='Введите наименование'
				type='text'
				value={ingredient.name || ''}
				onChange={handleInputChange}
			/>
			<FieldInput
				id='printName'
				label='Наименование для печати'
				placeholder='Введите наименование для печати'
				type='text'
				value={ingredient.printName || ''}
				onChange={handleInputChange}
			/>
			<Button onClick={handleCreate}>Сохранить</Button>
		</div>
	)
}

export default IngredientsCreator
