'use client'

/**
 * VolatilityTable Component
 * ------------------------------
 * Displays volatility signals from the Redux store
 */
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectVolatilitySignals } from '@/store/signals/selectors/signals.selectors'
import { VolatilitySignal } from '@/store/signals/signal.types'

import { NoDataIndicator } from '../no-data-indicator/NoDataIndicator'

import styles from './VolatilityTable.module.scss'

interface VolatilityTableProps {
	signals?: VolatilitySignal[]
	title?: string
}

/**
 * VolatilityTable - компонент для отображения сигналов волатильности
 *
 * Отображает таблицу с информацией о волатильности по разным монетам.
 * Поддерживает два типа сигналов волатильности:
 * 1. Спайки волатильности - резкие скачки волатильности
 * 2. Диапазоны волатильности - необычные диапазоны цены
 */
export const VolatilityTable = ({
	signals,
	title = 'Volatility Signals'
}: VolatilityTableProps) => {
	// Use provided signals or get from Redux if not provided
	const reduxSignals = useSelector(selectVolatilitySignals)
	const volatilitySignals = signals || reduxSignals

	// Log signals when they change
	useEffect(() => {
		console.log(
			`🔍 VolatilityTable - Signals count: ${volatilitySignals.length}`
		)

		if (volatilitySignals.length > 0) {
			console.log(
				'First signal:',
				JSON.stringify(volatilitySignals[0], null, 2)
			)
		}
	}, [volatilitySignals])

	if (!volatilitySignals || volatilitySignals.length === 0) {
		return <NoDataIndicator message='Ожидание сигналов волатильности...' />
	}

	// Debug check on signal structure
	if (volatilitySignals.length > 0) {
		console.log(
			'Signal count in VolatilityTable:',
			volatilitySignals.length,
			'First signal:',
			JSON.stringify(volatilitySignals[0], null, 2)
		)
	}

	return (
		<div className={styles.volatilityTableContainer}>
			<h3 className={styles.volatilityTableTitle}>
				{title} ({volatilitySignals.length})
			</h3>
			<table className={styles.volatilityTable}>
				<thead>
					<tr>
						<th>Монета</th>
						<th>Открытие</th>
						<th>Макс</th>
						<th>Мин</th>
						<th>Закрытие</th>
						<th>Волат.</th>
						<th>Время</th>
					</tr>
				</thead>
				<tbody>
					{volatilitySignals.map((signal, index) => {
						// Extract symbol and timestamp safely
						const symbol = signal.symbol || 'Unknown'
						const timestamp = signal.timestamp || Date.now()

						// Extract other data (using values that may come from WebSocket format)
						const open = signal.open || 0
						const high = signal.high || 0
						const low = signal.low || 0
						const close = signal.close || signal.price || 0
						const volatility = signal.volatility || 0

						// Format timestamp
						const time = new Date(timestamp).toLocaleTimeString()

						return (
							<tr key={`${symbol}-${index}`}>
								<td className={styles.symbolCell}>{symbol}</td>
								<td>${Number(open).toFixed(4)}</td>
								<td>${Number(high).toFixed(4)}</td>
								<td>${Number(low).toFixed(4)}</td>
								<td>${Number(close).toFixed(4)}</td>
								<td>{Number(volatility).toFixed(2)}%</td>
								<td>{time}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
