import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { Titlies } from '@/constants/titles'

import { DishFormState, DishResponse } from '@/types/dish.type'
import { DishCategoryResponse } from '@/types/dishCategory.type'

import DishIngredients from './DishIngredients'
import DishInput from './DishInput'
import { DishUpdate, useUpdateDishMutation } from '@/services/dish.service'

interface DishCardProps {
	dish: DishFormState
}

const DishCard = memo(({ dish: initialDish }: DishCardProps) => {
	const [dish, setDish] = useState<DishFormState>(() => initialDish)
	const [category, setCategory] = useState<DishCategoryResponse | null>(null)
	const [updateDish, { isLoading }] = useUpdateDishMutation()
	useEffect(() => {
		if (dish && dish.id && category) {
			const dishUpdate: DishUpdate = {
				data: { ...dish, category },
				id: dish.id
			}
			updateDish(dishUpdate)
		}
	}, [category, dish, updateDish])

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
		<div className='w-full flex flex-col gap-2 mt-5'>
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
				if (key === 'category') {
					return (
						<div
							key={index}
							className='flex w-full items-center justify-between'
						>
							{/* <p className='mr-2 p-1'>{index}</p> */}
							<p className='mr-2 p-2 text-sm rounded-lg border border-border-light flex-grow w-[20%] h-full'>
								{Titlies[key]}
							</p>
							<SimpleAutocompleteInput<DishCategoryResponse>
								fetchFunction='dishCategory'
								setItem={setCategory}
								isVisibleCard={false}
								item={dish.category}
							/>
						</div>
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
