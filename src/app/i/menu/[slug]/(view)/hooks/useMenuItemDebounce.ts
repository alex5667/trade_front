import { useCreateMenuItemMutation, useGetAllMenuItemQuery, useUpdateMenuItemMutation } from '@/services/menu-item.service'
import { DayOfWeek, MenuItemForm, TypeMenuItemFormState } from '@/types/menuItem.type'
import { debounce } from '@/utils/debounce'
import { useCallback, useEffect } from 'react'
import { UseFormWatch } from 'react-hook-form'

interface UseMenuItemDebounce {
	watch: UseFormWatch<TypeMenuItemFormState>
	item: MenuItemForm
}


export function useMenuItemDebounce({ watch, item }: UseMenuItemDebounce) {
	const [createMenuItem] = useCreateMenuItemMutation()
	const [updateMenuItem] = useUpdateMenuItemMutation()
	const { data } = useGetAllMenuItemQuery()


	const debouncedCreateMenuItem = useCallback(
		debounce((formData: MenuItemForm) => {

			createMenuItem(formData)
		}, 444),
		[item.id, createMenuItem]
	)

	const debouncedUpdateMenuItem = useCallback(
		debounce((formData: MenuItemForm) => {
			if (item.id) {
				updateMenuItem({ id: +item.id, data: formData })
			}
		}, 444),
		[item.id, updateMenuItem]
	)

	useEffect(() => {
		const subscription = watch(formData => {
			const formatData = transformToMenuItemForm(formData, item)
			if (item.id) {
				debouncedUpdateMenuItem({
					...formatData,
				})
			} else {
				debouncedCreateMenuItem(formatData)
			}
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [watch, item.id, debouncedUpdateMenuItem, debouncedCreateMenuItem])
}

const transformToMenuItemForm = (formData: TypeMenuItemFormState, item: MenuItemForm): MenuItemForm => {
	return {
		id: formData.id ? Number(formData.id) : undefined,
		meal: formData.meal ? { ...item, item.meal = formData.meal } : undefined,
		dayOfWeek: formData.dayOfWeek as DayOfWeek,
		date: formData.date,
		dish: formData.dish ? { ...formData.dish } : undefined,
		createdAt: formData.createdAt,
		institution: formData.institution ? { ...formData.institution } : undefined,
		description: formData.description,
		price: formData.price ? Number(formData.price) : undefined,
	}
}