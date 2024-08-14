import { MealTypes, MenuItemResponse } from '@/types/menuItem.types'

import { Heading } from '../Heading'

import MealType from './MealType'

const DayWeek = ({
	items,
	day
}: {
	items: MenuItemResponse[]
	day: string
}) => {
	const mealTypes = Object.keys(MealTypes)
	return (
		<div className='bg-secondary rounded-lg py-3 px-2'>
			<Heading
				title={day}
				size='base'
			/>
			{mealTypes.map(meal => {
				const itemsDishes = items.filter(item => item.mealType === meal)
				return (
					<MealType
						key={meal}
						items={itemsDishes}
						meal={meal}
					/>
				)
			})}
		</div>
	)
}

export default DayWeek
