import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { Titlies } from '@/constants/titles'

import { DishFormState, DishResponse } from '@/types/dish.type'

import DishIngredients from './DishIngredients'
import DishInput from './DishInput'

interface DishCardProps {
	dish: DishFormState
}

const DishCard = memo(({ dish: initialDish }: DishCardProps) => {
	const [dish, setDish] = useState<DishFormState>(() => initialDish)

	useEffect(() => {
		if (initialDish) {
			setDish(initialDish)
		}
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
		<div className='w-full flex flex-col gap-2'>
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
						className='flex w-full items-center justify-between'
					>
						{/* <p className='mr-2 p-1'>{index}</p> */}
						<p className='mr-2 p-2 text-sm rounded-lg border border-border-light flex-grow w-[20%] h-full'>
							{Titlies[key]}
						</p>
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

const areEqual = (
	prevProps: DishCardProps,
	nextProps: DishCardProps
): boolean => {
	return JSON.stringify(prevProps.dish) === JSON.stringify(nextProps.dish)
}

export default memo(DishCard, areEqual)
DishCard.displayName = 'DishCard'
