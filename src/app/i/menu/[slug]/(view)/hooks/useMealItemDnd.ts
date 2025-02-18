import { useActions } from '@/hooks/useActions'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { useUpdateOrderMenuItemMutation } from '@/services/menu-item.service'
import { MealResponse } from '@/types/meal.type'
import { DropResult } from '@hello-pangea/dnd'

export function useMealItemDnd() {
	const { addAllMenuItems } = useActions()
	const items = useTypedSelector(state => state.menuSlice.items)
	const [mutate] = useUpdateOrderMenuItemMutation()

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result
		console.log('source', source)

		const [meal, date, institution] = source.droppableId.split('+')


		const sortedItems = items.filter((item) => {
			const isMealString = typeof item.meal === 'string'
			const mealItem = isMealString ? item.meal as string : (item.meal as MealResponse)?.slug

			// Убеждаемся, что дата существует

			// Преобразуем даты к формату YYYY-MM-DD
			const formattedDate = date.split('T')[0].trim().toLowerCase()
			const formattedItemDate = item.date.split('T')[0].trim().toLowerCase()

			// Сравниваем значения
			return mealItem?.toLowerCase().trim() === meal.toLowerCase().trim() && formattedDate == formattedItemDate
		})


		console.log('sortedItems', sortedItems)
		if (!destination || !sortedItems) {
			return
		}
		if (source.droppableId !== destination.droppableId) {
			return
		}
		if (source.index !== destination.index) {
			const newItems = Array.from(sortedItems)
			const [movedItem] = newItems.splice(source.index, 1)
			console.log('movedItem', movedItem)
			newItems.splice(destination.index, 0, movedItem)

			const updatedItems = newItems.map((item, index) => ({
				...item,
				dishOrder: index + 1
			}))
			console.log(updatedItems)

			addAllMenuItems(updatedItems)

			const updatedIds = updatedItems.map(item => ({
				id: item.id!,
				dishOrder: item.dishOrder,
			}))

			mutate(updatedIds)
		}
	}

	return { onDragEnd }
}
