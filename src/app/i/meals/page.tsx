import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import Meals from './Meals'

export const metadata: Metadata = {
	title: 'Meals',
	...NO_INDEX_PAGE
}

export default function MealPage() {
	return <Meals />
}
