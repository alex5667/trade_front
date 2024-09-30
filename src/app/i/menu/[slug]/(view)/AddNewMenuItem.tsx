import cn from 'clsx'
import { memo } from 'react'

import { DayOfWeek, MenuItemResponse } from '@/types/menuItem.type'

import { useActions } from '@/hooks/useActions'

import { TypeView } from './MenuView'

interface AddNewMenuItem {
	day: DayOfWeek
	dateForDay: string | undefined
	view: TypeView
	institutionSlug: string
	mealSlug: string
}

const AddNewMenuItem = ({
	day,
	view,
	dateForDay,
	institutionSlug,
	mealSlug
}: AddNewMenuItem) => {
	const { addMenuItem } = useActions()

	const addRow = async () => {
		// const dayJs = dateForDay && dayjs(dateForDay)
		// if (!dayJs) {
		// 	console.error('Invalid date')
		// 	return
		// }

		// const newDate = dayJs.format()

		const addedMenuItem: MenuItemResponse = {
			dayOfWeek: day,
			date: dateForDay!,
			dishOrder: 100,
			dish: 'Введите наименование блюда',
			institution: institutionSlug,
			meal: mealSlug,
			createdAt: new Date().toUTCString()
		}
		addMenuItem(addedMenuItem)
	}

	return (
		<div
			className={cn('rounded-sm', {
				'mt-5': view === 'kanban'
			})}
		>
			<button
				onClick={addRow}
				disabled={!dateForDay}
				className={cn(
					'italic opacity text-sm font-thin rounded-sm px-8 py-1 dark:bg-primary-color bg-hover-light dark:text-text-color-on-primary relative inline-flex items-center justify-center overflow-hidden transition-all group',
					{
						'block min-w-full': view === 'kanban'
					}
				)}
			>
				<span className='w-0 h-0 rounded dark:bg-bg-button-hover bg-primary-hover-color absolute top-0 left-0 ease-out duration-300 transition-all group-hover:w-full group-hover:h-full -z-1'></span>
				<span className='w-full transition-colors duration-300 ease-in-out group-hover:text-text-color-on-primary z-10'>
					Добавить блюдо...
				</span>
			</button>
		</div>
	)
}
export default memo(AddNewMenuItem)
