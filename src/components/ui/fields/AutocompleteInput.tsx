'use client'

import cn from 'clsx'
import { useRef } from 'react'
import { toast } from 'sonner'

import { DishResponse } from '@/types/dish.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import { useOutside } from '@/hooks/useOutside'

import { errorCatch } from '@/api/error'

import { useGetDishByNameQuery } from '@/services/dish.service'
import styles from './AutocompleteInput.module.scss'
import { AutocompleteList } from './AutocompleteList '
import { useAutocompleteInput } from './hooks/useAutocompleteInput'
import { useOptionSelect } from './hooks/useOptionSelect'

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
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const isDishString = typeof item.dish === 'string'
	const defaultInputValue: string = isDishString
		? (item.dish as string)
		: (item.dish as DishResponse).name

	const { isShow, ref, setIsShow } = useOutside(false)

	const {
		inputValue,
		handleChange,
		debouncedValue,
		shouldFetch,
		setShouldFetch,
		setDebouncedValue,
		setInputValue
	} = useAutocompleteInput({ defaultInputValue, setIsShow })
	const {
		data: dishes,
		isError,
		error
	} = useGetDishByNameQuery(debouncedValue, {
		skip: !shouldFetch || !debouncedValue.trim()
	})

	const handleOptionSelect = useOptionSelect(
		item,
		institutionSlug,
		mealSlug,
		dateForDay,
		setInputValue,
		setDebouncedValue,
		setShouldFetch,
		setIsShow,
		inputRef
	)
	if (isError) {
		toast.error(errorCatch(error))
	}
	return (
		<div className={styles.autocompleteContainer}>
			<span>{item.dishOrder}</span>
			<textarea
				rows={1}
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
				<AutocompleteList
					ref={ref}
					dishes={dishes}
					handleOptionSelect={handleOptionSelect}
				/>
			)}
		</div>
	)
}

AutocompleteInput.displayName = 'AutocompleteInput'
