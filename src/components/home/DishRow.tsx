import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { memo, useEffect, useState } from 'react'

import styles from './Home.module.scss'

const DishRow = memo(({ name }: { name: string }) => {
	const { scrollY } = useScroll()
	const [isMobile, setIsMobile] = useState(false)
	const [isScrolling, setIsScrolling] = useState(false)

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 1050)
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolling(true)
			setTimeout(() => setIsScrolling(false), 200)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const springScrollY = useSpring(scrollY, { stiffness: 100, damping: 20 })
	const scale = useTransform(
		springScrollY,
		[0, 300],
		isScrolling ? [1, 1.05] : [1.05, 1]
	)

	return (
		<motion.li
			className={styles.dishRow}
			style={isMobile ? { scale } : undefined}
		>
			<span className={styles.dishRowSpan}>{name}</span>
		</motion.li>
	)
})

DishRow.displayName = 'DishRow'
export default DishRow
