import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import Institutions from './Institutions'

export const metadata: Metadata = {
	title: 'Institutions',
	...NO_INDEX_PAGE
}

export default function InstitutionPage() {
	return <Institutions />
}
