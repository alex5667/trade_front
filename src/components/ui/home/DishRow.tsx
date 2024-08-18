import { memo } from 'react'

import styles from './Home.module.scss'

const DishRow = memo(({ name }: { name: string }) => {
	return (
		<>
			<li className={styles.dishRow}>
				<span className={styles.dishRowSpan}>{name}</span>
			</li>
		</>
	)
})

export default DishRow

DishRow.displayName = 'DishRow'
