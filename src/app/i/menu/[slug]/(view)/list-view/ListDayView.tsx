'use client'

import WeekDay from '@/components/menu-edit/WeekDay'
import Loader from '@/components/ui/Loader'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek } from '@/types/menuItem.type'

import { ListRowParent } from './ListRowParent'
import { useGetAllMealsQuery } from '@/services/meal.service'

interface ListDayView {
	day: DayOfWeek
	label: string
	institutionSlug: string
	datesOfWeek: { [key: string]: string }
}

const ListDayView = ({
	day,
	label,
	institutionSlug,
	datesOfWeek
}: ListDayView) => {
	const { data: meals, isLoading, isError } = useGetAllMealsQuery()
	if (isLoading) return <Loader />
	if (isError) return <div>Error loading meals</div>

	const dateForDay = datesOfWeek[day]
	return (
		<>
			<WeekDay
				dateForDay={dateForDay}
				day={label}
			/>

			{meals && meals.length > 0 ? (
				meals.map((meal: MealResponse) => (
					<ListRowParent
						label={meal.printName}
						mealSlug={meal.slug}
						key={meal.id}
						day={day}
						institutionSlug={institutionSlug}
						dateForDay={dateForDay}
					/>
				))
			) : (
				<p>No meals available</p>
			)}
		</>
	)
}

export default ListDayView
