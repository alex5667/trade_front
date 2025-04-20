'use client'

import { memo } from 'react'

import styles from './signal-table.module.scss'

type NoDataIndicatorProps = {
	hasAnyData: boolean
	isError: boolean
}

/**
 * NoDataIndicator - Shows a message when no signal data is available
 */
const NoDataIndicator = memo(function NoDataIndicator({
	hasAnyData,
	isError
}: NoDataIndicatorProps) {
	if (hasAnyData || isError) return null

	return (
		<p className={`${styles.statusMessage} ${styles.waiting}`}>
			<span className={`${styles.statusDot} ${styles.waiting}`}></span>
			Ожидание данных сигналов...
		</p>
	)
})

export default NoDataIndicator
