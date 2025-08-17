import { useState } from 'react'

import styles from './TelegramDateRangePicker.module.scss'

interface TelegramDateRangePickerProps {
	initialStart: string
	initialEnd: string
	onApply: (startDate: string, endDate: string) => void
}

export const TelegramDateRangePicker = ({
	initialStart,
	initialEnd,
	onApply
}: TelegramDateRangePickerProps) => {
	const [startDate, setStartDate] = useState(initialStart)
	const [endDate, setEndDate] = useState(initialEnd)

	const handleApply = () => {
		if (!startDate || !endDate) return
		onApply(startDate, endDate)
	}

	return (
		<div className={styles.container}>
			<div className={styles.dateInputs}>
				<div className={styles.dateField}>
					<label className={styles.dateLabel}>Начальная дата</label>
					<input
						type='date'
						className={styles.dateInput}
						value={startDate}
						onChange={e => setStartDate(e.target.value)}
					/>
				</div>
				<div className={styles.dateField}>
					<label className={styles.dateLabel}>Конечная дата</label>
					<input
						type='date'
						className={styles.dateInput}
						value={endDate}
						onChange={e => setEndDate(e.target.value)}
					/>
				</div>
			</div>
			<button
				onClick={handleApply}
				className={styles.applyButton}
			>
				Применить
			</button>
		</div>
	)
}
