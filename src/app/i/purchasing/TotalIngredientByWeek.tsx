interface IngredientData {
	grossWeight: number
	coast: number
	quantity: number
}

interface TotalIngredientByWeek {
	dates: {
		[date: string]: {
			[ingredient: string]: IngredientData
		}
	}
	week: {
		[ingredient: string]: IngredientData
	}
}

interface TotalIngredientByWeekTableProps {
	totalIngredientByWeekTable: TotalIngredientByWeek
}
const TotalIngredientByWeekTable = ({
	totalIngredientByWeekTable
}: TotalIngredientByWeekTableProps) => {
	return (
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-4'>Ингредиенты по датам</h2>

			{/* Дни недели */}
			{Object.entries(totalIngredientByWeekTable.dates).map(
				([date, ingredients]) => (
					<div
						key={date}
						className='mb-6 border rounded-lg p-4 shadow'
					>
						<h3 className='text-xl font-semibold mb-2'>
							Дата: {new Date(date).toLocaleDateString('ru-RU')}
						</h3>
						{Object.keys(ingredients).length > 0 ? (
							<table className='w-full border-collapse border'>
								<thead>
									<tr className='bg-db-sidebar'>
										<th className='border p-2 text-left'>Ингредиент</th>
										<th className='border p-2 text-center'>Вес (кг)</th>
										<th className='border p-2 text-center'>Стоимость (₴)</th>
										<th className='border p-2 text-center'>Количество</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(ingredients).map(([name, stats]) => (
										<tr
											key={name}
											className='border-b'
										>
											<td className='border p-2'>{name}</td>
											<td className='border p-2 text-center'>
												{stats.grossWeight.toFixed(2)}
											</td>
											<td className='border p-2 text-center'>{stats.coast}</td>
											<td className='border p-2 text-center'>
												{stats.quantity}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p className='text-gray-500'>Нет данных</p>
						)}
					</div>
				)
			)}

			{/* Итог за неделю */}
			<div className='border rounded-lg p-4 shadow'>
				<h2 className='text-2xl font-bold mb-2'>Суммарно за неделю</h2>
				<table className='w-full border-collapse border'>
					<thead>
						<tr className='bg-db-sidebar'>
							<th className='border p-2 text-left'>Ингредиент</th>
							<th className='border p-2 text-center'>Вес (кг)</th>
							<th className='border p-2 text-center'>Стоимость (₴)</th>
							<th className='border p-2 text-center'>Количество</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(totalIngredientByWeekTable.week).map(
							([name, stats]) => (
								<tr
									key={name}
									className='border-b'
								>
									<td className='border p-2'>{name}</td>
									<td className='border p-2 text-center'>
										{stats.grossWeight.toFixed(2)}
									</td>
									<td className='border p-2 text-center'>{stats.coast}</td>
									<td className='border p-2 text-center'>{stats.quantity}</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default TotalIngredientByWeekTable
