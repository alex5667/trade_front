import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import Menu from './Menu'

export const metadata: Metadata = {
	title: 'Menu page',
	...NO_INDEX_PAGE
}

export default function MenuPage() {
	return <Menu />
}
