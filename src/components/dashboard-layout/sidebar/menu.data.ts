import {
	CookingPot,
	FileDown,
	LayoutDashboard,
	Salad,
	Settings, Table
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
		icon: CookingPot,
		link: `${ADMINBOARD_PAGES.MENU}/dityachiy-sadok`,
		name: 'Меню Слон-1',
		endPoint: 'getAll'
	}
	,
	{
		icon: FileDown,
		link: `${ADMINBOARD_PAGES.CONSUMPTION}`,
		name: 'Кол-во порций',
		endPoint: null
	}
	,



	{
		icon: Settings,
		link: ADMINBOARD_PAGES.SETTINGS,
		name: 'Settings',
		endPoint: 'getProfile'
	}
]

export const ADMINMENU: MenuItem[] = [
	{
		icon: LayoutDashboard,
		link: ADMINBOARD_PAGES.ADMIN,
		name: 'Admin Board',
		endPoint: 'getProfile'
	},
	{
		icon: CookingPot,
		link: `${ADMINBOARD_PAGES.MENU}/slon-1`,
		name: 'Меню Слон-1',
		endPoint: 'getAll'
	},
	{
		icon: Table,
		link: `${ADMINBOARD_PAGES.CONSUMPTION}`,
		name: 'Количество порций',
		endPoint: null
	},
	{
		icon: FileDown,
		link: `${ADMINBOARD_PAGES.EXCEL}`,
		name: 'Загрузка из excel',
		endPoint: null
	},
	{
		icon: Salad,
		link: `${ADMINBOARD_PAGES.DISHES}`,
		name: 'Блюда',
		endPoint: null
	},



	{
		icon: Settings,
		link: ADMINBOARD_PAGES.SETTINGS,
		name: 'Settings',
		endPoint: 'getProfile'
	}
]

