import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import ExcelReader from './ExcelReader'

export const metadata: Metadata = {
	title: 'Excel Loader',
	...NO_INDEX_PAGE
}

export default function ExcelPage() {
	return <ExcelReader />
}
