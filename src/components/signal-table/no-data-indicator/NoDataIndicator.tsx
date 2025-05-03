'use client'

import { memo } from 'react'

import styles from './NoDataIndicator.module.scss'

interface NoDataIndicatorProps {
	hasAnyData: boolean
	isError: boolean
}

/**
 * NoDataIndicator - Shows a message when no data is available
 */
export const NoDataIndicator = memo(function NoDataIndicator({
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
