'use client'

import { useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'

import { MealConsumptionDataFilters } from '@/types/mealConsumption.type'

import { getDatesOfWeek } from '@/utils/getDatesOfWeek'

import { dayColumns } from '../menu/[slug]/(view)/columns.data'

import styles from './ConsumptionPage.module.scss'
import DayView from './DayView'
import { useGetAllInstitutionsQuery } from '@/services/institution.service'
import { useGetAllMealConsumptionsQuery } from '@/services/meal-consumption.service'
import { useGetAllMealsQuery } from '@/services/meal.service'

const ConsumptionView = () => {
	const [weekOffset, setWeekOffset] = useState(0)
	const { startOfWeek, endOfWeek, datesOfWeek } = getDatesOfWeek(weekOffset)
	const { isLoading: isLoadingInstitutions } = useGetAllInstitutionsQuery()

	const { data, isFetching, isLoading, refetch } =
		useGetAllMealConsumptionsQuery({
			startDate: startOfWeek,
			endDate: endOfWeek
		} as MealConsumptionDataFilters)
	const { isLoading: isLoadingMeals } = useGetAllMealsQuery()

	const handleWeekChange = (direction: 'next' | 'prev') => {
		setWeekOffset(prev => (direction === 'next' ? prev + 1 : prev - 1))
	}
	useEffect(() => {
		refetch()
	}, [weekOffset, refetch])

	if (isLoading || isFetching || isLoadingMeals || isLoadingInstitutions) {
		return <Loader />
	}

	if (!data) {
		return <p>Нет данных ...</p>
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.btnWrapper}>
				<Button
					className='px-2 py-3 sm:px-4 sm:py-1'
					onClick={() => handleWeekChange('prev')}
				>
					Предыдущая неделя
				</Button>
				<Button
					className='px-2 py-3 sm:px-4 sm:py-1'
					onClick={() => handleWeekChange('next')}
				>
					Следующая неделя
				</Button>
			</div>

			{dayColumns().map(column => {
				return (
					<DayView
						label={column.label}
						day={column.value}
						key={column.value}
						datesOfWeek={datesOfWeek}
					/>
				)
			})}
		</div>
	)
}

export default ConsumptionView
