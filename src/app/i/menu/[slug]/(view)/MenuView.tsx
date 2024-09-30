'use client'

import Loader from '@/components/ui/Loader'

import { MenuItemResponse } from '@/types/menuItem.type'

import { useActions } from '@/hooks/useActions'
import { useLocalStorage } from '@/hooks/useLocalStorage'

import { ListView } from './list-view/ListView'

interface MenuView {
	items: MenuItemResponse[] | []
	institutionSlug: string
}

export type TypeView = 'list' | 'kanban'
// const ListView = dynamic(
// 	() => import('./list-view/ListView').then(mod => mod.ListView),
// 	{
// 		loading: () => <Loader />
// 	}
// )
// const KanbanView = dynamic(
// 	() => import('./kanban-view/KanbanView').then(mod => mod.KanbanView),
// 	{
// 		loading: () => <Loader />
// 	}
// )

export function MenuView({ items, institutionSlug }: MenuView) {
	const [type, setType, isLoading] = useLocalStorage<TypeView>({
		key: 'view-type',
		defaultValue: 'list'
	})
	const { addAllMenuItems } = useActions()
	addAllMenuItems(items)
	if (isLoading) return <Loader />

	return (
		<div>
			{/* <SwitcherView
				setType={setType}
				type={type}
			/> */}

			<ListView institutionSlug={institutionSlug} />
			{/* <ListView /> */}
			{/* {type === 'list' ? <ListView /> : <KanbanView />} */}
		</div>
	)
}
