/**
 * Компонент SignalsList - список торговых сигналов с фильтрацией по режиму
 * ------------------------------
 * Пример использования хука useFilteredSignals для отображения
 * отфильтрованных сигналов в соответствии с текущим рыночным режимом
 */

'use client'

import React from 'react'

import { useFilteredSignals } from '@/hooks/useFilteredSignals'
import { useRegimeSocket } from '@/hooks/useRegimeSocket'
import { FilterableSignal } from '@/types/signal.types'
import { getFilterReason } from '@/utils/regime-gate'

import styles from './SignalsList.module.scss'

interface SignalsListProps {
	signals: FilterableSignal[]
	showFiltered?: boolean
	enableFiltering?: boolean
}

export const SignalsList: React.FC<SignalsListProps> = ({
	signals,
	showFiltered = false,
	enableFiltering = true,
}) => {
	const { regime: liveRegime } = useRegimeSocket()
	const currentRegime = liveRegime?.regime

	const { filtered, stats, isFiltering } = useFilteredSignals(
		signals,
		currentRegime,
		{ enabled: enableFiltering }
	)

	const displaySignals = showFiltered ? signals : filtered

	return (
		<div className={styles.container}>
			{/* Статистика фильтрации */}
			{isFiltering && (
				<div className={styles.stats}>
					<span className={styles.statsText}>
						Showing {stats.allowed} of {stats.total} signals
						{stats.filtered > 0 && (
							<span className={styles.filtered}>
								({stats.filtered} filtered by regime)
							</span>
						)}
					</span>
					{currentRegime && (
						<span className={styles.regime}>
							Regime: <strong>{currentRegime}</strong>
						</span>
					)}
				</div>
			)}

			{/* Список сигналов */}
			{displaySignals.length === 0 ? (
				<div className={styles.empty}>
					<p>No signals available</p>
				</div>
			) : (
				<div className={styles.list}>
					{displaySignals.map((signal, index) => {
						const filterReason = currentRegime 
							? getFilterReason(currentRegime, { 
									type: signal.type, 
									side: signal.side 
								})
							: null

						const isFiltered = showFiltered && filterReason !== null

						return (
							<div
								key={index}
								className={`${styles.signalItem} ${isFiltered ? styles.filteredItem : ''}`}
							>
								<div className={styles.signalHeader}>
									<span className={styles.signalType}>{signal.type}</span>
									{signal.side && (
										<span
											className={`${styles.signalSide} ${
												signal.side === 'long' ? styles.long : styles.short
											}`}
										>
											{signal.side.toUpperCase()}
										</span>
									)}
								</div>

								<div className={styles.signalBody}>
									{signal.symbol && (
										<span className={styles.symbol}>{signal.symbol}</span>
									)}
								</div>

								{isFiltered && filterReason && (
									<div className={styles.filterReason}>
										<small>{filterReason}</small>
									</div>
								)}
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

