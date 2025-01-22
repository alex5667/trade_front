import { useGetInstitutionBySlugQuery } from '@/services/institution.service'
import { useGetMealBySlugQuery } from '@/services/meal.service'
import { useCreateMenuItemMutation, useUpdateMenuItemMutation } from '@/services/menu-item.service'
import { DishResponse } from '@/types/dish.type'
import { InstitutionResponse } from '@/types/institution.type'
import { MenuItemResponse } from '@/types/menuItem.type'
import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react'

export function useOptionSelect(
	setInputValue: (value: SetStateAction<string | ''>) => void,
	setDebouncedValue: (value: SetStateAction<string>) => void,
	setShouldFetch: (value: SetStateAction<boolean>) => void,
	setIsShow: Dispatch<SetStateAction<boolean>>,
	inputRef: MutableRefObject<HTMLTextAreaElement | null>,
	item?: MenuItemResponse | undefined,
	institutionSlug?: string,
	mealSlug?: string,
	dateForDay?: string,
	isMenuItem?: boolean | undefined,
	setDish?: (value: SetStateAction<DishResponse>) => void,
) {
	const [updateMenuItem] = useUpdateMenuItemMutation()
	const [createMenuItem] = useCreateMenuItemMutation()

	const { data: institution } = useGetInstitutionBySlugQuery(institutionSlug || '', {
		skip: !institutionSlug,
	})
	const { data: meal } = useGetMealBySlugQuery(mealSlug || '', {
		skip: !mealSlug,
	})


	const handleOptionSelect = useCallback(
		(dish: DishResponse | InstitutionResponse) => {
			const { name: option, id: dishId } = dish
			setInputValue(option)
			setDebouncedValue(option)
			if (dish) {
				setDish?.(dish)
			}

			setShouldFetch(true)
			setTimeout(() => setIsShow(false), 300)
			if (inputRef.current) {
				inputRef.current.blur()
			}

			if (!institution || !meal || !item || !dateForDay || !dishId) return
			if (isMenuItem) {
				const updatedData = {
					...item,
					date: dateForDay,
					dishId,
					institutionId: institution.id,
					mealId: meal.id
				}

				if (item?.id) {
					updateMenuItem({ id: item.id, data: updatedData })
				} else {
					createMenuItem(updatedData)
				}

			}

		},
		[setInputValue, setDebouncedValue, setShouldFetch, inputRef, institution, meal, item, dateForDay, isMenuItem, setDish, setIsShow, updateMenuItem, createMenuItem]
	)

	return handleOptionSelect
}


