import { motion, useScroll, useTransform } from 'framer-motion'
import { memo, useRef } from 'react'

import styles from './Home.module.scss'

const DishRow = memo(({ name }: { name: string }) => {
	// const { scrollY } = useScroll()
	// const [isMobile, setIsMobile] = useState(false)
	// const [isScrolling, setIsScrolling] = useState(false)
	const ref = useRef(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['0 0', '0 0.15']
	})
	const opacityRow = useTransform(scrollYProgress, [0, 1], [0.25, 1])

	// useEffect(() => {
	// 	const handleResize = () => setIsMobile(window.innerWidth < 1050)
	// 	handleResize()
	// 	window.addEventListener('resize', handleResize)
	// 	return () => window.removeEventListener('resize', handleResize)
	// }, [])

	// useEffect(() => {
	// 	const handleScroll = () => {
	// 		setIsScrolling(true)
	// 		setTimeout(() => setIsScrolling(false), 200)
	// 	}

	// 	window.addEventListener('scroll', handleScroll)
	// 	return () => window.removeEventListener('scroll', handleScroll)
	// }, [])

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
