'use client'

import NextWeekDay from '@/components/menu-edit/NextWeekDay'
import Loader from '@/components/ui/Loader'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek } from '@/types/menuItem.type'

import { ListRowParent } from './ListRowParent'
import { useGetAllMealsQuery } from '@/services/meal.service'

interface ListDayView {
	day: DayOfWeek
	label: string
	institutionSlug: string
}

const ListDayView = ({ day, label, institutionSlug }: ListDayView) => {
	const { data: meals, isLoading, isError } = useGetAllMealsQuery()
	if (isLoading) return <Loader />
	if (isError) return <div>Error loading meals</div>
	return (
		<div>
			<div>
				<h2>{label}</h2>
				<NextWeekDay day={day} />
			</div>

			{meals && meals.length > 0 ? (
				meals.map((meal: MealResponse) => (
					<ListRowParent
						label={meal.printName}
						mealSlug={meal.slug}
						key={meal.id}
						day={day}
						institutionSlug={institutionSlug}
					/>
				))
			) : (
				<p>No meals available</p>
			)}
		</div>
	)
}

export default ListDayView
