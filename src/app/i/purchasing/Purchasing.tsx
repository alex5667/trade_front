'use client'

import { useState } from 'react'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import WeekChangeButtonsWithDates, {
	StartEnDWeek
} from '@/components/ui/weekChangeButtonsWithDates/WeekChangeButtonsWithDates'

import { AgregateType, PurshaingDataFilters } from '@/types/purchasing.type'

import NullableIngredientsList from './NullableIngredientsList'
import styles from './Purchasing.module.scss'
import PurchasingAggregate from './PurshasingAggregate'
import PurchasingDetail from './PurshasingDetail'
import { useGetAllPurchasingQuery } from '@/services/purchasing.service'

const Purchasing = () => {
	const [aggregate, setAggregate] = useState<AgregateType>('byDay')

	const [startEndDate, setStartEndDate] = useState<StartEnDWeek | undefined>()
	const [startEndDateForCulculate, setStartEndDateForCulculate] = useState<
		StartEnDWeek | undefined
	>()

	const { data, isLoading } = useGetAllPurchasingQuery(
		{
			startDate: startEndDate?.startOfWeek,
			endDate: startEndDate?.endOfWeek,
			startDateForCalculation: startEndDateForCulculate?.startOfWeek,
			endDateForCalculation: startEndDateForCulculate?.endOfWeek,
			aggregate
		} as PurshaingDataFilters,
		{
			skip: !startEndDate?.startOfWeek || !startEndDate?.endOfWeek
		}
	)
	const totalIngredientByWeek = data ? data.totalIngredientByWeek : undefined
	const weekDishes = data ? data.weekDishes : undefined
	const nullableIngredientsInDishes = data
		? data.nullableIngredientsInDishes
		: undefined

	if (isLoading) {
		return <Loader />
	}
	const getByDay = () => {
		setAggregate('byDay')
	}
	const getByInstitution = () => {
		setAggregate('byIstitution')
	}

	return (
		<div className={styles.container}>
			<div className={styles.btnContainer}>
				<div className={styles.weekChangeBtn}>
					<div className={styles.weekChangeBtnItem}>
						<p>На какую неделю считать</p>
						<WeekChangeButtonsWithDates setStartEndDate={setStartEndDate} />
					</div>
					<div className={styles.weekChangeBtnItem}>
						<p>По какой неделе считать</p>

						<WeekChangeButtonsWithDates
							setStartEndDate={setStartEndDateForCulculate}
						/>
					</div>
				</div>

				<div className={styles.getBtn}>
					<Button
						className='mb-2'
						onClick={getByDay}
					>
						По дням
					</Button>
					<Button onClick={getByInstitution}>По точкам</Button>
				</div>
			</div>

			{totalIngredientByWeek && (
				<PurchasingAggregate totalIngredientByWeek={totalIngredientByWeek} />
			)}

			{weekDishes && <PurchasingDetail weekDishes={weekDishes} />}

			{nullableIngredientsInDishes && (
				<NullableIngredientsList
					nullableIngredientsInDishes={nullableIngredientsInDishes}
				/>
			)}
		</div>
	)
}

export default Purchasing
