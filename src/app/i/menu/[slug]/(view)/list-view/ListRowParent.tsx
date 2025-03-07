import { Draggable, Droppable } from '@hello-pangea/dnd'
import { memo, useMemo } from 'react'

import { DishResponse } from '@/types/dish.type'
import { InstitutionResponse } from '@/types/institution.type'
import { MealResponse } from '@/types/meal.type'
import { DayOfWeek, MenuItemResponse } from '@/types/menuItem.type'

import AddNewMenuItem from '../AddNewMenuItem'

import ListRow from './ListRow'
import styles from './ListView.module.scss'

interface ListRowParent {
	label: string
	day: DayOfWeek
	institutionSlug: string
	mealSlug: string
	dateForDay: string
	dayItems: MenuItemResponse[] | []
}

function ListRowParent({
	label,
	day,
	institutionSlug,
	mealSlug,
	dateForDay,
	dayItems
}: ListRowParent) {
	const itemsFilteredByMealAndInstitution = useMemo(() => {
		return (
			dayItems?.filter(item => {
				const isString = typeof item?.meal === 'string'
				if (isString) {
					return item.meal === mealSlug && item.institution === institutionSlug
				} else {
					return (
						(item?.meal as MealResponse)?.slug === mealSlug &&
						(item.institution as InstitutionResponse)?.slug === institutionSlug
					)
				}
			}) || []
		)
	}, [dayItems, mealSlug, institutionSlug])

	const sortedItems = useMemo(() => {
		return itemsFilteredByMealAndInstitution.slice().sort((a, b) => {
			if (a.dishOrder !== undefined && b.dishOrder !== undefined) {
				return a.dishOrder - b.dishOrder
			}
			return (a.id || 0) - (b.id || 0)
		})
	}, [itemsFilteredByMealAndInstitution])

	const droppableId = `${mealSlug} + ${dateForDay}+${institutionSlug}`

	return (
		<Droppable
			droppableId={droppableId}
			type={droppableId}
		>
			{provided => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className='mb-4 border-t dark:border-border'
				>
					<h4 className={styles.colHeading}>{label}</h4>
					{sortedItems &&
						sortedItems.length > 0 &&
						sortedItems.map((item: MenuItemResponse, index: number) => {
							const isDishString = typeof item.dish === 'string'
							const dishItem = isDishString
								? item.dish
								: (item.dish as DishResponse)?.name
							const draggableId = `${dishItem as string} + ${dateForDay}`

							return (
								<Draggable
									key={item.id}
									draggableId={draggableId}
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

function arrEqual(
	prevItems: MenuItemResponse[],
	nextItems: MenuItemResponse[]
): boolean {
	// Если массивы разной длины, они не равны
	if (prevItems.length !== nextItems.length) return false

	return prevItems.every((prevItem, index) => {
		const nextItem = nextItems[index]

		// Проверяем каждое ключевое поле для сравнения
		return (
			prevItem.id === nextItem.id &&
			prevItem.dishOrder === nextItem.dishOrder &&
			prevItem.date === nextItem.date &&
			prevItem.dayOfWeek === nextItem.dayOfWeek &&
			prevItem.meal === nextItem.meal &&
			prevItem.institution === nextItem.institution &&
			prevItem.dish === nextItem.dish &&
			prevItem.price === nextItem.price &&
			prevItem.description === nextItem.description
		)
	})
}
export default memo(ListRowParent, (prevProps, nextProps) => {
	return (
		prevProps.label === nextProps.label &&
		prevProps.day === nextProps.day &&
		prevProps.institutionSlug === nextProps.institutionSlug &&
		prevProps.mealSlug === nextProps.mealSlug &&
		prevProps.dateForDay === nextProps.dateForDay &&
		arrEqual(prevProps.dayItems, nextProps.dayItems)
	)
})
