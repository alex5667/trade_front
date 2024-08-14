'use client'

import Link from 'next/link'

import { IMenuItem } from './menu.interface'
import { usePrefetch } from '@/services/task.services'

export function MenuItem({ item }: { item: IMenuItem }) {
	const { icon: Icon, link, name } = item
	const prefetch = usePrefetch('getTasks', { ifOlderThan: 30 })

	return (
		<div>
			<Link
				href={link}
				className='flex gap-2.5 items-center py-1.5 mt-2 px-layout transition-colors hover:bg-border rounded-lg'
				onMouseEnter={() => prefetch()}
			>
				<Icon />
				<span>{name}</span>
			</Link>
		</div>
	)
}
