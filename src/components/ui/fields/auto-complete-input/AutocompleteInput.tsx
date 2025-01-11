'use client'

import cn from 'clsx'
import { SetStateAction, useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import { DishResponse } from '@/types/dish.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import { useOutside } from '@/hooks/useOutside'

import { errorCatch } from '@/api/error'

import { useAutocompleteInput } from '../hooks/useAutocompleteInput'
import { useOptionSelect } from '../hooks/useOptionSelect'

import AutoCompleteTextarea from './AutoCompleteTextarea'
import styles from './AutocompleteInput.module.scss'
import { AutocompleteList } from './AutocompleteList '
import DishCard from '@/app/i/dishes/DishCard'
import { useGetDishByNameQuery } from '@/services/dish.service'

type AutocompleteInputProps = {
	item?: MenuItemResponse
	institutionSlug?: string
	mealSlug?: string
	dateForDay?: string
	className?: string
	isMenuItem?: boolean
}

export const AutocompleteInput = ({
	className,
	item,
	institutionSlug,
	mealSlug,
	dateForDay,
	isMenuItem,
	...rest
}: AutocompleteInputProps) => {
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const defaultInputValue: string = item
		? typeof item.dish === 'string'
			? (item.dish as string)
			: (item.dish as DishResponse)?.name || ''
		: ''

	const { isShow, ref, setIsShow } = useOutside(false)
	const [dish, setDish] = useState<DishResponse>({} as DishResponse)
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
		skip: !shouldFetch || !debouncedValue || !debouncedValue.trim()
	})
	const memoizedSetDish = useCallback(
		(value: SetStateAction<DishResponse>) => {
			setDish(value)
		},
		[setDish]
	)
	if (isError) {
		toast.error(errorCatch(error))
	}

	const handleOptionSelect = useOptionSelect(
		setInputValue,
		setDebouncedValue,
		setShouldFetch,
		setIsShow,
		inputRef,
		item,
		institutionSlug,
		mealSlug,
		dateForDay,
		isMenuItem,
		setDish
	)

	return (
		<div className={cn(styles.autocompleteContainer, className)}>
			<div className='w-full relative'>
				<AutoCompleteTextarea
					ref={inputRef}
					setIsShow={setIsShow}
					handleChange={handleChange}
					inputValue={inputValue}
					{...rest}
				/>
				{isShow && dishes && !isError && dishes.length > 0 && (
					<AutocompleteList
						ref={ref}
						dishes={dishes}
						handleOptionSelect={handleOptionSelect}
					/>
				)}
			</div>

			{!isMenuItem && <DishCard dish={dish} />}
		</div>
	)
}

AutocompleteInput.displayName = 'AutocompleteInput'
