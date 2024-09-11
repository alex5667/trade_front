import {
	DayOfWeek,
	DayOfWeekUkr,
	MealTypes,
	MenuItemResponse
} from '@/types/menuItem.types'

import styles from './Home.module.scss'
import MealType from './MealType'

const DayWeek = ({
	items,
	day
}: {
	items: MenuItemResponse[]
	day: string
}) => {
	const mealTypes = Object.keys(MealTypes)
	const ukrDayOfWeek = DayOfWeekUkr[day as DayOfWeek]
	return (
		<div className={styles.dayWeekCOlumn}>
			<h2 className={styles.dayWeekTitle}>
				<span>{ukrDayOfWeek}</span>
			</h2>
			{mealTypes.map(meal => {
				const itemsDishes = items.filter(item => {
					return item.mealType.name === meal
				})
				return (
					<MealType
						key={meal}
						items={itemsDishes}
						meal={meal}
					/>
				)
			})}
		</div>
	)
}

export default DayWeek
