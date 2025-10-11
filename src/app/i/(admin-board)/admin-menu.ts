'use strict'

import { MenuItem } from '@/types/menu.interface'

import { Activity, Coins, Gauge, Lightbulb, MessageSquare } from 'lucide-react'

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
	{
		icon: Coins,
		link: `${ADMINBOARD_PAGES.SYMBOLS_TO_REDIS}`,
		name: 'Trading Symbols',
		endPoint: null
	},
	{
		icon: Gauge,
		link: `${ADMINBOARD_PAGES.REGIME_DASHBOARD}`,
		name: 'Regime Dashboard',
		endPoint: null
	},
	{
		icon: Lightbulb,
		link: `${ADMINBOARD_PAGES.REGIME_TIPS}`,
		name: 'Regime Tips',
		endPoint: null
	}
]