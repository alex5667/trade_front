import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import styles from './HomePage.module.scss'

export const metadata: Metadata = {
	title: 'Головна сторінка',
	...NO_INDEX_PAGE
}

export default async function HomePage() {
	return <div className={styles.homeContainer}>HomePage</div>
}
