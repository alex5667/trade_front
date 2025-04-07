'use client'

import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'

import { DatePicker } from '@/components/date-piker/DatePicker'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'

import {
	StockTransferDataFilters,
	StockTransferResponse
} from '@/types/stockTransfer.type'

import styles from './StockTransferPage.module.scss'
import {
	StockTransferByRangeDataFilters,
	useGetAllStockTransfersByRangeQuery,
	useGetAllStockTransfersQuery
} from '@/services/stock-transfer.service'

const StockTransferView = () => {
	const today = dayjs().startOf('day').toISOString()

	const [startDate, setStartDate] = useState<Date | undefined>(new Date(today))
	const [endDate, setEndDate] = useState<Date | undefined>(new Date(today))

	const [rangeStartDate, setRangeStartDate] = useState<Date | undefined>(
		undefined
	)
	const [rangeEndDate, setRangeEndDate] = useState<Date | undefined>(undefined)
	const [triggerDataLoad, setTriggerDataLoad] = useState(false)
	const [expandedId, setExpandedId] = useState<number | null>(null)

	const handleSetStartDate: Dispatch<
		SetStateAction<Date | undefined>
	> = value => {
		setStartDate(prev => {
			const newValue = typeof value === 'function' ? value(prev) : value
			return prev?.getTime() === newValue?.getTime() ? prev : newValue
		})
		setEndDate(undefined)
	}

	const handleSetEndDate: Dispatch<
		SetStateAction<Date | undefined>
	> = value => {
		setEndDate(prev => {
			const newValue = typeof value === 'function' ? value(prev) : value
			return prev?.getTime() === newValue?.getTime() ? prev : newValue
		})
	}

	const handleSetRangeStartDate: Dispatch<
		SetStateAction<Date | undefined>
	> = value => {
		setRangeStartDate(prev => {
			const newValue = typeof value === 'function' ? value(prev) : value
			return prev?.getTime() === newValue?.getTime() ? prev : newValue
		})
		setRangeEndDate(undefined)
		setTriggerDataLoad(false)
	}

	const handleSetRangeEndDate: Dispatch<
		SetStateAction<Date | undefined>
	> = value => {
		setRangeEndDate(prev => {
			const newValue = typeof value === 'function' ? value(prev) : value
			return prev?.getTime() === newValue?.getTime() ? prev : newValue
		})
		setTriggerDataLoad(false)
	}

	const handleLoadData = () => {
		if (rangeStartDate && rangeEndDate) {
			setTriggerDataLoad(true)
			toast.info('Процесс загрузки запущен')
		}
	}

	const toggleExpand = (id: number | undefined) => {
		if (id === undefined) return
		setExpandedId(prev => (prev === id ? null : id))
	}

	const { data, isFetching, isLoading } = useGetAllStockTransfersQuery(
		{
			startDate: startDate,
			endDate: endDate
		} as StockTransferDataFilters,
		{
			skip: !startDate || !endDate
		}
	)

	const {} = useGetAllStockTransfersByRangeQuery(
		{
			startDate: rangeStartDate,
			endDate: rangeEndDate
		} as StockTransferByRangeDataFilters,
		{
			skip: !rangeStartDate || !rangeEndDate || !triggerDataLoad
		}
	)

	if (isLoading || isFetching) {
		return <Loader />
	}

	if (!data || !Array.isArray(data)) {
		return <p>Нет данных о перемещениях за выбранный период</p>
	}

	// Подсчет итоговых значений
	const totalTransfers = data.length
	const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0)

	return (
		<div className={styles.wrapper}>
			<div className={styles.datePickers}>
				<DatePicker
					setDate={handleSetStartDate}
					position='left'
					placement='bottom'
					extra={styles.rightDatePicker}
				/>
				<DatePicker
					setDate={handleSetEndDate}
					placement='bottom'
				/>
			</div>
			{!isLoading && !isFetching && (
				<div className={styles.tableContainer}>
					<table className={styles.transfersTable}>
						<thead>
							<tr>
								<th>Дата</th>
								<th>Откуда</th>
								<th>Куда</th>
								<th>Блюдо</th>
								<th>Кол-во</th>
								<th>Регистратор</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item: StockTransferResponse) => (
								<>
									<tr
										key={item.id}
										className={expandedId === item.id ? styles.expandedRow : ''}
										onClick={() => toggleExpand(item.id)}
									>
										<td>{dayjs(item.date).format('DD.MM.YY')}</td>
										<td>
											{item.fromWarehouse?.name || `${item.fromWarehouseId}`}
										</td>
										<td>{item.toWarehouse?.name || `${item.toWarehouseId}`}</td>
										<td>{item.dish?.name || `Блюдо #${item.dishId}`}</td>
										<td>{item.quantity.toFixed(3)}</td>
										<td>{item.registrar || 'Не указан'}</td>
									</tr>
									{expandedId === item.id && (
										<tr className={styles.detailsRow}>
											<td colSpan={6}>
												<div className={styles.detailsTable}>
													<table>
														<tbody>
															<tr>
																<th>Регистратор:</th>
																<td>{item.registrar || 'Не указан'}</td>
															</tr>
															<tr>
																<th>Блюдо (полное):</th>
																<td>
																	{item.dish?.printName ||
																		item.dish?.name ||
																		'Не указано'}
																</td>
															</tr>
															<tr>
																<th>Создано:</th>
																<td>
																	{item.createdAt
																		? dayjs(item.createdAt).format(
																				'DD.MM.YYYY HH:mm'
																			)
																		: 'Не указано'}
																</td>
															</tr>
															<tr>
																<th>Обновлено:</th>
																<td>
																	{item.updatedAt
																		? dayjs(item.updatedAt).format(
																				'DD.MM.YYYY HH:mm'
																			)
																		: 'Не указано'}
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</td>
										</tr>
									)}
								</>
							))}
						</tbody>
					</table>
					<div className={styles.total}>
						<p>Итого:</p>
						<p>Кол-во перемещений: {totalTransfers}</p>
						<p>Кол-во товаров: {totalQuantity.toFixed(3)}</p>
					</div>
				</div>
			)}
			<div className={styles.rangeDatePickers}>
				<h2>Загрузка в базу по диапазону дат</h2>
				<DatePicker
					setDate={handleSetRangeStartDate}
					position='left'
					placement='top'
					extra={styles.rightDatePicker}
				/>
				<DatePicker
					setDate={handleSetRangeEndDate}
					placement='top'
				/>
				<Button
					onClick={handleLoadData}
					disabled={!rangeStartDate || !rangeEndDate}
					className={styles.loadButton}
				>
					Загрузить данные
				</Button>
			</div>
		</div>
	)
}

export default StockTransferView
