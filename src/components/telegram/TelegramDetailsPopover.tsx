interface TelegramDetailsPopoverProps {
	anchor: { top: number; left: number } | null
	data: any
	onClose: () => void
}

export const TelegramDetailsPopover = ({
	anchor,
	data,
	onClose
}: TelegramDetailsPopoverProps) => {
	if (!anchor || !data) return null

	const format = (key: string, value: any) => {
		if (value === null || value === undefined) return '-'
		try {
			if (key === 'tp') return JSON.stringify(value, null, 2)
			if (typeof value === 'object') return JSON.stringify(value)
			return String(value)
		} catch {
			return String(value)
		}
	}

	const formatTime = (value: any) => {
		if (!value) return '-'
		try {
			const ms = typeof value === 'number' ? value : Date.parse(String(value))
			if (!Number.isNaN(ms)) {
				return new Date(ms).toLocaleString()
			}
		} catch {}
		return String(value)
	}

	const getFieldLabel = (key: string) => {
		const labels: Record<string, string> = {
			chatId: 'Chat ID',
			chatTitle: 'Название чата',
			confidence: 'Уверенность',
			receivedAt: 'Получено',
			createdAt: 'Создано',
			msgId: 'ID сообщения',
			messageId: 'ID сообщения',
			timeframe: 'Таймфрейм',
			exchange: 'Биржа',
			leverage: 'Плечо',
			riskPct: 'Риск %',
			tpPct: 'TP %',
			stop: 'Stop Loss',
			tp: 'Take Profit',
			entry: 'Entry',
			price: 'Цена',
			symbol: 'Символ',
			direction: 'Направление'
		}
		return labels[key] || key
	}

	const importantFields = [
		'symbol',
		'direction',
		'entry',
		'stop',
		'tp',
		'leverage',
		'riskPct',
		'tpPct'
	]
	const timeFields = ['receivedAt', 'createdAt', 'timestamp']
	const hiddenFields = [
		'chatId',
		'chatTitle',
		'confidence',
		'msgId',
		'messageId',
		'timeframe',
		'exchange'
	]

	return (
		<>
			<button
				className='fixed inset-0 z-40 cursor-default'
				aria-label='overlay'
				onClick={onClose}
			></button>
			<div
				role='dialog'
				aria-modal='true'
				className='fixed z-50 rounded shadow-lg border border-gray-700 bg-gray-900 text-white p-4 w-[400px] max-h-[80vh] overflow-y-auto'
				style={{ top: anchor.top, left: anchor.left }}
			>
				<button
					onClick={onClose}
					className='absolute right-2 top-2 text-gray-300 hover:text-white text-xl'
					aria-label='Закрыть'
				>
					×
				</button>
				<h2 className='text-lg font-semibold mb-4 text-center'>
					Детали сигнала
				</h2>

				{/* Основные поля */}
				<div className='mb-4'>
					<h3 className='text-sm font-medium text-blue-400 mb-2'>
						Основная информация
					</h3>
					<div className='grid grid-cols-1 gap-2 text-sm'>
						{importantFields.map(field => {
							if (data[field] !== undefined && data[field] !== null) {
								return (
									<div
										key={field}
										className='flex justify-between'
									>
										<span className='text-gray-400'>
											{getFieldLabel(field)}:
										</span>
										<span className='text-white font-medium'>
											{format(field, data[field])}
										</span>
									</div>
								)
							}
							return null
						})}
					</div>
				</div>

				{/* Временные поля */}
				<div className='mb-4'>
					<h3 className='text-sm font-medium text-green-400 mb-2'>Время</h3>
					<div className='grid grid-cols-1 gap-2 text-sm'>
						{timeFields.map(field => {
							if (data[field] !== undefined && data[field] !== null) {
								return (
									<div
										key={field}
										className='flex justify-between'
									>
										<span className='text-gray-400'>
											{getFieldLabel(field)}:
										</span>
										<span className='text-white'>
											{formatTime(data[field])}
										</span>
									</div>
								)
							}
							return null
						})}
					</div>
				</div>

				{/* Скрытые поля */}
				<div className='mb-4'>
					<h3 className='text-sm font-medium text-gray-400 mb-2'>
						Техническая информация
					</h3>
					<div className='grid grid-cols-1 gap-2 text-sm'>
						{hiddenFields.map(field => {
							if (data[field] !== undefined && data[field] !== null) {
								return (
									<div
										key={field}
										className='flex justify-between'
									>
										<span className='text-gray-400'>
											{getFieldLabel(field)}:
										</span>
										<span className='text-white'>
											{format(field, data[field])}
										</span>
									</div>
								)
							}
							return null
						})}
					</div>
				</div>

				{/* Остальные поля */}
				<div className='mb-4'>
					<h3 className='text-sm font-medium text-yellow-400 mb-2'>
						Дополнительно
					</h3>
					<div className='grid grid-cols-1 gap-2 text-sm'>
						{Object.keys(data).map(key => {
							if (
								!importantFields.includes(key) &&
								!timeFields.includes(key) &&
								!hiddenFields.includes(key)
							) {
								return (
									<div
										key={key}
										className='flex justify-between'
									>
										<span className='text-gray-400'>{getFieldLabel(key)}:</span>
										<span className='text-white'>{format(key, data[key])}</span>
									</div>
								)
							}
							return null
						})}
					</div>
				</div>
			</div>
		</>
	)
}
