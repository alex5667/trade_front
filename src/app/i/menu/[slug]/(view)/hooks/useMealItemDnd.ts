import { DropResult } from '@hello-pangea/dnd'


import { useActions } from '@/hooks/useActions'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { useUpdateOrderMenuItemMutation } from '@/services/menu-item.service'


export function useMealItemDnd() {
	const { addAllMenuItems } = useActions()

	const items = useTypedSelector(state => state.menuSlice.items)
	const [mutate] = useUpdateOrderMenuItemMutation()

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result


		if (!destination || !items) {
			return
		}

		if (source.index !== destination.index) {
			const newItems = Array.from(items)
			const [movedItem] = newItems.splice(source.index, 1)
			newItems.splice(destination.index, 0, movedItem)
			addAllMenuItems(newItems)
			const ids = newItems.map(item => item.id ? +item.id : 100)
			mutate(ids)
		}
	}

	return { onDragEnd }
}
