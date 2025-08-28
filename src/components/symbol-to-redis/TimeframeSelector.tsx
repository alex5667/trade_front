import { useMemo } from 'react'

import { Checkbox } from '@/components/ui/checkbox/Checkbox'

import { DEFAULT_TIMEFRAMES, TIMEFRAMES } from '@/types/symbol-to-redis.types'

import styles from './TimeframeSelector.module.scss'

interface TimeframeSelectorProps {
	selectedTimeframes: string[]
	onTimeframesChange: (timeframes: string[]) => void
	disabled?: boolean
}

export const TimeframeSelector = ({
	selectedTimeframes,
	onTimeframesChange,
	disabled = false
}: TimeframeSelectorProps) => {
	// Группируем таймфреймы по категориям для лучшего отображения
	const groupedTimeframes = useMemo(() => {
		return {
			minutes: TIMEFRAMES.filter(
				tf => tf.startsWith('M') && !tf.startsWith('MN')
			),
			hours: TIMEFRAMES.filter(tf => tf.startsWith('H')),
			days: TIMEFRAMES.filter(tf => tf.startsWith('D')),
			weeks: TIMEFRAMES.filter(tf => tf.startsWith('W')),
			months: TIMEFRAMES.filter(tf => tf.startsWith('MN')),
			quarters: TIMEFRAMES.filter(tf => tf.startsWith('Q')),
			years: TIMEFRAMES.filter(tf => tf.startsWith('Y'))
		}
	}, [])

	const handleTimeframeToggle = (timeframe: string) => {
		if (disabled) return

		const newTimeframes = selectedTimeframes.includes(timeframe)
			? selectedTimeframes.filter(tf => tf !== timeframe)
			: [...selectedTimeframes, timeframe]

		onTimeframesChange(newTimeframes)
	}

	const handleSelectAll = () => {
		if (disabled) return
		onTimeframesChange([...TIMEFRAMES])
	}

	const handleClearAll = () => {
		if (disabled) return
		onTimeframesChange([])
	}

	const handleResetToDefault = () => {
		if (disabled) return
		onTimeframesChange([...DEFAULT_TIMEFRAMES])
	}

	const renderTimeframeGroup = (title: string, timeframes: string[]) => (
		<div
			key={title}
			className={styles.timeframeGroup}
		>
			<h4 className={styles.groupTitle}>{title}</h4>
			<div className={styles.timeframeGrid}>
				{timeframes.map(timeframe => (
					<label
						key={timeframe}
						className={styles.timeframeItem}
					>
						<Checkbox
							checked={selectedTimeframes.includes(timeframe)}
							onChange={() => handleTimeframeToggle(timeframe)}
						/>
						<span className={styles.timeframeLabel}>{timeframe}</span>
					</label>
				))}
			</div>
		</div>
	)

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3 className={styles.title}>Выберите таймфреймы</h3>
				<div className={styles.actions}>
					<button
						type='button'
						onClick={handleSelectAll}
						disabled={disabled}
						className={styles.actionButton}
					>
						Выбрать все
					</button>
					<button
						type='button'
						onClick={handleResetToDefault}
						disabled={disabled}
						className={styles.actionButton}
					>
						По умолчанию
					</button>
					<button
						type='button'
						onClick={handleClearAll}
						disabled={disabled}
						className={styles.actionButton}
					>
						Очистить
					</button>
				</div>
			</div>

			<div className={styles.timeframesContainer}>
				{renderTimeframeGroup('Минуты', groupedTimeframes.minutes)}
				{renderTimeframeGroup('Часы', groupedTimeframes.hours)}
				{renderTimeframeGroup('Дни', groupedTimeframes.days)}
				{renderTimeframeGroup('Недели', groupedTimeframes.weeks)}
				{renderTimeframeGroup('Месяцы', groupedTimeframes.months)}
				{renderTimeframeGroup('Кварталы', groupedTimeframes.quarters)}
				{renderTimeframeGroup('Годы', groupedTimeframes.years)}
			</div>

			{selectedTimeframes.length > 0 && (
				<div className={styles.selectedInfo}>
					Выбрано: {selectedTimeframes.length} из {TIMEFRAMES.length}
				</div>
			)}
		</div>
	)
}
