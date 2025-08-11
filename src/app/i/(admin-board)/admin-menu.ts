'use strict'

import { MenuItem } from '@/types/menu.interface'

import { Activity } from 'lucide-react'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'

export const ADMINMENU: MenuItem[] = [
	{
		icon: Activity,
		link: `${ADMINBOARD_PAGES.SIGNAL_TABLE}`,
		name: 'Signal Table',
		endPoint: null
	},

]