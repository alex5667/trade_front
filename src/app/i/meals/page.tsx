import type { Metadata } from 'next'

import CreatorEditor from '@/components/сreator-editor/CreatorEditor'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Meals',
	...NO_INDEX_PAGE
}

export default function MealPage() {
	return <CreatorEditor type={'meal'} />
}
