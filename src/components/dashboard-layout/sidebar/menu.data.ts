import {
	Apple,
	DatabaseZap,
	FileDown,
	LayoutDashboard,
	Logs,
	Settings,
	ShoppingCart,
	Table
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
		icon: Logs,
		link: `${ADMINBOARD_PAGES.MENU}`,
		name: 'Меню',
		endPoint: 'getAll'
	}
	,
	{
		icon: FileDown,
		link: `${ADMINBOARD_PAGES.CONSUMPTION}`,
		name: 'Кол-во людей',
		endPoint: null
	}
	,


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

]

export const ADMINMENU: MenuItem[] = [
	{
		icon: LayoutDashboard,
		link: ADMINBOARD_PAGES.ADMIN,
		name: 'Admin Board',
		endPoint: 'getProfile'
	},
	{
		icon: Logs,
		link: `${ADMINBOARD_PAGES.MENU}`,
		name: 'Меню',
		endPoint: 'getAll'
	},
	{
		icon: Table,
		link: `${ADMINBOARD_PAGES.CONSUMPTION}`,
		name: 'Количество людей',
		endPoint: null
	},

	{
		icon: ShoppingCart,
		link: `${ADMINBOARD_PAGES.PURCHASING}`,
		name: 'Закупки',
		endPoint: null
	},

	{
		icon: DatabaseZap,
		link: `${ADMINBOARD_PAGES.DBEDITOR}`,
		name: 'Работа с базой',
		endPoint: 'getAll'
	},
	{
		icon: Apple,
		link: `${ADMINBOARD_PAGES.RETAILSALE}`,
		name: 'Розничные продажи',
		endPoint: 'getAll'
	},

	// {
	// 	icon: FileDown,
	// 	link: `${ADMINBOARD_PAGES.EXCEL}`,
	// 	name: 'Загрузка из excel',
	// 	endPoint: null
	// },
	// {
	// 	icon: Salad,
	// 	link: `${ADMINBOARD_PAGES.DISHES}`,
	// 	name: 'Блюда',
	// 	endPoint: null
	// },
	// {
	// 	icon: Landmark,
	// 	link: `${ADMINBOARD_PAGES.INSTITUTIONS}`,
	// 	name: 'Точки выдачи',
	// 	endPoint: null
	// },
	// {
	// 	icon: EggFried,
	// 	link: `${ADMINBOARD_PAGES.MEALS}`,
	// 	name: 'Дневной рацион',
	// 	endPoint: null
	// },
	{
		icon: Settings,
		link: ADMINBOARD_PAGES.SETTINGS,
		name: 'Settings',
		endPoint: 'getProfile'
	}
]

