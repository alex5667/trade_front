import { SetStateAction, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import { SimpleField } from '@/components/ui/fields/SImpleField'
import { ActiveComponentType } from '@/components/сreator-editor/CreatorEditor'

import { IngredientFormState } from '@/types/ingredient.type'

import IngredientsEditor from './IngredientsEditor'
import { useCreateIngredientMutation } from '@/services/ingredient.service'

interface IngredientsCreatorProps {
	setActiveComponent: (value: SetStateAction<ActiveComponentType>) => void
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
		const newIngredient = await create(ingredient).unwrap()
		setIngredient(newIngredient)
		setActiveComponent('editor')
		if (isSuccess) {
			return <IngredientsEditor initialIngredient={newIngredient} />
		}
	}

	return (
		<div className='flex flex-col'>
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
