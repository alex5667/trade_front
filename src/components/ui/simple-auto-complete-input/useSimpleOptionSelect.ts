import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react'

export function useSimpleOptionSelect<T extends { id: number; name: string }>(
	setInputValue: (value: SetStateAction<string | ''>) => void,
	setDebouncedValue: (value: SetStateAction<string>) => void,
	setShouldFetch: (value: SetStateAction<boolean>) => void,
	setIsShow: Dispatch<SetStateAction<boolean>>,
	inputRef: MutableRefObject<HTMLTextAreaElement | null>,
	setItem?: (value: SetStateAction<T>) => void,


) {

	const handleOptionSelect = useCallback(
		(item: T) => {
			const { name: option, id: itemId } = item
			setInputValue(option)
			setDebouncedValue(option)
			if (item) {
				setItem?.(item)
			}

			setShouldFetch(true)
			setTimeout(() => setIsShow(false), 300)
			if (inputRef.current) {
				inputRef.current.blur()
			}

		},
		[setInputValue, setDebouncedValue, setShouldFetch, inputRef, setItem, setIsShow]
	)

	return handleOptionSelect
}


