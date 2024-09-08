import {
	LayoutDashboard,
	Settings
} from 'lucide-react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { MenuItem } from './menu.interface'


export const MENU: MenuItem[] = [
	{
		icon: LayoutDashboard,
		link: DASHBOARD_PAGES.ADMIN_PANEL_URL,
		name: 'Dashboard',
		endPoint: 'getProfile'
	},
	{
		icon: Settings,
		link: DASHBOARD_PAGES.SETTINGS,
		name: 'Settings',
		endPoint: 'getProfile'
	}
]
