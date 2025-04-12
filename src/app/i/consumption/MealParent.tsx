import {
	selectInstitutionsWithConsumption,
	selectTotalQuantity
} from '@/store/meal-consumption/meal-consumption.selectors'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import styles from './ConsumptionPage.module.scss'
import MealRow from './MealRow'

interface MealParentProps {
	label: string
	mealId: number
	dateForDay: string
}

const MealParent = ({ label, mealId, dateForDay }: MealParentProps) => {
	// const filteredItems = useTypedSelector(selectFilteredMealConsumptions(dateForDay, mealSlug))
	const quantity = useTypedSelector(selectTotalQuantity(dateForDay, mealId))
	const institutionsWithConsumption = useTypedSelector(
		selectInstitutionsWithConsumption(dateForDay, mealId)
	)

	return (
		<div className={styles.mealParentWrapper}>
			<h4 className={styles.colHeading}>{label}</h4>

			{institutionsWithConsumption.map(institution => {
				// if (institution.consumptionItem) {
				return (
					<MealRow
						institutionId={institution.id}
						institutionName={institution.printName}
						key={institution.id}
						dateForDay={dateForDay}
						mealId={mealId}
						consumptionItem={institution.consumptionItem}
					/>
				)
				// }
			})}
			<div className={styles.totalRow}>
				<div className={styles.totalRowCell}>Итого:</div>
				<div className={styles.totalRowCellCenter}>{quantity}</div>
			</div>
		</div>
	)
}

export default MealParent
