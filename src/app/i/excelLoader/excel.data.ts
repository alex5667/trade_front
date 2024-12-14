import { ADMINBOARD_PAGES } from '@/config/pages-url.config'
import { MenuItem } from '@/types/menu.interface'
import { LayoutDashboard } from 'lucide-react'

export const EXCELMENU: MenuItem[] = [
	{
		icon: LayoutDashboard,
		link: ADMINBOARD_PAGES.EXCEL,
		name: 'Загрузка меню',
	},
	// {
	// 	icon: CookingPot,
	// 	link: `${ADMINBOARD_PAGES.MENU}/slon-1`,
	// 	name: 'Меню Слон-1',
	// 	endPoint: 'getAll'
	// }
	// ,
	// {
	// 	icon: Table,
	// 	link: `${ADMINBOARD_PAGES.CONSUMPTION}`,
	// 	name: 'Кол-во порций',
	// 	endPoint: null
	// },


	// {
	// 	icon: Settings,
	// 	link: ADMINBOARD_PAGES.SETTINGS,
	// 	name: 'Settings',
	// 	endPoint: 'getProfile'
	// }
]
