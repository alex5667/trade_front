import { MealTypes, MenuItemResponse, TypeMeal } from '@/types/menuItem.type'

import DishRow from './DishRow'
import styles from './Home.module.scss'

const MealType = ({
	items,
	meal
}: {
	items: MenuItemResponse[]
	meal: string
}) => {
	const mealUkr = MealTypes[meal as TypeMeal]
	return (
		<div className={styles.mealTypeContainer}>
			<h2 className={styles.mealTypeTitle}>{mealUkr}</h2>
			{items && items.length > 0 ? (
				<ul>
					{items.map((item, idx) => (
						<DishRow
							key={idx}
							name={item.dish.printName ? item.dish.printName : 'noName'}
						/>
					))}
				</ul>
			) : (
				<p>No menu items available</p>
			)}
		</div>
	)
}

export default MealType
