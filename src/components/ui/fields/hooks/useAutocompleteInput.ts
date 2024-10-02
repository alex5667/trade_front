import { debounce } from '@/utils/debounce'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'


interface useAutocompleteInput {
	defaultInputValue: string
	setIsShow: Dispatch<SetStateAction<boolean>>
}
export function useAutocompleteInput({ defaultInputValue, setIsShow }: useAutocompleteInput) {
	const [inputValue, setInputValue] = useState(defaultInputValue)
	const [debouncedValue, setDebouncedValue] = useState('')
	const [shouldFetch, setShouldFetch] = useState(false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce((value: string) => {
			setDebouncedValue(value)
			setShouldFetch(true)
		}, 400),
		[]
	)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
		debouncedInputChange(event.target.value)
		setIsShow(true)

	}

	return { inputValue, handleChange, debouncedValue, shouldFetch, setShouldFetch, setDebouncedValue, setInputValue }
}