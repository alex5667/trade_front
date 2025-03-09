'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import Creator from './creator/Creator'
import Editor from './creator/Editor'
import IngredientsCreator from '@/app/i/ingredients/IngredientsCreator'
import IngredientsEditor from '@/app/i/ingredients/IngredientsEditor'

export const componentMap = {
	ingredient: ['ингредиент'],
	institution: ['точку выдачи'],
	meal: ['прием пищи'],
	dishCategory: ['категорию'],
	dish: ['блюдо']
} as const

const initialState = {
	name: '',
	printName: ''
}

export type ComponentMapKeys = keyof typeof componentMap

export type ActiveComponentProps = null | 'editor' | 'creator'

export interface CreatorEditorProps {
	type: ComponentMapKeys
}

const CreatorEditor = ({ type }: CreatorEditorProps) => {
	const [activeComponent, setActiveComponent] =
		useState<ActiveComponentProps>(null)

	const handleEditor = () => setActiveComponent('editor')
	const handleCreator = () => setActiveComponent('creator')
	const resetActiveComponent = (active: ActiveComponentProps) =>
		setActiveComponent(active)

	if (!(type in componentMap)) {
		return <div>Ошибка: Тип {type} не поддерживается</div>
	}

	const [title] = componentMap[type]

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
			{/* <div className='flex flex-col items-center justify-start pt-3 w-full'>
				{activeComponent === 'editor' && type !== 'ingredient' ? (
					<Editor
						type={type}
						resetActiveComponent={resetActiveComponent}
						initialState={null}
					/>
				) : (
					<IngredientsEditor resetActiveComponent={resetActiveComponent} />
				)}
				{activeComponent === 'creator' && type !== 'ingredient' ? (
					<Creator
						type={type}
						EditorComponent={({ resetActiveComponent }) => (
							<Editor
								type={type}
								resetActiveComponent={resetActiveComponent}
							/>
						)}
						resetActiveComponent={resetActiveComponent}
						initialState={initialState}
					/>
				) : (
					<IngredientsCreator resetActiveComponent={resetActiveComponent} />
				)}
			</div> */}
			<div className='flex flex-col items-center justify-start pt-3 w-full'>
				{activeComponent === 'editor' ? (
					type !== 'ingredient' ? (
						<Editor
							type={type}
							resetActiveComponent={resetActiveComponent}
							initialState={null}
						/>
					) : (
						<IngredientsEditor resetActiveComponent={resetActiveComponent} />
					)
				) : activeComponent === 'creator' ? (
					type !== 'ingredient' ? (
						<Creator
							type={type}
							EditorComponent={({ resetActiveComponent }) => (
								<Editor
									type={type}
									resetActiveComponent={resetActiveComponent}
								/>
							)}
							resetActiveComponent={resetActiveComponent}
							initialState={initialState}
						/>
					) : (
						<IngredientsCreator resetActiveComponent={resetActiveComponent} />
					)
				) : null}
			</div>
		</div>
	)
}

export default CreatorEditor
