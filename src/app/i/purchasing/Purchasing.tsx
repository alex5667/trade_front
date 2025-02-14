'use client'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import WeekChangeButtons from '@/components/weekChangeButtons/WeekChangeButtons'

import { AgregateType, PurshaingDataFilters } from '@/types/purchasing.type'

import { getDatesOfWeek } from '@/utils/getDatesOfWeek'

import NullableIngredientsList from './NullableIngredientsList'
import PurchasingAggregate from './PurshasingAggregate'
import PurchasingDetail from './PurshasingDetail'
import { useGetAllPurchasingQuery } from '@/services/purchasing.service'

const Purchasing = () => {
	const [weekOffset, setWeekOffset] = useState(0)
	const [weekOffsetForCalculate, setWeekOffsetForCalculate] = useState(0)
	const [aggregate, setAggregate] = useState<AgregateType>('byDay')
	const { startOfWeek, endOfWeek } = getDatesOfWeek(weekOffset)
	const {
		startOfWeek: startDateForCalculation,
		endOfWeek: endDateForCalculation
	} = getDatesOfWeek(weekOffsetForCalculate)

	const { data, isLoading, refetch } = useGetAllPurchasingQuery({
		startDate: startOfWeek,
		endDate: endOfWeek,
		startDateForCalculation,
		endDateForCalculation,
		aggregate
	} as PurshaingDataFilters)
	const totalIngredientByWeek = data ? data.totalIngredientByWeek : undefined
	const weekDishes = data ? data.weekDishes : undefined
	const nullableIngredientsInDishes = data
		? data.nullableIngredientsInDishes
		: undefined

	useEffect(() => {
		refetch()
	}, [refetch, weekOffset, weekOffsetForCalculate])

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
			<div>
				<Button onClick={getByDay}>По дням</Button>
				<Button onClick={getByInstitution}>По точкам</Button>
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
