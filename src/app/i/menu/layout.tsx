import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Menu page',
	...NO_INDEX_PAGE
}

export default function MenuLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
