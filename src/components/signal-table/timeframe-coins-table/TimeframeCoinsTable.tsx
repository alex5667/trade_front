'use client'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectTimeframeData } from '@/store/signals/selectors/signals.selectors'
import { TimeframeCoin } from '@/store/signals/signal.types'

import { NoDataIndicator } from '../no-data-indicator/NoDataIndicator'

import styles from './Time-table.module.scss'

interface TimeframeCoinsTableProps {
	title: string
	type: 'gainers' | 'losers'
}

/**
 * Компонент строки таблицы для отображения данных о монете
 */
const TimeframeCoinsRow = ({
	coin,
	type
}: {
	coin: TimeframeCoin
	type: 'gainers' | 'losers'
}) => {
	// Определяем класс для ячейки изменения цены (зеленый для роста, красный для падения)
	const changeClass = type === 'gainers' ? styles.positive : styles.negative

	return (
		<tr>
			<td>{coin.symbol}</td>
			<td>{coin.price || '-'}</td>
			<td className={changeClass}>{coin.percentChange}%</td>
		</tr>
	)
}

/**
 * TimeframeCoinsTable - компонент таблицы для отображения
 * монет с изменением цены за определенный временной период
 *
 * Отображает либо растущие (gainers), либо падающие (losers) монеты
 * за указанный таймфрейм (24h)
 */
export const TimeframeCoinsTable = ({
	title,
	type
}: TimeframeCoinsTableProps) => {
	// Получаем данные из Redux-стора с помощью селектора
	const timeframeData = useSelector(selectTimeframeData)

	// Определяем, какие данные отображать в зависимости от типа таблицы
	const coins = useMemo(() => {
		// Проверка наличия данных для указанного типа и таймфрейма
		if (!timeframeData || !timeframeData[type]) {
			return []
		}
		return timeframeData[type]
	}, [timeframeData, type])

	// Вычисляем, есть ли данные для отображения
	const hasData = useMemo(() => coins.length > 0, [coins])

	return (
		<div className={styles.tableContainer}>
			<h3 className={styles.tableTitle}>{title}</h3>

			{/* Показываем таблицу только если есть данные */}
			{hasData ? (
				<table className={styles.timeframeTable}>
					<thead>
						<tr>
							<th>Монета</th>
							<th>Цена</th>
							<th>Изменение</th>
						</tr>
					</thead>
					<tbody>
						{/* Отображаем строки для каждой монеты */}
						{coins.map((coin: TimeframeCoin) => (
							<TimeframeCoinsRow
								key={coin.symbol}
								coin={coin}
								type={type}
							/>
						))}
					</tbody>
				</table>
			) : (
				// Показываем индикатор при отсутствии данных
				<NoDataIndicator />
			)}
		</div>
	)
}
