'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'

import { MDayWeek } from '@/components/home/DayWeak'
import Loader from '@/components/ui/Loader'

import { MenuItemResponse } from '@/types/menuItem.type'

import { dayColumns } from '../i/menu/[slug]/(view)/columns.data'

import styles from './HomePage.module.scss'
import { useGetAllMealsQuery } from '@/services/meal.service'

export default function CustomerMenu({ items }: { items: MenuItemResponse[] }) {
	const { data: meals, isLoading } = useGetAllMealsQuery()

	const mealRefs = useRef<{ [mealSlug: string]: HTMLDivElement[] }>({})
	const [maxHeights, setMaxHeights] = useState<{ [mealSlug: string]: number }>(
		{}
	)
	const { scrollYProgress } = useScroll()
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 200,
		damping: 20,
		restDelta: 0.001
	})
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
	if (isLoading) return <Loader />

	return (
		<div className={styles.mainContent}>
			<motion.div
				className={styles.progress}
				style={{ scaleX }}
			/>

			{dayColumns().map(column => {
				const daysWeekItems = items.filter(
					item => item.dayOfWeek === column.value
				)
				const dateOfDay =
					daysWeekItems.length > 0 ? daysWeekItems[0].date : 'Немає дати'
				return (
					daysWeekItems &&
					daysWeekItems.length > 0 && (
						<MDayWeek
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
