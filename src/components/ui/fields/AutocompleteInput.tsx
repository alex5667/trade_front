'use client'

import cn from 'clsx'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import { DishResponse } from '@/types/dish.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import { useOutside } from '@/hooks/useOutside'

import { debounce } from '@/utils/debounce'

import { errorCatch } from '@/api/error'

import styles from './AutocompleteInput.module.scss'
import { useGetDishByNameQuery } from '@/services/dish.service'
import { useGetInstitutionBySlugQuery } from '@/services/institution.service'
import { useGetMealBySlugQuery } from '@/services/meal.service'
import {
	useCreateMenuItemMutation,
	useGetByInstitutionSlugQuery,
	useUpdateMenuItemMutation
} from '@/services/menu-item.service'

type AutocompleteInputProps = {
	item: MenuItemResponse
	institutionSlug: string
	mealSlug: string
	dateForDay: string
	className?: string
}

export const AutocompleteInput = ({
	className,
	item,
	institutionSlug,
	mealSlug,
	dateForDay,
	...rest
}: AutocompleteInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const isDishString = typeof item.dish === 'string'
	const defaultInputValue: string = isDishString
		? (item.dish as string)
		: (item.dish as DishResponse).name
	const [inputValue, setInputValue] = useState(defaultInputValue)
	const [debouncedValue, setDebouncedValue] = useState('')
	const [shouldFetch, setShouldFetch] = useState(false)
	const [updateMenuItem] = useUpdateMenuItemMutation()
	const [createMenuItem] = useCreateMenuItemMutation()
	const { isShow, ref, setIsShow } = useOutside(false)
	const { data: institution } = useGetInstitutionBySlugQuery(institutionSlug)
	const { data: meal } = useGetMealBySlugQuery(mealSlug)
	const { refetch } = useGetByInstitutionSlugQuery(institutionSlug)

	const {
		data: dishes,
		isError,
		error
	} = useGetDishByNameQuery(debouncedValue, {
		skip: !shouldFetch || !debouncedValue.trim()
	})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce((value: string) => {
			setDebouncedValue(value)
			setShouldFetch(true)
		}, 400),
		[]
	)

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(event.target.value)
			debouncedInputChange(event.target.value)
			setIsShow(true)
		},
		[debouncedInputChange, setIsShow]
	)

	const handleOptionSelect = useCallback(
		(option: string, dishId: number) => {
			setInputValue(option)
			setDebouncedValue(option)
			setShouldFetch(true)
			setTimeout(() => setIsShow(false), 200)

			if (inputRef.current) {
				inputRef.current.blur()
			}

			if (institution?.id && meal?.id) {
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
				refetch()
			} else {
				console.log('Не указаны блюдо или заведение')
			}
		},
		[
			item,
			updateMenuItem,
			setIsShow,
			createMenuItem,
			institution?.id,
			meal?.id,
			dateForDay,
			refetch
		]
	)
	if (isError) {
		toast.error(errorCatch(error))
	}
	return (
		<div className={styles.autocompleteContainer}>
			<span>{item.dishOrder}</span>
			<input
				ref={inputRef}
				className={cn(styles.input, className)}
				value={inputValue}
				onChange={handleChange}
				onFocus={() => setIsShow(true)}
				onBlur={() => {
					setTimeout(() => setIsShow(false), 200)
				}}
				{...rest}
			/>
			{isShow && dishes && dishes.length > 0 && (
				<ul
					ref={ref}
					className={styles.autocompleteList}
				>
					{dishes.map(dish => (
						<li
							key={dish.id}
							className={styles.autocompleteItem}
							onClick={() => handleOptionSelect(dish.name, dish.id)}
						>
							{dish.name}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

AutocompleteInput.displayName = 'AutocompleteInput'
