import { motion, useScroll, useTransform } from 'framer-motion'
import { memo, useRef } from 'react'

import styles from './Home.module.scss'

const DishRow = memo(({ name }: { name: string }) => {
	const ref = useRef(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['0 0', '0 0.25']
	})
	const opacityRow = useTransform(scrollYProgress, [0, 1], [0.2, 1])

	return (
		<motion.li
			ref={ref}
			className={styles.dishRow}
			style={{
				opacity: opacityRow
			}}
		>
			<span className={styles.dishRowSpan}>{name}</span>
		</motion.li>
	)
})

DishRow.displayName = 'DishRow'
export default DishRow
