import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import ConsumptionView from './ConsumptionView'

export const metadata: Metadata = {
	title: 'Количество порций',
	...NO_INDEX_PAGE
}

export default function ConsumptionPage() {
	return <ConsumptionView />
}
