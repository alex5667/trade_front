import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'

import { Titlies } from '@/constants/titles'

import CardInput from './CardInput'
import { FetchQueryData, FetchQueryKey } from './useCardInput'

type CardProps<T extends FetchQueryData> = {
	item: T
	fetchFunction: string
	setItemToParent?: (value: SetStateAction<any>) => void
}

const Card = <T extends FetchQueryData>({
	item: itemInitial,
	fetchFunction,
	setItemToParent
}: CardProps<T>) => {
	const [item, setItem] = useState<T>(itemInitial)
	useEffect(() => {
		setItem(itemInitial)
	}, [itemInitial])
	const memoizedsetItem = useCallback(
		(value: SetStateAction<FetchQueryData>) => {
			setItem(prev => {
				const updatedItem = typeof value === 'function' ? value(prev) : value
				return { ...prev, ...updatedItem }
			})

			setItemToParent &&
				setItemToParent((prevItem: any) => {
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
					className='flex w-full items-center mb-2'
				>
					{/* <p className='mr-2 p-1'>{index}</p> */}
					<p className='mr-2 p-2 text-sm rounded-lg border border-border-light flex-grow w-[20%] h-full'>
						{Titlies[key as keyof typeof Titlies]}
					</p>
					<CardInput
						item={item}
						keyName={key as keyof FetchQueryData}
						setItem={
							memoizedsetItem as (value: SetStateAction<FetchQueryData>) => void
						}
						fetchFunction={fetchFunction as FetchQueryKey}
					/>
				</div>
			))}
		</div>
	)
}

export default memo(Card)
Card.displayName = 'Card'
