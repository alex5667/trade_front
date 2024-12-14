import { motion } from 'framer-motion'

import { DishResponse } from '@/types/dish.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import DishRow from './DishRow'
import styles from './Home.module.scss'

const MealCategory = ({
	items,
	meal
}: {
	items: MenuItemResponse[]
	meal: string
}) => {
	const sortedItems = items.slice().sort((a, b) => {
		if (a.dishOrder !== undefined && b.dishOrder !== undefined) {
			return a.dishOrder - b.dishOrder
		}
		return (a.id || 0) - (b.id || 0)
	})

	return (
		<motion.div className={styles.mealWrapper}>
			<h2 className={styles.mealTypeTitle}>{meal}</h2>
			{items && items.length > 0 ? (
				<ul>
					{sortedItems.map((item, idx) => {
						const isString = typeof item?.dish === 'string'
						const dishName = isString
							? item.dish
							: (item.dish as DishResponse).printName
						return (
							<DishRow
								key={idx}
								name={dishName as string}
							/>
						)
					})}
				</ul>
			) : (
				<p>No menu items available</p>
			)}
		</motion.div>
	)
}

export default MealCategory
