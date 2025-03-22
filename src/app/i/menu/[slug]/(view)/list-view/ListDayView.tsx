import { memo } from 'react'

import Loader from '@/components/ui/Loader'
import WeekDay from '@/components/ui/WeekDay'

import { MealResponse } from '@/types/meal.type'
import { DayOfWeek } from '@/types/menuItem.type'

import { selectDayItems } from '@/store/menuItem/menu-item.selectors'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import ListRowParent from './ListRowParent'
import { useGetAllMealsQuery } from '@/services/meal.service'

interface ListDayViewProps {
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
}: ListDayViewProps) => {
	const { data: meals, isLoading, isError } = useGetAllMealsQuery()
	const dateForDay = datesOfWeek[day]

	const dayItems = useTypedSelector(selectDayItems(day, dateForDay))

	if (isLoading) return <Loader />
	if (isError) return <div>Error loading meals</div>

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

export default memo(ListDayView, (prevProps, nextProps) => {
	return (
		prevProps.label === nextProps.label &&
		prevProps.day === nextProps.day &&
		prevProps.institutionSlug === nextProps.institutionSlug &&
		prevProps.datesOfWeek[prevProps.day] ===
			nextProps.datesOfWeek[nextProps.day]
	)
})
