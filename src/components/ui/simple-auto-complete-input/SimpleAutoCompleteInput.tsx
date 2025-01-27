'use client'

import cn from 'clsx'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useOutside } from '@/hooks/useOutside'

import { errorCatch } from '@/api/error'

import Card from '../card/Card'
import AutoCompleteTextarea from '../fields/auto-complete-input/AutoCompleteTextarea'
import { useAutocompleteInput } from '../fields/hooks/useAutocompleteInput'

import styles from './SimpleAutocompleteInput.module.scss'
import { SimpleAutocompleteList } from './SimpleAutocompleteList'
import { useSimpleOptionSelect } from './useSimpleOptionSelect'
import { useGetDishCategoryByNameQuery } from '@/services/dish-category.service'
import { useGetIngredientByNameQuery } from '@/services/ingredient.service'
import { useGetInstitutionByNameQuery } from '@/services/institution.service'
import { useGetMealByNameQuery } from '@/services/meal.service'

const fetchQueries = {
	institution: useGetInstitutionByNameQuery,
	meal: useGetMealByNameQuery,
	dishCategory: useGetDishCategoryByNameQuery,
	ingredient: useGetIngredientByNameQuery
}

type SimpleAutocompleteInputProps<T extends { id: number; printName: string }> =
	{
		className?: string
		fetchFunction: keyof typeof fetchQueries
		setItem?: (value: SetStateAction<T | null>) => void
		item?: T
	}

export const SimpleAutocompleteInput = <
	T extends { id: number; printName: string }
>({
	className,
	fetchFunction,
	setItem: setItemToParent,
	item: parentItem
}: SimpleAutocompleteInputProps<T>): JSX.Element => {
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const { isShow, ref, setIsShow } = useOutside(false)
	const [item, setItem] = useState<T | null>(parentItem?.id ? parentItem : null)

	useEffect(() => {
		if (parentItem) setItem(parentItem)
	}, [parentItem])

	useEffect(() => {
		console.log('Item updated:', item) // Для отладки

		setItemToParent && setItemToParent(item)
	}, [setItemToParent, item])
	const {
		inputValue,
		handleChange,
		debouncedValue,
		shouldFetch,
		setShouldFetch,
		setDebouncedValue,
		setInputValue
	} = useAutocompleteInput({ setIsShow })

	const queryHook = fetchQueries[fetchFunction]
	const { data, isError, error } = queryHook(debouncedValue, {
		skip: !shouldFetch || !debouncedValue.trim()
	})

	if (isError) {
		toast.error(errorCatch(error))
	}

	const handleOptionSelect = useSimpleOptionSelect(
		setInputValue,
		setDebouncedValue,
		setShouldFetch,
		setIsShow,
		inputRef,
		setItem as (value: SetStateAction<T>) => void
	)

	return (
		<div className={cn(styles.autocompleteContainer, className)}>
			<div className='w-full relative'>
				<AutoCompleteTextarea
					ref={inputRef}
					setIsShow={setIsShow}
					handleChange={handleChange}
					inputValue={inputValue}
				/>
				{isShow && data && data.length > 0 && (
					<SimpleAutocompleteList
						ref={ref}
						data={data}
						handleOptionSelect={item => handleOptionSelect(item as T)}
					/>
				)}
			</div>

			{item && (
				<Card
					item={item}
					fetchFunction={fetchFunction}
				/>
			)}
		</div>
	)
}

SimpleAutocompleteInput.displayName = 'SimpleAutocompleteInput'
