'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import styles from './CreatorEditor.module.scss'
import EntitiesViewer from './EntitiesViewer'
import { ComponentMapKeys, componentMap } from './componentMap'

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
		return (
			<div className={styles.error}>Ошибка: Тип {type} не поддерживается</div>
		)
	}

	const { title, EditorComponent, CreatorComponent, DeleterComponent } =
		componentMap[type]

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<Button
					onClick={handleEditor}
					className='btn'
				>
					Изменить {title}
				</Button>
				<Button
					onClick={handleCreator}
					className='btn'
				>
					Добавить {title}
				</Button>
				<Button
					onClick={handleDeleter}
					className='btn '
				>
					Удалить {title}
				</Button>
				<Button
					onClick={handleViewer}
					className='btn'
				>
					Получить все
				</Button>
			</div>
			<div className={styles.content}>
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
