import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import Dishes from './Dishes'

export const metadata: Metadata = {
	title: '',
	...NO_INDEX_PAGE
}

export default function Page() {
	return <Dishes />
}
