import dayjs from 'dayjs'

import styles from './WeekDay.module.scss'

interface DateDayProps {
	day: string
	dateForDay: string
}

const WeekDay = ({ day, dateForDay }: DateDayProps) => {
	const formattedDate = dateForDay
		? dayjs(dateForDay).format('DD-MM-YYYY')
		: 'Нет даты'

	return (
		<div className={styles.wrap}>
			<h3 className={styles.title}>{day}</h3>
			<span className={styles.date}>{formattedDate}</span>
		</div>
	)
}

export default WeekDay
