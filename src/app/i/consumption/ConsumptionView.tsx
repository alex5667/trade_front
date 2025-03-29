'use client'

import { Dispatch, SetStateAction, useState } from 'react'

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
	> = value => {
		setStartEndDate(prev => {
			// Обрабатываем оба случая: если `value` - это функция, вызываем её
			const newValue = typeof value === 'function' ? value(prev) : value

			// Предотвращаем лишние обновления
			if (
				prev?.startOfWeek === newValue?.startOfWeek &&
				prev?.endOfWeek === newValue?.endOfWeek
			) {
				return prev
			}
			return newValue
		})
	}

	const { data, isFetching, isLoading } = useGetAllMealConsumptionsQuery(
		{
			startDate: startEndDate?.startOfWeek,
			endDate: startEndDate?.endOfWeek
		} as MealConsumptionDataFilters,
		{
			skip: !startEndDate?.startOfWeek || !startEndDate?.endOfWeek
		}
	)

	const { isLoading: isLoadingMeals } = useGetAllMealsQuery()

	const isLoadingData =
		isLoading || isFetching || isLoadingMeals || isLoadingInstitutions

	if (isLoadingData) {
		return <Loader />
	}

	return (
		<div className={styles.wrapper}>
			<WeekChangeButtonsWithDates setStartEndDate={handleSetStartEndDate} />

			{!startEndDate?.datesOfWeek ? (
				<p>Выберите неделю для просмотра данных</p>
			) : !data && !isLoadingData ? (
				<p>Нет данных ...</p>
			) : (
				startEndDate?.datesOfWeek &&
				dayColumns().map(column => (
					<DayView
						label={column.label}
						day={column.value}
						key={column.value}
						datesOfWeek={startEndDate?.datesOfWeek}
					/>
				))
			)}
		</div>
	)
}

export default ConsumptionView
