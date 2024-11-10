import { useGetInstitutionBySlugQuery } from '@/services/institution.service'
import { useGetMealBySlugQuery } from '@/services/meal.service'
import { useCreateMenuItemMutation, useUpdateMenuItemMutation } from '@/services/menu-item.service'
import { MenuItemResponse } from '@/types/menuItem.type'
import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react'

export function useOptionSelect(
	item: MenuItemResponse,
	institutionSlug: string,
	mealSlug: string,
	dateForDay: string,
	setInputValue: (value: SetStateAction<string>) => void,
	setDebouncedValue: (value: SetStateAction<string>) => void,
	setShouldFetch: (value: SetStateAction<boolean>) => void,
	setIsShow: Dispatch<SetStateAction<boolean>>,
	inputRef: MutableRefObject<HTMLTextAreaElement | null>
) {
	const [updateMenuItem] = useUpdateMenuItemMutation()
	const [createMenuItem] = useCreateMenuItemMutation()
	const { data: institution } = useGetInstitutionBySlugQuery(institutionSlug)
	const { data: meal } = useGetMealBySlugQuery(mealSlug)



	const handleOptionSelect = useCallback(
		(option: string, dishId: number) => {
			setInputValue(option)
			setDebouncedValue(option)
			setShouldFetch(true)
			setTimeout(() => setIsShow(false), 200)
			if (inputRef.current) {
				inputRef.current.blur()
			}

			if (!institution || !meal) return

			const updatedData = {
				...item,
				date: dateForDay,
				dishId,
				institutionId: institution.id,
				mealId: meal.id
			}

			if (item.id) {
				updateMenuItem({ id: item.id, data: updatedData })
			} else {
				createMenuItem(updatedData)
			}
		},
		[item, dateForDay, updateMenuItem, createMenuItem, setInputValue, setDebouncedValue, setShouldFetch, setIsShow, institution, meal, inputRef]
	)

	return handleOptionSelect
}


