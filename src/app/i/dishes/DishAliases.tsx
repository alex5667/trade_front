import { SetStateAction, useCallback } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { Titlies } from '@/constants/titles'

import { DishAliasResponse } from '@/types/dish-alias.type'
import { DishFormState } from '@/types/dish.type'

import DishAliasInput from './DishAliasInput'

interface DishAliasesProps {
	dish: DishFormState
	setDish: (value: SetStateAction<DishFormState>) => void
}

const DishAliases = ({ dish, setDish }: DishAliasesProps) => {
	// Добавление нового алиаса
	const addAlias = useCallback(() => {
		if (!dish.id) return

		// Use the full DishAliasResponse instead of Partial to ensure all required properties are present
		const newAlias: DishAliasResponse = {
			id: Date.now(),
			alias: 'Новый синоним',
			dishId: dish.id
		}

		setDish(prev => ({
			...prev,
			aliases: [...(prev.aliases || []), newAlias]
		}))

		// Убираем отправку обновления на сервер
		// Теперь это будет происходить при нажатии на кнопку "Сохранить" в DishCard
	}, [dish.id, setDish])

	// Удаление алиаса
	const handleDeleteAlias = useCallback(
		(aliasId: number) => {
			if (!dish.id) return

			setDish(prev => ({
				...prev,
				aliases: (prev.aliases || []).filter(alias => alias.id !== aliasId)
			}))

			// Убираем отправку обновления на сервер
			// Теперь это будет происходить при нажатии на кнопку "Сохранить" в DishCard
		},
		[dish.id, setDish]
	)

	return (
		<div className='flex flex-col w-full gap-2'>
			<div className='flex w-full items-center justify-between'>
				<p className='mr-2 p-2 text-sm rounded-lg border border-border-light flex-grow w-[20%] h-full'>
					{Titlies.aliases || 'Синонимы'}
				</p>
				<Button
					onClick={addAlias}
					className='ml-auto'
				>
					Добавить
				</Button>
			</div>
			{dish.aliases && dish.aliases.length > 0 ? (
				<div className='flex flex-col gap-2 pl-[21%]'>
					{dish.aliases.map(alias => (
						<div
							key={alias.id}
							className='flex items-center gap-2'
						>
							<DishAliasInput
								aliasItem={alias}
								dish={dish}
								setDish={setDish}
							/>
							<Button
								onClick={() => handleDeleteAlias(alias.id)}
								className='ml-auto'
							>
								Удалить
							</Button>
						</div>
					))}
				</div>
			) : (
				<div className='pl-[21%] text-sm text-gray-500'>Нет синонимов</div>
			)}
		</div>
	)
}

export default DishAliases
