import DayWeek from '@/components/home/DayWeak'

import { MenuItemResponse } from '@/types/menuItem.type'

import { dayColumns } from '../i/menu/[slug]/(view)/columns.data'

import styles from './HomePage.module.scss'

const CustomerMenu = ({ items }: { items: MenuItemResponse[] }) => {
	return (
		<div className={styles.mainContent}>
			{dayColumns().map(column => {
				const daysWeekItems = items.filter(
					item => item.dayOfWeek === column.value
				)
				return (
					daysWeekItems &&
					daysWeekItems.length > 0 && (
						<DayWeek
							key={column.value}
							items={daysWeekItems}
							day={column.value}
							label={column.label}
						/>
					)
				)
			})}
		</div>
	)
}

export default CustomerMenu
