import { MealResponse } from '@/types/meal.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import { URLS } from '@/config/urls'

import styles from './Home.module.scss'
import MealType from './MealType'

interface DayWeek {
	items: MenuItemResponse[]
	day: string
	label: string
}

const DayWeek = async ({ items, day, label }: DayWeek) => {
	const mealTypes = await fetchMeals()
	return (
		<div className={styles.dayWeekCOlumn}>
			<h2 className={styles.dayWeekTitle}>
				<span>{label}</span>
			</h2>
			{mealTypes.map(meal => {
				const itemsDishes = items.filter(item => {
					const isString = typeof item?.meal === 'string'
					if (isString) {
						return item.meal === meal.slug
					}
					return (item?.meal as MealResponse)?.slug === meal.slug
				})
				return (
					<MealType
						key={meal.slug}
						items={itemsDishes}
						meal={meal.printName}
					/>
				)
			})}
		</div>
	)
}

export default DayWeek

export async function fetchMeals(): Promise<MealResponse[]> {
	const res = await fetch(`${process.env.BASE_URL}${URLS.MEALS}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (!res.ok) {
		throw new Error('Failed to fetch meal ...')
	}
	const data: MealResponse[] = await res.json()
	return data
}
