import dayjs from 'dayjs'

import { DayOfWeek } from '@/types/menuItem.type'

interface DateDayProps {
	day: DayOfWeek
	dateForDay: string
}

const WeekDay = ({ day, dateForDay }: DateDayProps) => {
	const formattedDate = dateForDay
		? dayjs(dateForDay).format('DD-MM-YYYY')
		: 'Нет даты'

	return (
		<div>
			<h3>{day}</h3>
			<div>{formattedDate}</div>
		</div>
	)
}

export default WeekDay
