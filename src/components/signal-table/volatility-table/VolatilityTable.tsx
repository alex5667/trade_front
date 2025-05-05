'use client'

/**
 * VolatilityTable Component
 * ------------------------------
 * Displays volatility signals from the Redux store
 */
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

	if (!volatilitySignals || volatilitySignals.length === 0) {
		return <NoDataIndicator message='Ожидание сигналов волатильности...' />
	}

	// Определяем тип сигналов для выбора правильных заголовков таблицы
	const firstSignal = volatilitySignals[0]
	const isRangeType =
		firstSignal.range !== undefined && firstSignal.avgRange !== undefined

	return (
		<div className={styles.volatilityTableContainer}>
			<h3 className={styles.volatilityTableTitle}>{title}</h3>
			<table className={styles.volatilityTable}>
				<thead>
					<tr>
						<th>Монета</th>
						<th>Цена</th>
						{isRangeType ? (
							<>
								<th>Диапазон</th>
								<th>Ср. диапазон</th>
								<th>Соотношение</th>
							</>
						) : (
							<>
								<th>Волатильность</th>
								<th>Изменение</th>
							</>
						)}
					</tr>
				</thead>
				<tbody>
					{volatilitySignals.map(signal => {
						const {
							symbol,
							price,
							volatility,
							volatilityChange,
							range,
							avgRange,
							rangeRatio
						} = signal

						// Формируем класс для подсветки положительных/отрицательных значений
						const volatilityChangeClass =
							volatilityChange > 0 ? styles.positive : styles.negative

						const rangeRatioClass =
							rangeRatio && rangeRatio > 1 ? styles.positive : styles.neutral

						return (
							<tr key={`${symbol}-${signal.timestamp}`}>
								<td className={styles.symbolCell}>{symbol}</td>
								<td>{price && `$${price.toFixed(2)}`}</td>

								{isRangeType ? (
									<>
										<td>{range && range.toFixed(2)}%</td>
										<td>{avgRange && avgRange.toFixed(2)}%</td>
										<td className={rangeRatioClass}>
											{rangeRatio && rangeRatio.toFixed(2)}x
										</td>
									</>
								) : (
									<>
										<td>{volatility && volatility.toFixed(2)}%</td>
										<td className={volatilityChangeClass}>
											{volatilityChange &&
												(volatilityChange > 0 ? '+' : '') +
													volatilityChange.toFixed(2)}
											%
										</td>
									</>
								)}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
