import cn from 'clsx'
import { memo } from 'react'

import { MealConsumptionResponse } from '@/types/mealConsumption.type'

import { useActions } from '@/hooks/useActions'

interface AddNewMenuItem {
	dateForDay: string
	mealSlug: string
}

const AddNewMealConsumption = ({ dateForDay, mealSlug }: AddNewMenuItem) => {
	const { addMealConsumption } = useActions()
	const createdAt = new Date().toUTCString() as string
	if (!dateForDay || !createdAt) return
	const addRow = async () => {
		const addedMealConsumption: MealConsumptionResponse = {
			date: dateForDay,
			institutionId: 1,
			mealId: 1,
			createdAt,
			quantity: 0
		}
		addMealConsumption(addedMealConsumption)
	}

	return (
		<div className={cn('rounded-sm mt-3 min-w-full')}>
			<button
				onClick={addRow}
				disabled={!dateForDay}
				className={cn(
					'italic text-sm w-full lg:w-[30%] font-thin rounded-sm px-8 py-3 sm:text-base tracking-wide  dark:bg-primary-color bg-hover-light dark:text-text-color-on-primary relative inline-flex items-center justify-center overflow-hidden transition-all group'
				)}
			>
				<span className='w-0 h-0 rounded dark:bg-bg-button-hover bg-primary-hover-color absolute top-0 left-0 ease-out duration-300 transition-all group-hover:w-full group-hover:h-full z-1'></span>
				<span className='w-full transition-colors duration-300 ease-in-out group-hover:text-bg-black relative z-10'>
					Добавить запись...
				</span>
			</button>
		</div>
	)
}
export default memo(AddNewMealConsumption)
