import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import Purchasing from './Purchasing'

export const metadata: Metadata = {
	title: '',
	...NO_INDEX_PAGE
}

export default function PuhasingrPage() {
	return <Purchasing />
}
