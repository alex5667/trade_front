'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import EntitiesViewer from './EntitiesViewer'
import { ComponentMapKeys, componentMap } from './componentMap'

// const initialState = {
// 	name: '',
// 	printName: ''
// } as const

export type ActiveComponentProps =
	| null
	| 'editor'
	| 'creator'
	| 'deleter'
	| 'viewer'

export interface CreatorEditorProps {
	type: ComponentMapKeys
}

const CreatorEditor = ({ type }: CreatorEditorProps) => {
	const [activeComponent, setActiveComponent] =
		useState<ActiveComponentProps>(null)

	const handleEditor = () => setActiveComponent('editor')
	const handleCreator = () => setActiveComponent('creator')
	const handleDeleter = () => setActiveComponent('deleter')
	const handleViewer = () => setActiveComponent('viewer')
	const resetActiveComponent = (active: ActiveComponentProps) =>
		setActiveComponent(active)

	if (!(type in componentMap)) {
		return <div>Ошибка: Тип {type} не поддерживается</div>
	}

	const { title, EditorComponent, CreatorComponent, DeleterComponent } =
		componentMap[type]

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
				<Button
					onClick={handleDeleter}
					className='btn btn-danger'
				>
					Удалить {title}
				</Button>
				<Button
					onClick={handleViewer}
					className='btn btn-secondary'
				>
					Получить все
				</Button>
			</div>
			<div className='flex flex-col items-center justify-start pt-3 w-full'>
				{activeComponent === 'editor' && (
					<EditorComponent
						type={type}
						resetActiveComponent={resetActiveComponent}
						initialState={null}
					/>
				)}
				{activeComponent === 'creator' && (
					<CreatorComponent
						type={type as any}
						EditorComponent={EditorComponent as any}
						resetActiveComponent={resetActiveComponent}
						// initialState={initialState}
					/>
				)}
				{activeComponent === 'deleter' && (
					<DeleterComponent
						type={type}
						resetActiveComponent={resetActiveComponent}
					/>
				)}
				{activeComponent === 'viewer' && (
					<EntitiesViewer
						type={type}
						resetActiveComponent={resetActiveComponent}
					/>
				)}
			</div>
		</div>
	)
}

export default CreatorEditor
