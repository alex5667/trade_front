import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import ConsumptionView from './RetailSaleView'

export const metadata: Metadata = {
	title: 'Розничные продажи',
	...NO_INDEX_PAGE
}

export default function ConsumptionPage() {
	return <ConsumptionView />
}
