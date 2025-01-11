import { memo, useEffect, useState } from 'react'

import { DishResponse } from '@/types/dish.type'

import DishIngredients from './DishIngredients'
import DishInput from './DishInput'

interface DishCard {
	dish: DishResponse
	// setDish?: (value: SetStateAction<DishResponse>) => void
}
const DishCard = memo(({ dish: initialDish }: DishCard) => {
	const [dish, setDish] = useState<DishResponse>(() => initialDish)

	useEffect(() => {
		setDish(initialDish)
	}, [initialDish])

	if (!dish || Object.keys(dish).length === 0) {
		return <p>Блюдо не выбрано.</p>
	}
	return (
		dish && (
			<div className='w-full'>
				{(Object.keys(dish) as (keyof DishResponse)[]).map((key, index) => {
					const isIngredients = key === 'ingredients'
					const isCategory = key === 'category'
					if (isIngredients) {
						return (
							<DishIngredients
								key={index}
								dish={dish}
								setDish={setDish}
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
								setDish={setDish}
							/>
						</div>
					)
				})}
			</div>
		)
	)
})

export default DishCard
DishCard.displayName = 'DishCard'
