'use client'

import { useLayoutEffect, useRef, useState } from 'react'

import DayWeek from '@/components/home/DayWeak'

import { MenuItemResponse } from '@/types/menuItem.type'

import { dayColumns } from '../i/menu/[slug]/(view)/columns.data'

import styles from './HomePage.module.scss'
import { useGetAllMealsQuery } from '@/services/meal.service'

export default function CustomerMenu({ items }: { items: MenuItemResponse[] }) {
	const [maxHeights, setMaxHeights] = useState<{ [mealSlug: string]: number }>(
		{}
	)
	const mealRefs = useRef<{ [mealSlug: string]: HTMLDivElement[] }>({})

	const { data: meals, isLoading } = useGetAllMealsQuery()

	useLayoutEffect(() => {
		if (window.innerWidth < 1050) return
		if (!meals) return

		const newMaxHeights: { [mealSlug: string]: number } = {}

		meals.forEach(meal => {
			const refsForMeal = mealRefs.current[meal.slug] || []
			const heights = refsForMeal.map(ref => ref?.offsetHeight || 0)
			newMaxHeights[meal.slug] = Math.max(...heights)
		})

		setMaxHeights(newMaxHeights)
	}, [items, meals])

	return (
		<div className={styles.mainContent}>
			{dayColumns().map(column => {
				const daysWeekItems = items.filter(
					item => item.dayOfWeek === column.value
				)

				const dateOfDay =
					daysWeekItems.length > 0 ? daysWeekItems[0].date : 'Немає дати'
				return (
					daysWeekItems &&
					daysWeekItems.length > 0 && (
						<DayWeek
							key={column.value}
							items={daysWeekItems}
							dateOfDay={dateOfDay}
							label={column.label}
							mealRefs={mealRefs}
							maxHeights={maxHeights}
						/>
					)
				)
			})}
		</div>
	)
}
