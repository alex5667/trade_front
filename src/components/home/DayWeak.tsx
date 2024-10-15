'use client'

import dayjs from 'dayjs'

import { MealResponse } from '@/types/meal.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import Loader from '../ui/Loader'

import styles from './Home.module.scss'
import MealCategory from './MealCategory'
import { useGetAllMealsQuery } from '@/services/meal.service'

interface DayWeekProps {
	items: MenuItemResponse[]
	dateOfDay: string
	label: string
	mealRefs: React.MutableRefObject<{ [mealSlug: string]: HTMLDivElement[] }>
	maxHeights: { [mealSlug: string]: number }
}

const DayWeek = ({
	items,
	dateOfDay,
	label,
	mealRefs,
	maxHeights
}: DayWeekProps) => {
	const { data: meals, isLoading } = useGetAllMealsQuery()
	const formattedDate = dateOfDay
		? dayjs(dateOfDay).format('DD-MM-YYYY')
		: 'Нет даты'
	if (isLoading) return <Loader />

	return (
		<div className={styles.dayWeekCOlumn}>
			<div className={styles.dayContainer}>
				<h2 className={styles.dayWeekTitle}>
					<span>{label}</span>
				</h2>
				<span>{formattedDate}</span>
			</div>

			{meals &&
				meals.map(meal => {
					const itemsDishes = items.filter(item => {
						const isString = typeof item?.meal === 'string'
						if (isString) {
							return item.meal === meal.slug
						}
						return (item?.meal as MealResponse)?.slug === meal.slug
					})

					return (
						<div
							key={meal.slug}
							ref={(el: HTMLDivElement | null) => {
								if (el) {
									if (!mealRefs.current[meal.slug]) {
										mealRefs.current[meal.slug] = []
									}
									mealRefs.current[meal.slug].push(el)
								}
							}}
							className={styles.mealTypeContainer}
							style={{
								height: maxHeights[meal.slug]
									? `${maxHeights[meal.slug]}px`
									: 'auto'
							}}
						>
							<MealCategory
								items={itemsDishes}
								meal={meal.printName}
							/>
						</div>
					)
				})}
		</div>
	)
}

export default DayWeek
