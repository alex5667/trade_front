import WeekDay from '@/components/menu-edit/WeekDay'
import Loader from '@/components/ui/Loader'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek } from '@/types/menuItem.type'

import MealParent from './MealParent'
import { useGetAllMealsQuery } from '@/services/meal.service'

interface DayView {
	day: DayOfWeek
	label: string
	datesOfWeek: { [key: string]: string }
}

const DayView = ({ day, label, datesOfWeek }: DayView) => {
	const { data: meals, isLoading, isError } = useGetAllMealsQuery()

	if (isLoading) return <Loader />
	if (isError) return <div>Error loading meals</div>

	const dateForDay = datesOfWeek[day]
	return (
		<div className='w-full'>
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
						day={day}
						dateForDay={dateForDay}
					/>
				))
			) : (
				<p>No meals available</p>
			)}
		</div>
	)
}

export default DayView
