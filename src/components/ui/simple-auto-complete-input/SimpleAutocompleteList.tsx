import { forwardRef } from 'react'

import styles from './SimpleAutocompleteInput.module.scss'

type AutocompleteItem = {
	id: number
	name?: string
	alias?: string
	[key: string]: any
}

type AutocompleteListProps<T extends AutocompleteItem> = {
	data: T[]
	handleOptionSelect: (item: T) => void
}

export const SimpleAutocompleteList = forwardRef<
	HTMLUListElement,
	AutocompleteListProps<AutocompleteItem>
>(({ data, handleOptionSelect }, ref) => {
	// Function to get display text (name or alias or any other identifier)
	const getDisplayText = (item: AutocompleteItem) => {
		if (item.name) return item.name
		if (item.alias) return item.alias
		// Fallback to first string property if name or alias is not available
		const stringProps = Object.entries(item)
			.filter(([_, value]) => typeof value === 'string')
			.map(([key, value]) => ({ key, value }))

		return stringProps.length > 0 ? stringProps[0].value : `Item ${item.id}`
	}

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
					{getDisplayText(item)}
				</li>
			))}
		</ul>
	)
})

SimpleAutocompleteList.displayName = 'SimpleAutocompleteList'
