import dayjs from 'dayjs'

interface DateDayProps {
	day: string
	dateForDay: string
}

const WeekDay = ({ day, dateForDay }: DateDayProps) => {
	const formattedDate = dateForDay
		? dayjs(dateForDay).format('DD-MM-YYYY')
		: 'Нет даты'

	return (
		<div className='w-full flex justify-between align-middle mb-2'>
			<h3 className='text-lg'>{day}</h3>
			<span className='text-base'>{formattedDate}</span>
		</div>
	)
}

export default WeekDay
