import { Draggable, Droppable } from '@hello-pangea/dnd'

import { DishResponse } from '@/types/dish.type'
import { InstitutionResponse } from '@/types/institution.type'
import { MealResponse } from '@/types/meal.type'
import { DayOfWeek, MenuItemResponse } from '@/types/menuItem.type'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import AddNewMenuItem from '../AddNewMenuItem'

import ListRow from './ListRow'
import styles from './ListView.module.scss'

interface ListRowParent {
	label: string
	day: DayOfWeek
	institutionSlug: string
	mealSlug: string
	dateForDay: string
}

export function ListRowParent({
	label,
	day,
	institutionSlug,
	mealSlug,
	dateForDay
}: ListRowParent) {
	const items = useTypedSelector(state => state.menuSlice.items)

	const filteredItems: MenuItemResponse[] | [] =
		items?.filter(item => {
			const isString = typeof item?.meal === 'string'

			if (isString) {
				return (
					item.dayOfWeek === day &&
					item.date === dateForDay &&
					item.meal === mealSlug &&
					item.institution === institutionSlug
				)
			} else {
				return (
					(item?.meal as MealResponse)?.slug === mealSlug &&
					item.dayOfWeek === day &&
					item.date === dateForDay &&
					(item.institution as InstitutionResponse)?.slug === institutionSlug
				)
			}
		}) || []

	const sortedItems = filteredItems.slice().sort((a, b) => {
		if (a.dishOrder !== undefined && b.dishOrder !== undefined) {
			return a.dishOrder - b.dishOrder
		}
		return (a.id || 0) - (b.id || 0)
	})

	return (
		<Droppable droppableId={mealSlug + dateForDay}>
			{provided => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className='mb-7 border-t dark:border-border'
				>
					<h4 className={styles.colHeading}>{label}</h4>
					{sortedItems &&
						sortedItems.length > 0 &&
						sortedItems.map((item: MenuItemResponse, index: number) => {
							const isDishString = typeof item.dish === 'string'
							const dishItem = isDishString
								? item.dish
								: (item.dish as DishResponse)?.name
							return (
								<Draggable
									key={item.id}
									draggableId={dishItem as string}
									index={index}
								>
									{provided => {
										return (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<ListRow
													key={item.id}
													item={item}
													institutionSlug={institutionSlug}
													mealSlug={mealSlug}
													dateForDay={dateForDay!}
												/>
											</div>
										)
									}}
								</Draggable>
							)
						})}

					{provided.placeholder}
					<AddNewMenuItem
						day={day}
						view='list'
						dateForDay={dateForDay}
						institutionSlug={institutionSlug}
						mealSlug={mealSlug}
					/>
				</div>
			)}
		</Droppable>
	)
}
