'use client'

import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'

import { DatePicker } from '@/components/date-piker/DatePicker'
import { Button } from '@/components/ui/buttons/Button'

import {
	RetailSaleByRangeDataFilters,
	RetailSaleDataFilters,
	RetailSaleResponse
} from '@/types/retail-sale.type'

import styles from './RetailSalePage.module.scss'
import {
	useGetAllRetailSalesByRangeQuery,
	useGetAllRetailSalesQuery
} from '@/services/retail-sale.service'

const RetailSaleView = () => {
	const today = dayjs().startOf('day').toISOString()

	const [startDate, setStartDate] = useState<Date | undefined>(new Date(today))
	const [endDate, setEndDate] = useState<Date | undefined>(new Date(today))

	const [rangeStartDate, setRangeStartDate] = useState<Date | undefined>(
		undefined
	)
	const [rangeEndDate, setRangeEndDate] = useState<Date | undefined>(undefined)
	const [triggerDataLoad, setTriggerDataLoad] = useState(false)

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

	const { data, isFetching, isLoading } = useGetAllRetailSalesQuery(
		{
			startDate: startDate,
			endDate: endDate
		} as RetailSaleDataFilters,
		{
			skip: !startDate || !endDate
		}
	)

	const {} = useGetAllRetailSalesByRangeQuery(
		{
			startDate: rangeStartDate,
			endDate: rangeEndDate
		} as RetailSaleByRangeDataFilters,
		{
			skip: !rangeStartDate || !rangeEndDate || !triggerDataLoad
		}
	)

	// if (isLoading || isFetching) {
	// 	return <Loader />
	// }

	if (!data || !Array.isArray(data)) {
		return <p>Нет данных ...</p>
	}

	// Подсчёт итоговых значений
	const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0)
	const totalAmount = data.reduce((acc, item) => acc + item.totalAmount, 0)

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
					<table className={styles.salesTable}>
						<thead>
							<tr>
								<th>Блюдо</th>
								<th>Кол-во</th>
								<th>Цена</th>
								<th>Сумма</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item: RetailSaleResponse) => (
								<tr key={item.id}>
									<td>{item.dish.name}</td>
									<td>{item.quantity}</td>
									<td>{item.price.toFixed(2)}</td>
									<td>{item.totalAmount.toFixed(2)}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td>Итого:</td>
								<td>{totalQuantity}</td>
								<td>-</td>
								<td>{totalAmount.toFixed(2)}</td>
							</tr>
						</tfoot>
					</table>
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

export default RetailSaleView
