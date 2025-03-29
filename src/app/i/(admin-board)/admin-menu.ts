'use strict'

import { MenuItem } from '@/types/menu.interface'

import { FileDown } from 'lucide-react'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'

export const ADMINMENU: MenuItem[] = [


	{
		icon: FileDown,
		link: `${ADMINBOARD_PAGES.EXCEL}`,
		name: 'Загрузка из excel',
		endPoint: null
	},


]