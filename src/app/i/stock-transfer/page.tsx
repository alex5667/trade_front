import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import StockTransferView from './StockTransferView'

export const metadata: Metadata = {
	title: 'Перемещения товаров',
	...NO_INDEX_PAGE
}

export default function StockTransferPage() {
	return <StockTransferView />
}
