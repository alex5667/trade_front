'use client'

import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState
} from 'react'

import Loader from '@/components/ui/Loader'
import WeekChangeButtonsWithDates, {
	StartEnDWeek
} from '@/components/ui/weekChangeButtonsWithDates/WeekChangeButtonsWithDates'

import { MealConsumptionDataFilters } from '@/types/mealConsumption.type'

import { dayColumns } from '../menu/[slug]/(view)/columns.data'

import styles from './ConsumptionPage.module.scss'
import DayView from './DayView'
import { useGetAllInstitutionsQuery } from '@/services/institution.service'
import { useGetAllMealConsumptionsQuery } from '@/services/meal-consumption.service'
import { useGetAllMealsQuery } from '@/services/meal.service'

const ConsumptionView = () => {
	const { isLoading: isLoadingInstitutions } = useGetAllInstitutionsQuery()
	const [startEndDate, setStartEndDate] = useState<StartEnDWeek | undefined>()

	const handleSetStartEndDate: Dispatch<
		SetStateAction<StartEnDWeek | undefined>
	> = useCallback(dates => setStartEndDate(dates), [])
	const { data, isFetching, isLoading, refetch } =
		useGetAllMealConsumptionsQuery({
			startDate: startEndDate?.startOfWeek,
			endDate: startEndDate?.endOfWeek
		} as MealConsumptionDataFilters)
	const { isLoading: isLoadingMeals } = useGetAllMealsQuery()

	useEffect(() => {
		refetch()
	}, [startEndDate?.startOfWeek, refetch])

	if (isLoading || isFetching || isLoadingMeals || isLoadingInstitutions) {
		return <Loader />
	}

	if (!data) {
		return <p>Нет данных ...</p>
	}

	return (
		<div className={styles.wrapper}>
			<WeekChangeButtonsWithDates setStartEndDate={handleSetStartEndDate} />

			{startEndDate?.datesOfWeek &&
				dayColumns().map(column => {
					return (
						<DayView
							label={column.label}
							day={column.value}
							key={column.value}
							datesOfWeek={startEndDate?.datesOfWeek}
						/>
					)
				})}
		</div>
	)
}

export default ConsumptionView
