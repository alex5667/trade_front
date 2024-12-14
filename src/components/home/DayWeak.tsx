'use client'

import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

import { MealResponse } from '@/types/meal.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import styles from './Home.module.scss'
import MealCategory from './MealCategory'

interface DayWeekProps {
	items: MenuItemResponse[]
	dateOfDay: string
	label: string
	mealRefs: React.MutableRefObject<{ [mealSlug: string]: HTMLDivElement[] }>
	maxHeights: { [mealSlug: string]: number }
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.7 }
	}
}

const childVariants = {
	hidden: { x: '-100%', opacity: 0 },
	visible: (custom: number) => ({
		x: 0,
		opacity: 1,

		transition: {
			delay: (custom + 1) * 0.7,
			duration: 0.7,
			type: 'spring',
			damping: 13,
			stiffness: 100,
			bounce: 0.5
		}
	})
}

export const DayWeek = forwardRef<HTMLDivElement, DayWeekProps>(
	({ items, dateOfDay, label, mealRefs, maxHeights }, ref) => {
		const meals = useTypedSelector(state => state.mealSlice.items)
		const formattedDate = dateOfDay
			? dayjs(dateOfDay).format('DD-MM-YYYY')
			: 'Нет даты'
		// if (isLoading) return <Loader />

		return (
			<motion.div
				className={styles.dayWeekCOlumn}
				initial='hidden'
				animate='visible'
				variants={containerVariants}
				layout
				ref={ref}
			>
				<motion.div
					className={styles.dayContainer}
					variants={childVariants}
				>
					<h2 className={styles.dayWeekTitle}>{label}</h2>
					<span className={styles.formattedDate}>{formattedDate}</span>
				</motion.div>

				{meals &&
					meals.map((meal, index) => {
						const itemsDishes = items.filter(item => {
							const isString = typeof item?.meal === 'string'
							if (isString) {
								return item.meal === meal.slug
							}
							return (item?.meal as MealResponse)?.slug === meal.slug
						})

						if (itemsDishes.length > 0) {
							return (
								<motion.div
									custom={index}
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
									variants={childVariants}
								>
									<MealCategory
										items={itemsDishes}
										meal={meal.printName}
									/>
								</motion.div>
							)
						}
						return null
					})}
			</motion.div>
		)
	}
)
DayWeek.displayName = 'DayWeek'

export const MDayWeek = motion.create(DayWeek)
