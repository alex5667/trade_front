import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react'

// Generic type that allows for different property names
type EntityWithIdentifier = {
	id: number
	name?: string
	alias?: string;
	[key: string]: any
}

export function useSimpleOptionSelect<T extends EntityWithIdentifier>(
	setInputValue: (value: SetStateAction<string | ''>) => void,
	setDebouncedValue: (value: SetStateAction<string>) => void,
	setShouldFetch: (value: SetStateAction<boolean>) => void,
	setIsShow: Dispatch<SetStateAction<boolean>>,
	inputRef: MutableRefObject<HTMLTextAreaElement | null>,
	setItem?: (value: SetStateAction<T>) => void,
) {
	// Function to get display text from an entity
	const getDisplayName = (item: EntityWithIdentifier): string => {
		if (item.name) return item.name
		if (item.alias) return item.alias

		// Fallback to the first string property
		const stringProps = Object.entries(item)
			.filter(([_, value]) => typeof value === 'string')
			.map(([key, value]) => ({ key, value }))

		return stringProps.length > 0 ? stringProps[0].value : `Item ${item.id}`
	}

	const handleOptionSelect = useCallback(
		(item: T) => {
			const displayName = getDisplayName(item)
			setInputValue(displayName)
			setDebouncedValue(displayName)
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


