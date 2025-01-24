import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import DishCategories from './DishCategories'

export const metadata: Metadata = {
	title: 'Categories',
	...NO_INDEX_PAGE
}

export default function CategoriesPage() {
	return <DishCategories />
}
