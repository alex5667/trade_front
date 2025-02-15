import { SetStateAction, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import { SimpleField } from '@/components/ui/fields/SImpleField'
import { CreatorEditorStateProps } from '@/components/сreator-editor/CreatorEditor'

import { IngredientFormState } from '@/types/ingredient.type'

import { useCreateIngredientMutation } from '@/services/ingredient.service'

interface IngredientsCreatorProps {
	setActiveComponent: (
		value: SetStateAction<CreatorEditorStateProps | null>
	) => void
}
const IngredientsCreator = ({
	setActiveComponent
}: IngredientsCreatorProps) => {
	const initialIngredient: IngredientFormState = {
		name: 'Введите наименование',
		printName: 'Введите наименование для печати'
	}
	const [ingredient, setIngredient] =
		useState<IngredientFormState>(initialIngredient)
	const [create, { isSuccess }] = useCreateIngredientMutation()
	const handleChange =
		(field: keyof IngredientFormState) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setIngredient(prev => ({
				...prev,
				[field]: e.target.value
			}))
		}

	const handeleClick = async () => {
		try {
			const newIngredient = await create(ingredient).unwrap()
			console.log('newIngredient', newIngredient)

			setActiveComponent(() => ({ type: 'editor', data: newIngredient }))
		} catch (error) {
			console.error('Ошибка при создании ингредиента', error)
		}
	}

	return (
		<div className='flex flex-col w-full'>
			<SimpleField
				id='name'
				label='Наименование'
				placeholder='Введите наименование'
				onChange={handleChange('name')}
				type='text'
			/>
			<SimpleField
				id='printName'
				label='Наименование для печати'
				placeholder='Введите наименование для печати'
				onChange={handleChange('printName')}
				type='text'
			/>
			<Button onClick={handeleClick}> Создать ингредиент </Button>
		</div>
	)
}

export default IngredientsCreator
