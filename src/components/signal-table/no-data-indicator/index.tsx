'use client'

import { memo } from 'react'

import styles from './no-data-indicator.module.scss'

type NoDataIndicatorProps = {
	hasAnyData: boolean
	isError: boolean
}

/**
 * NoDataIndicator - Shows a message when no data is available
 */
const NoDataIndicator = memo(function NoDataIndicator({
	hasAnyData,
	isError
}: NoDataIndicatorProps) {
	if (hasAnyData || isError) return null

	return (
		<div className={styles.noDataContainer}>
			<p className={styles.noDataMessage}>
				Ожидание данных... Новые сигналы появятся как только будут обнаружены.
			</p>
		</div>
	)
})

export default NoDataIndicator
