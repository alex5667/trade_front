'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { IngredientResponse } from '@/types/ingredient.type'

import DishCreator from '@/app/i/dishes/DishCreator'
import DishEditor from '@/app/i/dishes/DishEditor'
import IngredientsCreator from '@/app/i/ingredients/IngredientsCreator'
import IngredientsEditor from '@/app/i/ingredients/IngredientsEditor'

interface CreatorEditorProps {
	type: 'dish' | 'ingredient'
}

export type ActiveComponentType = null | 'editor' | 'creator'
export type CreatorEditorStateProps = {
	type: ActiveComponentType
	data?: IngredientResponse | undefined
}

const CreatorEditor = ({ type }: CreatorEditorProps) => {
	const [activeComponent, setActiveComponent] =
		useState<CreatorEditorStateProps | null>(null)

	const handleEditor = () => setActiveComponent({ type: 'editor' })
	const handleCreator = () => setActiveComponent({ type: 'creator' })

	const isDish = type === 'dish'
	const title = isDish ? 'блюдо' : 'ингредиент'

	return (
		<div className='flex flex-col relative min-w-full'>
			<div className='flex items-center justify-between w-full gap-4'>
				<Button
					onClick={handleEditor}
					className='btn btn-primary'
				>
					Изменить {title}
				</Button>
				<Button
					onClick={handleCreator}
					className='btn btn-primary'
				>
					Добавить {title}
				</Button>
			</div>
			<div className='flex flex-col items-center justify-start pt-3 w-full'>
				{activeComponent?.type === 'editor' &&
					(isDish ? (
						<DishEditor />
					) : (
						<IngredientsEditor
							initialIngredient={activeComponent.data}
							setActiveComponent={setActiveComponent}
						/>
					))}
				{activeComponent?.type === 'creator' &&
					(isDish ? (
						<DishCreator />
					) : (
						<IngredientsCreator setActiveComponent={setActiveComponent} />
					))}
			</div>
		</div>
	)
}

export default CreatorEditor
