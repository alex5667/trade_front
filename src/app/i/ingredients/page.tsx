import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import Ingredients from './Ingredients'

export const metadata: Metadata = {
	title: 'Ingredients',
	...NO_INDEX_PAGE
}

export default function IngredientPage() {
	return <Ingredients />
}
