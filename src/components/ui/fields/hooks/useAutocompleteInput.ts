import { debounce } from '@/utils/debounce'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'


interface useAutocompleteInput {
	setIsShow: Dispatch<SetStateAction<boolean>>
	defaultInputValue?: string
}
export function useAutocompleteInput({ defaultInputValue, setIsShow }: useAutocompleteInput) {
	const [inputValue, setInputValue] = useState<string | ''>(defaultInputValue || '')
	const [debouncedValue, setDebouncedValue] = useState('')
	const [shouldFetch, setShouldFetch] = useState(false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedInputChange = useCallback(
		debounce((value: string) => {
			setDebouncedValue(value)
			setShouldFetch(true)
		}, 500),
		[]
	)

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value

		setInputValue(value)
		debouncedInputChange(value)
		setIsShow(true)

	}

	return { inputValue, handleChange, debouncedValue, shouldFetch, setShouldFetch, setDebouncedValue, setInputValue }
}