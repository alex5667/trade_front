import dayjs from 'dayjs'

import DayWeek from '@/components/home/DayWeak'

import { MenuItemResponse } from '@/types/menuItem.type'

import { dayColumns } from '../i/menu/[slug]/(view)/columns.data'

import styles from './HomePage.module.scss'

const CustomerMenu = ({ items }: { items: MenuItemResponse[] }) => {
	const today = dayjs()
	const startOfThisWeek = today
		.startOf('week')
		.add(2, 'day')
		.utc()
		.startOf('day')
		.toISOString()
	const endOfThisWeek = today.endOf('week').utc().startOf('day').toISOString()
	console.log('startOfThisWeek', startOfThisWeek)
	console.log('endOfThisWeek', endOfThisWeek)
	return (
		<div className={styles.mainContent}>
			{dayColumns().map(column => {
				const daysWeekItems = items.filter(
					item => item.dayOfWeek === column.value
				)
				return (
					<DayWeek
						key={column.value}
						items={daysWeekItems}
						day={column.value}
						label={column.label}
					/>
				)
			})}
		</div>
	)
}

export default CustomerMenu
