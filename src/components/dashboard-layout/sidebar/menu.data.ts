import {
	CookingPot,
	KanbanSquare,
	LayoutDashboard,
	Settings,
	Timer
} from 'lucide-react'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'
import { MenuItem } from './menu.interface'


export const MENU: MenuItem[] = [
	{
		icon: LayoutDashboard,
		link: ADMINBOARD_PAGES.ADMIN_PANEL_URL,
		name: 'Adminboard',
		endPoint: 'getProfile'
	},
	{
		icon: CookingPot,
		link: ADMINBOARD_PAGES.MENU_Slon_1,
		name: 'Меню Слон-1',
		endPoint: 'getAll'
	},
	{
		icon: KanbanSquare,
		link: ADMINBOARD_PAGES.MENU_KINDERGARTEN,
		name: 'Меню сад',
		endPoint: 'getAll'
	},
	{
		icon: Timer,
		link: ADMINBOARD_PAGES.MENU_BUFFET,
		name: 'Меню бюфет',
		endPoint: 'getAll'
	},
	{
		icon: Settings,
		link: ADMINBOARD_PAGES.SETTINGS,
		name: 'Settings',
		endPoint: 'getProfile'
	}
]
