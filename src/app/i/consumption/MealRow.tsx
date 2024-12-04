import { memo } from 'react'

import { MealConsumptionResponse } from '@/types/mealConsumption.type'

import ConsumptionInput from './ConsumptionInput'

interface MealRow {
	institutionSlug: string
	dateForDay: string
	mealSlug: string
	institutionName: string
	consumptionItem: MealConsumptionResponse | undefined
}

const MealRow = ({
	institutionSlug,
	dateForDay,
	mealSlug,
	institutionName,
	consumptionItem
}: MealRow) => {
	return (
		<div className='flex min-w-full'>
			<div className='text-base w-[50%] bg-db-row-light border border-border-light py-2 px-3'>
				{institutionName}
			</div>

			<ConsumptionInput
				institutionSlug={institutionSlug}
				consumptionItem={consumptionItem}
				dateForDay={dateForDay}
				mealSlug={mealSlug}
			/>
		</div>
	)
}

const areEqual = (prevProps: MealRow, nextProps: MealRow) => {
	const prevItem = prevProps.consumptionItem
	const nextItem = nextProps.consumptionItem

	if (!prevItem || !nextItem) {
		return true
	}

	return (
		prevItem.id === nextItem.id &&
		prevItem.createdAt === nextItem.createdAt &&
		prevItem.updatedAt === nextItem.updatedAt &&
		prevItem.date === nextItem.date &&
		prevItem.quantity === nextItem.quantity &&
		prevProps.institutionSlug === nextProps.institutionSlug &&
		prevProps.dateForDay === nextProps.dateForDay &&
		prevProps.mealSlug === nextProps.mealSlug &&
		prevProps.institutionName === nextProps.institutionName
	)
}
MealRow.displayName = 'MealRow'

export default memo(MealRow, areEqual)
