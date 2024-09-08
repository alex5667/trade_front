'use client'

import cn from 'clsx'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import styles from '../AdminBoard.module.scss'

// import { usePrefetch as usePomodoroPrefetch } from '@/services/pomodoro.services'
// import { usePrefetch as useTaskPrefetch } from '@/services/task.services'
// import { usePrefetch as useTimeBlockPrefetch } from '@/services/time-block.services '
import { usePrefetch as useMenuItemPrefetch } from '@/services/menu-item.service'
import { usePrefetch as useUserPrefetch } from '@/services/user.services'

type PrefetchFunction = (endpointName: EndpointKeys) => () => void

const usePrefetchFunctions = {
	// getTasks: useTaskPrefetch,
	// getTodaySession: usePomodoroPrefetch,
	// getTimeBlocks: useTimeBlockPrefetch,
	getAll: useMenuItemPrefetch,
	getProfile: useUserPrefetch
} as const

type EndpointKeys = keyof typeof usePrefetchFunctions

export interface ItemMenu {
	link: string
	name: string
	icon: LucideIcon
	endPoint: string
}
export function MenuItem({ item }: { item: ItemMenu }) {
	const { icon: Icon, link, name, endPoint } = item
	const path = usePathname()

	const prefetchFunction = usePrefetchFunctions[
		endPoint as EndpointKeys
	] as PrefetchFunction
	const prefetch = prefetchFunction(endPoint as EndpointKeys)

	useEffect(() => {
		if (path === link) {
			prefetch()
		}
	}, [path, link, prefetch])

	return (
		<div>
			<Link
				href={link}
				onClick={() => {
					prefetch()
				}}
				className={cn(styles.menuItemLink, {
					'bg-db-row-light dark:!bg-[#1c2b41]': path === link
				})}
			>
				<Icon />
				<span>{name}</span>
			</Link>
		</div>
	)
}
