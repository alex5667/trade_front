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

		const sortedItems = [...items].filter((item) => {
			const isMealString = typeof item.meal === 'string'
			const mealItem = isMealString
				? item.meal
				: (item.meal as MealResponse)?.name as string

			// console.log('(mealItem as string).toLowerCase() === meal', (mealItem as string).toLowerCase() === meal)
			// console.log('(item.date === date', item.date === date)
			return (mealItem as string).toLowerCase() === meal && item.date === date
		})
		if (!destination || !sortedItems) {
			return
		}
		if (source.droppableId !== destination.droppableId) {
			return
		}
		// console.log('sortedItems', sortedItems)
		if (source.index !== destination.index) {
			const newItems = Array.from(sortedItems)
			const [movedItem] = newItems.splice(source.index, 1)
			newItems.splice(destination.index, 0, movedItem)

			const updatedItems = newItems.map((item, index) => ({
				...item,
				dishOrder: index + 1
			}))

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
