'use client'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'
import WeekChangeButtons from '@/components/weekChangeButtons/WeekChangeButtons'

import { PurshaingDataFilters } from '@/types/purchasing.type'

import { getDatesOfWeek } from '@/utils/getDatesOfWeek'

import NullableIngredientsList from './NullableIngredientsList'
import PurchasingAggregate from './PurshasingAggregate'
import { useGetAllPurchasingQuery } from '@/services/purchasing.service'

const Purchasing = () => {
	const [weekOffset, setWeekOffset] = useState(0)
	const [weekOffsetForCalculate, setWeekOffsetForCalculate] = useState(0)
	const { startOfWeek, endOfWeek } = getDatesOfWeek(weekOffset)
	const {
		startOfWeek: startDateForCalculation,
		endOfWeek: endDateForCalculation
	} = getDatesOfWeek(weekOffsetForCalculate)

	const { data, isLoading, refetch } = useGetAllPurchasingQuery({
		startDate: startOfWeek,
		endDate: endOfWeek,
		startDateForCalculation,
		endDateForCalculation
	} as PurshaingDataFilters)
	const totalIngredientByWeek = data ? data.totalIngredientByWeek : undefined
	const nullableIngredientsInDishes = data
		? data.nullableIngredientsInDishes
		: undefined

	useEffect(() => {
		refetch()
	}, [refetch, weekOffset, weekOffsetForCalculate])

	if (isLoading) {
		return <Loader />
	}

	return (
		<div>
			<div>
				<span>{dayjs(startOfWeek).format('DD-MM-YYYY')}</span> |
				<span>{dayjs(endOfWeek).format('DD-MM-YYYY')}</span>
				<WeekChangeButtons setWeekOffset={setWeekOffset} />
			</div>
			<div>
				<span>{dayjs(startDateForCalculation).format('DD-MM-YYYY')}</span> |
				<span>{dayjs(endDateForCalculation).format('DD-MM-YYYY')}</span>
				<WeekChangeButtons setWeekOffset={setWeekOffsetForCalculate} />
			</div>
			{totalIngredientByWeek && (
				<PurchasingAggregate totalIngredientByWeek={totalIngredientByWeek} />
			)}
			{nullableIngredientsInDishes && (
				<NullableIngredientsList
					nullableIngredientsInDishes={nullableIngredientsInDishes}
				/>
			)}
		</div>
	)
}

export default Purchasing
