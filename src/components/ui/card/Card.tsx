import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import CardInput from './CardInput'

type CardProps<T extends Record<string, any>> = {
	item: T
	fetchFunction: string
	setItemToParent?: (value: SetStateAction<any>) => void
}

const Card = <T extends Record<string, any>>({
	item: itemInitial,
	fetchFunction,
	setItemToParent
}: CardProps<T>) => {
	const [item, setItem] = useState<T>(itemInitial)
	console.log(' Card item', item)
	useEffect(() => {
		setItem(itemInitial)
	}, [itemInitial])
	const memoizedsetItem = useCallback(
		(value: SetStateAction<T>) => {
			setItem(prev => {
				const updatedItem = typeof value === 'function' ? value(prev) : value
				return { ...prev, ...updatedItem }
			})

			setItemToParent &&
				setItemToParent(prevItem => {
					const updatedParent =
						typeof value === 'function' ? value(prevItem ?? ({} as T)) : value
					return { ...structuredClone(prevItem ?? ({} as T)), ...updatedParent }
				})
		},
		[setItemToParent]
	)

	if (!item || Object.keys(item).length === 0) {
		return <p>Не выбрана опция.</p>
	}

	return (
		<div className='w-full'>
			{Object.keys(item).map((key, index) => (
				<div
					key={index}
					className='flex w-full items-center'
				>
					<p className='mr-2 p-1'>{index}</p>
					<p className='mr-2 w-[10%] p-1'>{key}</p>
					<CardInput
						item={item}
						keyName={key as keyof T}
						setItem={memoizedsetItem}
						fetchFunction={fetchFunction}
					/>
				</div>
			))}
		</div>
	)
}

export default memo(Card)
Card.displayName = 'Card'
