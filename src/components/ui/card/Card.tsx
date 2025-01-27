import { SetStateAction, memo, useEffect, useState } from 'react'

import CardInput from './CardInput'

type CardProps<T extends NonNullable<{}>> = { item: T; fetchFunction: string }

const Card = <T extends NonNullable<{}>>({
	item: itemInitial,
	fetchFunction
}: CardProps<T>) => {
	const [item, setItem] = useState<T>(itemInitial)

	useEffect(() => {
		setItem(itemInitial)
	}, [itemInitial])

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
						setItem={setItem as (value: SetStateAction<T>) => void}
						fetchFunction={fetchFunction}
					/>
				</div>
			))}
		</div>
	)
}

export default memo(Card)
Card.displayName = 'Card'
