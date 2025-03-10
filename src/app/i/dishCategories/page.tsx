import type { Metadata } from 'next'

import CreatorEditor from '@/components/сreator-editor/CreatorEditor'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Categories',
	...NO_INDEX_PAGE
}

export default function CategoriesPage() {
	return <CreatorEditor type='dishCategory' />
}
