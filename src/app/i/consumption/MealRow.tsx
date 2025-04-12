import { memo } from 'react'

import { MealConsumptionResponse } from '@/types/meal-consumption.type'

import ConsumptionInput from './ConsumptionInput'
import styles from './ConsumptionPage.module.scss'

interface MealRow {
	institutionId: number
	dateForDay: string
	mealId: number
	institutionName: string
	consumptionItem: MealConsumptionResponse | undefined
}

const MealRow = ({
	institutionId,
	dateForDay,
	mealId,
	institutionName,
	consumptionItem
}: MealRow) => {
	return (
		<div className={styles.mealRowWrapper}>
			<div className={styles.mealRowCell}>{institutionName}</div>
			<ConsumptionInput
				institutionId={institutionId}
				consumptionItem={consumptionItem}
				dateForDay={dateForDay}
				mealId={mealId}
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
		prevProps.institutionId === nextProps.institutionId &&
		prevProps.dateForDay === nextProps.dateForDay &&
		prevProps.mealId === nextProps.mealId &&
		prevProps.institutionName === nextProps.institutionName
	)
}
MealRow.displayName = 'MealRow'

export default memo(MealRow, areEqual)
