import { SetStateAction, memo } from 'react'

import { DishResponse } from '@/types/dish.type'

import DishInput from './DishInput'

interface DishCard {
	dish: DishResponse
	setDish?: (value: SetStateAction<DishResponse>) => void
}
const DishCard = memo(({ dish, setDish }: DishCard) => {
	console.log('dish', dish)
	if (!dish || Object.keys(dish).length === 0) {
		return <p>Блюдо не выбрано.</p>
	}
	return (
		<div className='w-full'>
			<h3>Детали :</h3>
			{(Object.keys(dish) as (keyof DishResponse)[]).map((key, index) => (
				<div
					key={key}
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
			))}
		</div>
	)
})

export default DishCard
DishCard.displayName = 'DishCard'
