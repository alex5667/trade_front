import { forwardRef } from 'react'

import { DishResponse } from '@/types/dish.type'

import styles from './AutocompleteInput.module.scss'

type AutocompleteListProps = {
	dishes: DishResponse[]
	handleOptionSelect: (dish: DishResponse) => void
}

export const AutocompleteList = forwardRef<
	HTMLUListElement,
	AutocompleteListProps
>(({ dishes, handleOptionSelect }, ref) => {
	return (
		<ul
			ref={ref}
			className={styles.autocompleteList}
		>
			{dishes.map(dish => (
				<li
					key={dish.id}
					className={styles.autocompleteItem}
					onClick={() => handleOptionSelect(dish)}
				>
					{dish.name}
				</li>
			))}
		</ul>
	)
})

AutocompleteList.displayName = 'AutocompleteList'
