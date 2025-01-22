import { forwardRef } from 'react'

import styles from './SimpleAutocompleteInput.module.scss'

type AutocompleteListProps<T> = {
	data: T[]
	handleOptionSelect: (item: T) => void
}

export const SimpleAutocompleteList = forwardRef<
	HTMLUListElement,
	AutocompleteListProps<{ id: number; printName: string }>
>(({ data, handleOptionSelect }, ref) => {
	return (
		<ul
			ref={ref}
			className={styles.autocompleteList}
		>
			{data.map(item => (
				<li
					key={item.id}
					className={styles.autocompleteItem}
					onClick={() => handleOptionSelect(item)}
				>
					{item.printName}
				</li>
			))}
		</ul>
	)
})

SimpleAutocompleteList.displayName = 'SimpleAutocompleteList'
