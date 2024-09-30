import dayjs from 'dayjs'

import { DayOfWeek } from '@/types/menuItem.type'

import { getDateForDay } from '@/utils/getDateForDay'

interface DateDayProps {
	day: DayOfWeek
}

const NextWeekDay = ({ day }: DateDayProps) => {
	const dateForDay = getDateForDay(day)
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

export default NextWeekDay
