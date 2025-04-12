import { memo } from 'react'

import WeekDay from '@/components/ui/WeekDay'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek } from '@/types/menuItem.type'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import styles from './ConsumptionPage.module.scss'
import MealParent from './MealParent'

interface DayView {
	day: DayOfWeek
	label: string
	datesOfWeek: { [key: string]: string } | undefined
}

const DayView = ({ day, label, datesOfWeek }: DayView) => {
	const meals = useTypedSelector(state => state.mealSlice.items)
	const dateForDay = datesOfWeek ? datesOfWeek[day] : ''
	return (
		<div className={styles.dayViewWrapper}>
			<WeekDay
				dateForDay={dateForDay}
				day={label}
			/>

			{meals && meals.length > 0 ? (
				meals.map((meal: MealResponse) => (
					<MealParent
						label={meal.printName}
						mealId={meal.id}
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
