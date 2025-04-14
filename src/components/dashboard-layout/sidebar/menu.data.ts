import {
	DatabaseZap,
	LayoutDashboard,
	Settings
} from 'lucide-react'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'
import { MenuItem } from '@/types/menu.interface'


export const USERMENU: MenuItem[] = [
	{
		icon: LayoutDashboard,
		link: ADMINBOARD_PAGES.USER,
		name: 'User board',
		endPoint: 'getProfile'
	},


	{
		icon: Settings,
		link: ADMINBOARD_PAGES.SETTINGS,
		name: 'Settings',
		endPoint: 'getProfile'
	}, {
		icon: DatabaseZap,
		link: `${ADMINBOARD_PAGES.DBEDITOR}`,
		name: 'Работа с базой',
		endPoint: 'getAll'
	},
	// {
	// 	icon: Apple,
	// 	link: `${ADMINBOARD_PAGES.RETAILSALE}`,
	// 	name: 'Розничные продажи',
	// 	endPoint: 'getAll'
	// },
	// {
	// 	icon: Truck,
	// 	link: `${ADMINBOARD_PAGES.STOCKTRANSFER}`,
	// 	name: 'Перемещения',
	// 	endPoint: 'getAll'
	// },

]

export const ADMINMENU: MenuItem[] = [
	{
		icon: LayoutDashboard,
		link: ADMINBOARD_PAGES.ADMIN,
		name: 'Admin Board',
		endPoint: 'getProfile'
	},

	{
		icon: Settings,
		link: ADMINBOARD_PAGES.SETTINGS,
		name: 'Settings',
		endPoint: 'getProfile'
	}

]

