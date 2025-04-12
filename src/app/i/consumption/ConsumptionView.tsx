'use client'

import Loader from '@/components/ui/Loader'
import WeekChangeButtonsWithDates from '@/components/ui/weekChangeButtonsWithDates/WeekChangeButtonsWithDates'

import { useWeeklyNavigation } from '@/hooks/useWeeklyNavigation'

import { dayColumns } from '../menu/[slug]/(view)/columns.data'

import styles from './ConsumptionPage.module.scss'
import DayView from './DayView'
import { useGetAllInstitutionsQuery } from '@/services/institution.service'
import { useGetAllMealConsumptionsQuery } from '@/services/meal-consumption.service'
import { useGetAllMealsQuery } from '@/services/meal.service'

const ConsumptionView = () => {
	const { weekOffset, startEndDate, queryArgs, changeWeek } =
		useWeeklyNavigation()

	const { isLoading: isLoadingInstitutions } = useGetAllInstitutionsQuery()
	const { isLoading: isLoadingMeals } = useGetAllMealsQuery()
	const { data, isFetching, isLoading } =
		useGetAllMealConsumptionsQuery(queryArgs)

	const isLoadingData =
		isLoading || isFetching || isLoadingMeals || isLoadingInstitutions

	if (isLoadingData) return <Loader />

	return (
		<div className={styles.wrapper}>
			<WeekChangeButtonsWithDates
				weekOffset={weekOffset}
				onChangeWeek={changeWeek}
			/>

			{!startEndDate.datesOfWeek ? (
				<p>Выберите неделю для просмотра данных</p>
			) : !data && !isLoadingData ? (
				<p>Нет данных ...</p>
			) : (
				dayColumns().map(column => (
					<DayView
						key={column.value}
						label={column.label}
						day={column.value}
						datesOfWeek={startEndDate.datesOfWeek}
					/>
				))
			)}
		</div>
	)
}

export default ConsumptionView
