'use client'

import WeekDay from '@/components/menu-edit/WeekDay'
import Loader from '@/components/ui/Loader'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek, DayOfWeekUkr } from '@/types/menuItem.type'

import { ListRowParent } from './ListRowParent'
import { useGetAllMealsQuery } from '@/services/meal.service'

interface ListDayView {
	day: DayOfWeek
	label: string
	institutionSlug: string
	datesOfWeek: string[]
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
	const dayIndex = Object.keys(DayOfWeekUkr).findIndex(
		key => key === day.toUpperCase()
	)
	const dateForDay = datesOfWeek[dayIndex]
	return (
		<div>
			<div>
				<h2>{label}</h2>
				<WeekDay
					dateForDay={dateForDay}
					day={day}
				/>
			</div>

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
		</div>
	)
}

export default ListDayView
