'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import DishCreator from './DishCreator'
import DishEditor from './DishEditor'

const Dishes = () => {
	const [activeComponent, setActiveComponent] = useState<
		null | 'editor' | 'creator'
	>(null)

	const handleEditor = () => {
		setActiveComponent('editor')
	}

	const handleCreator = () => {
		setActiveComponent('creator')
	}

	return (
		<div className='flex flex-col relative min-w-full'>
			<div className='flex items-center justify-between w-full'>
				<Button
					onClick={handleEditor}
					className='btn btn-primary'
				>
					Изменить блюдо
				</Button>
				<Button
					onClick={handleCreator}
					className='btn btn-primary'
				>
					Добавить блюдо
				</Button>
			</div>
			<div className='flex flex-col items-center justify-start pt-3 w-full'>
				{activeComponent === 'editor' && <DishEditor />}
				{activeComponent === 'creator' && <DishCreator />}
			</div>
		</div>
	)
}

export default Dishes
