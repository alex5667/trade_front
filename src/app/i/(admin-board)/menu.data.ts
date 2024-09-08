import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import {
	KanbanSquare,
	LayoutDashboard,
	LucideIcon,
	Timer
} from 'lucide-react'

export interface IMenuItem {
	link: string
	name: string
	icon: LucideIcon
	endPoint: string
}

export const MENU: IMenuItem[] = [
	{
		icon: LayoutDashboard,
		link: DASHBOARD_PAGES.MENU_SCHOOL,
		name: 'Меню школа',
		endPoint: 'getAll'
	},
	{
		icon: KanbanSquare,
		link: DASHBOARD_PAGES.MENU_KINDERGARTEN,
		name: 'Меню сад',
		endPoint: 'getAll'
	},
	{
		icon: Timer,
		link: DASHBOARD_PAGES.MENU_BUFFET,
		name: 'Меню бюфет',
		endPoint: 'getAll'
	},

]
