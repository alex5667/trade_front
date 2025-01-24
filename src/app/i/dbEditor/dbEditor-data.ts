import { ADMINBOARD_PAGES } from '@/config/pages-url.config'
import { MenuItem } from '@/types/menu.interface'
import { ChartBarStacked, EggFried, FileDown, Landmark, Salad } from 'lucide-react'

export const DBEDITORMENU: MenuItem[] = [


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
		icon: Landmark,
		link: `${ADMINBOARD_PAGES.INSTITUTIONS}`,
		name: 'Точки выдачи',
		endPoint: null
	},
	{
		icon: EggFried,
		link: `${ADMINBOARD_PAGES.MEALS}`,
		name: 'Дневной рацион',
		endPoint: null
	},
	{
		icon: ChartBarStacked,
		link: `${ADMINBOARD_PAGES.DISHCATEGORIES}`,
		name: 'Категории',
		endPoint: null
	},

]