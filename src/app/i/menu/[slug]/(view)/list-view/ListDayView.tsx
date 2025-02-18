'use client'

import WeekDay from '@/components/menu-edit/WeekDay'
import Loader from '@/components/ui/Loader'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek, MenuItemResponse } from '@/types/menuItem.type'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import ListRowParent from './ListRowParent'
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
	const items = useTypedSelector(state => state.menuSlice.items)
	if (isLoading) return <Loader />
	if (isError) return <div>Error loading meals</div>
	const dateForDay = datesOfWeek[day]
	const dayItems: MenuItemResponse[] | [] =
		items?.filter(item => item.dayOfWeek === day && item.date === dateForDay) ||
		[]
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
						dayItems={dayItems}
					/>
				))
			) : (
				<p>No meals available</p>
			)}
		</>
	)
}

export default ListDayView
