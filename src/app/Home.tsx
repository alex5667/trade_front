import DayWeek from '@/components/ui/home/DayWeak'

import { DayOfWeek, MenuItemResponse } from '@/types/menuItem.types'

const Home = ({ items }: { items: MenuItemResponse[] }) => {
	const daysOfWeek = Object.keys(DayOfWeek).filter(
		days => days !== 'SATURDAY' && days !== 'SUNDAY'
	)

	return (
		<div className='grid w-full grid-cols-5 justify-between gap-5'>
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
