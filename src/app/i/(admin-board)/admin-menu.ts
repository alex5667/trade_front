'use strict'

import { MenuItem } from '@/types/menu.interface'

import { Apple, FileDown, Truck } from 'lucide-react'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'

export const ADMINMENU: MenuItem[] = [


	{
		icon: FileDown,
		link: `${ADMINBOARD_PAGES.EXCEL}`,
		name: 'Загрузка из excel',
		endPoint: null
	},
	{
		icon: Apple,
		link: `${ADMINBOARD_PAGES.RETAILSALE}`,
		name: 'Розничные продажи',
		endPoint: 'getAll'
	},
	{
		icon: Truck,
		link: `${ADMINBOARD_PAGES.STOCKTRANSFER}`,
		name: 'Перемещения',
		endPoint: 'getAll'
	}


]