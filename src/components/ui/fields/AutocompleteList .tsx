import styles from './AutocompleteInput.module.scss'

type AutocompleteListProps = {
	dishes: { id: number; name: string }[]
	handleOptionSelect: (name: string, id: number) => void
	ref: React.RefObject<HTMLUListElement>
}

export const AutocompleteList = ({
	dishes,
	handleOptionSelect,
	ref
}: AutocompleteListProps) => {
	return (
		<ul
			ref={ref}
			className={styles.autocompleteList}
		>
			{dishes.map(dish => (
				<li
					key={dish.id}
					className={styles.autocompleteItem}
					onClick={() => handleOptionSelect(dish.name, dish.id)}
				>
					{dish.name}
				</li>
			))}
		</ul>
	)
}
