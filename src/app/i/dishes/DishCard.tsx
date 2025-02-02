import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { DishFormState, DishResponse } from '@/types/dish.type'

import DishIngredients from './DishIngredients'
import DishInput from './DishInput'

interface DishCardProps {
	dish: DishFormState
}

const DishCard = memo(({ dish: initialDish }: DishCardProps) => {
	const [dish, setDish] = useState<DishFormState>(() => initialDish)

	useEffect(() => {
		setDish(initialDish)
	}, [initialDish])

	const memoizedSetDish = useCallback(
		(value: SetStateAction<DishFormState>) => {
			setDish(value)
		},
		[]
	)

	if (!dish || Object.keys(dish).length === 0) {
		return <p>Блюдо не выбрано.</p>
	}
	return (
		<div className='w-full'>
			{(Object.keys(dish) as (keyof DishResponse)[]).map((key, index) => {
				if (key === 'ingredients') {
					return (
						<DishIngredients
							key={index}
							dish={dish}
							setDish={memoizedSetDish}
						/>
					)
				}
				return (
					<div
						key={index}
						className='flex w-full items-center'
					>
						<p className='mr-2 p-1'>{index}</p>
						<p className='mr-2 w-[10%] p-1'>{key}</p>
						<DishInput
							dish={dish}
							keyName={key}
							setDish={memoizedSetDish}
						/>
					</div>
				)
			})}
		</div>
	)
})

export default DishCard
DishCard.displayName = 'DishCard'
