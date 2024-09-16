import DayWeek from '@/components/home/DayWeak'

import { DayOfWeekUkr, MenuItemResponse } from '@/types/menuItem.type'

import styles from './HomePage.module.scss'

const Home = ({ items }: { items: MenuItemResponse[] }) => {
	const daysOfWeek = Object.keys(DayOfWeekUkr).filter(
		days => days !== 'SATURDAY' && days !== 'SUNDAY'
	)

	return (
		<div className={styles.mainContent}>
			{daysOfWeek.map(day => {
				const daysWeekItems = items.filter(item => item.dayOfWeek === day)
				return (
					<DayWeek
						key={day}
						items={daysWeekItems}
						day={day}
					/>
				)
			})}
		</div>
	)
}

export default Home
