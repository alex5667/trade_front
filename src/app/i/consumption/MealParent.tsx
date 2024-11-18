import { MealConsumptionResponse } from '@/types/mealConsumption.type'
import { DayOfWeek } from '@/types/menuItem.type'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import styles from './ConsumptionPage.module.scss'
import MealRow from './MealRow'
import { useGetAllInstitutionsQuery } from '@/services/institution.service'

interface MealParentProps {
	label: string
	day: DayOfWeek
	mealSlug: string
	dateForDay: string
}

const MealParent = ({ label, day, mealSlug, dateForDay }: MealParentProps) => {
	const institutions = useGetAllInstitutionsQuery().data
	const items = useTypedSelector(state => state.mealConsumptionSlice.items)

	const filteredItems: MealConsumptionResponse[] = items.filter(
		item => item.date === dateForDay && item.meal && item.meal.slug === mealSlug
	)
	return (
		<div>
			<h4 className={styles.colHeading}>{label}</h4>

			{institutions &&
				institutions.length > 0 &&
				institutions.map(institution => {
					return (
						<MealRow
							institutionSlug={institution.slug}
							institutionName={institution.printName}
							key={institution.id}
							dateForDay={dateForDay}
							mealSlug={mealSlug}
							filteredItems={filteredItems}
						/>
					)
				})}
		</div>
	)
}

export default MealParent
