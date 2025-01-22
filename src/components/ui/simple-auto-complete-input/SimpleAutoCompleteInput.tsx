'use client'

import cn from 'clsx'
import { SetStateAction, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useOutside } from '@/hooks/useOutside'

import { errorCatch } from '@/api/error'

import Card from '../card/Card'
import AutoCompleteTextarea from '../fields/auto-complete-input/AutoCompleteTextarea'
import { useAutocompleteInput } from '../fields/hooks/useAutocompleteInput'

import styles from './SimpleAutocompleteInput.module.scss'
import { SimpleAutocompleteList } from './SimpleAutocompleteList'
import { useSimpleOptionSelect } from './useSimpleOptionSelect'
import { useGetInstitutionByNameQuery } from '@/services/institution.service'
import { useGetMealByNameQuery } from '@/services/meal.service'

const fetchQueries = {
	institution: useGetInstitutionByNameQuery,
	meal: useGetMealByNameQuery
}

type SimpleAutocompleteInputProps<T extends { id: number; printName: string }> =
	{
		className?: string
		fetchFunction: keyof typeof fetchQueries
	}

export const SimpleAutocompleteInput = <
	T extends { id: number; printName: string }
>({
	className,
	fetchFunction
}: SimpleAutocompleteInputProps<T>): JSX.Element => {
	const inputRef = useRef<HTMLTextAreaElement>(null)

	const { isShow, ref, setIsShow } = useOutside(false)
	const [item, setItem] = useState<T | null>(null)

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

			{item && <Card item={item} />}
		</div>
	)
}

SimpleAutocompleteInput.displayName = 'SimpleAutocompleteInput'
