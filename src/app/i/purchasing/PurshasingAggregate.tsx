import dayjs from 'dayjs'

import { PurchasingsAggregate } from '@/types/purchasing.type'

import styles from './PurchasingAggregate.module.scss'

interface PurchasingAggregaterops {
	totalIngredientByWeek: PurchasingsAggregate
}

const PurchasingAggregate = ({
	totalIngredientByWeek
}: PurchasingAggregaterops) => {
	const { dates, week } = totalIngredientByWeek
	const sortedDates = Object.keys(dates).sort()
	const startDate = sortedDates[0]
	const endDate = sortedDates[sortedDates.length - 1]

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>Данные по закупкам</h1>

			<section>
				<h2 className={styles.sectionTitle}>
					Итог за неделю c {dayjs(startDate).format('DD-MM-YYYY')} по{' '}
					{dayjs(endDate).format('DD-MM-YYYY')}
				</h2>
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						<thead className={styles.tableHeader}>
							<tr>
								<th className={styles.th}>Ингредиент</th>
								<th className={styles.thCenter}>Gross Weight</th>
								<th className={styles.thCenter}>Coast</th>
								<th className={styles.thCenter}>Quantity</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(week).map(([ingredient, stats]) => (
								<tr
									key={ingredient}
									className={styles.row}
								>
									<td className={styles.td}>{ingredient}</td>
									<td className={styles.tdCenter}>{stats.grossWeight}</td>
									<td className={styles.tdCenter}>{stats.coast}</td>
									<td className={styles.tdCenter}>{stats.quantity}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.subTitle}>По датам</h2>
				{Object.entries(dates).map(([date, ingredients]) => (
					<div
						key={date}
						className={styles.dateBlock}
					>
						<h3 className={styles.dateHeading}>
							{dayjs(date).format('DD-MM-YYYY')}
						</h3>
						{Object.keys(ingredients).length === 0 ? (
							<p className={styles.noData}>Нет данных</p>
						) : (
							<div className={styles.tableContainer}>
								<table className={styles.table}>
									<thead className={styles.tableHeader}>
										<tr>
											<th className={styles.th}>Ингредиент</th>
											<th className={styles.thCenter}>Gross Weight</th>
											<th className={styles.thCenter}>Coast</th>
											<th className={styles.thCenter}>Quantity</th>
										</tr>
									</thead>
									<tbody>
										{Object.entries(ingredients).map(([ingredient, stats]) => (
											<tr
												key={ingredient}
												className={styles.row}
											>
												<td className={styles.td}>{ingredient}</td>
												<td className={styles.tdCenter}>{stats.grossWeight}</td>
												<td className={styles.tdCenter}>{stats.coast}</td>
												<td className={styles.tdCenter}>{stats.quantity}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				))}
			</section>
		</div>
	)
}

export default PurchasingAggregate
