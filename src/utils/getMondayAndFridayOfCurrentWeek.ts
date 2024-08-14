import dayjs from 'dayjs'

export const getMondayAndFridayOfCurrentWeek = () => {
	const today = dayjs()
	const monday = today.startOf('week').add(1, 'day')
	const friday = monday.add(4, 'day')
	return {
		monday: monday.format('YYYY-MM-DD'),
		friday: friday.format('YYYY-MM-DD')
	}
}