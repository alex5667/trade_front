import { SetStateAction, useCallback } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { Titlies } from '@/constants/titles'

import { DishAliasResponse } from '@/types/dish-alias.type'
import { DishFormState } from '@/types/dish.type'

import DishAliasInput from './DishAliasInput'
import styles from './DishAliases.module.scss'

interface DishAliasesProps {
	dish: DishFormState
	setDish: (value: SetStateAction<DishFormState>) => void
}

const DishAliases = ({ dish, setDish }: DishAliasesProps) => {
	const addAlias = useCallback(() => {
		if (!dish.id) return

		const newAlias: DishAliasResponse = {
			id: Date.now(),
			alias: 'Новый синоним',
			dishId: dish.id
		}

		setDish(prev => ({
			...prev,
			aliases: [...(prev.aliases || []), newAlias]
		}))
	}, [dish.id, setDish])

	const handleDeleteAlias = useCallback(
		(aliasId: number) => {
			if (!dish.id) return

			setDish(prev => ({
				...prev,
				aliases: (prev.aliases || []).filter(alias => alias.id !== aliasId)
			}))
		},
		[dish.id, setDish]
	)

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<p className={styles.title}>{Titlies.aliases || 'Синонимы'}</p>
				<Button
					onClick={addAlias}
					className='ml-auto'
				>
					Добавить
				</Button>
			</div>
			{dish.aliases && dish.aliases.length > 0 ? (
				<div className={styles.aliasesContainer}>
					{dish.aliases.map(alias => (
						<div
							key={alias.id}
							className={styles.aliasItem}
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
				<div className={styles.noAliases}>Нет синонимов</div>
			)}
		</div>
	)
}

export default DishAliases
