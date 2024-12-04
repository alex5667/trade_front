import { memo } from 'react'

import WeekDay from '@/components/menu-edit/WeekDay'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek } from '@/types/menuItem.type'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import MealParent from './MealParent'

interface DayView {
	day: DayOfWeek
	label: string
	datesOfWeek: { [key: string]: string }
}

const DayView = ({ day, label, datesOfWeek }: DayView) => {
	const meals = useTypedSelector(state => state.mealSlice.items)
	const dateForDay = datesOfWeek[day]
	return (
		<div className='w-full flex flex-col items-center justify-start py-3'>
			<WeekDay
				dateForDay={dateForDay}
				day={label}
			/>

			{meals && meals.length > 0 ? (
				meals.map((meal: MealResponse) => (
					<MealParent
						label={meal.printName}
						mealSlug={meal.slug}
						key={meal.id}
						dateForDay={dateForDay}
					/>
				))
			) : (
				<p>No meals available</p>
			)}
		</div>
	)
}

export default memo(DayView)
