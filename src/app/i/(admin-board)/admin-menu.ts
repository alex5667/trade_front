'use strict'

import { MenuItem } from '@/types/menu.interface'

import { Activity, MessageSquare } from 'lucide-react'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'

export const ADMINMENU: MenuItem[] = [
	{
		icon: Activity,
		link: `${ADMINBOARD_PAGES.SIGNAL_TABLE}`,
		name: 'Signal Table',
		endPoint: null
	},
	{
		icon: MessageSquare,
		link: `${ADMINBOARD_PAGES.TELEGRAM_SIGNALS}`,
		name: 'Telegram Signals',
		endPoint: null
	},
	{
		icon: MessageSquare,
		link: `${ADMINBOARD_PAGES.TELEGRAM_CHANNEL}`,
		name: 'Telegram Channels',
		endPoint: null
	},

]