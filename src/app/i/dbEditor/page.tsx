import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import DbEditor from './DbEditor'

export const metadata: Metadata = {
	title: 'Database editor',
	...NO_INDEX_PAGE
}

export default function DbEditorPage() {
	return <DbEditor />
}
