'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import DishCreator from '@/app/i/dishes/DishCreator'
import DishEditor from '@/app/i/dishes/DishEditor'
import IngredientsCreator from '@/app/i/ingredients/IngredientsCreator'
import IngredientsEditor from '@/app/i/ingredients/IngredientsEditor'

export type ActiveComponentProps = null | 'editor' | 'creator'
interface CreatorEditorProps {
	type: 'dish' | 'ingredient'
}

const CreatorEditor = ({ type }: CreatorEditorProps) => {
	const [activeComponent, setActiveComponent] =
		useState<ActiveComponentProps>(null)

	const handleEditor = () => setActiveComponent('editor')
	const handleCreator = () => setActiveComponent('creator')
	const resetActiveComponent = (active: ActiveComponentProps) =>
		setActiveComponent(active)

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
				{activeComponent === 'editor' &&
					(isDish ? (
						<DishEditor />
					) : (
						<IngredientsEditor resetActiveComponent={resetActiveComponent} />
					))}
				{activeComponent === 'creator' &&
					(isDish ? (
						<DishCreator />
					) : (
						<IngredientsCreator resetActiveComponent={resetActiveComponent} />
					))}
			</div>
		</div>
	)
}

export default CreatorEditor
