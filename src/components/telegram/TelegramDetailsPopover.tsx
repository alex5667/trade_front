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
				className='fixed z-50 rounded shadow-lg border border-gray-700 bg-gray-900 text-white p-4 w-[320px]'
				style={{ top: anchor.top, left: anchor.left }}
			>
				<button
					onClick={onClose}
					className='absolute right-2 top-2 text-gray-300 hover:text-white'
					aria-label='Закрыть'
				>
					×
				</button>
				<h2 className='text-sm font-semibold mb-2'>Подробнее</h2>
				<div className='grid grid-cols-1 gap-1 text-sm'>
					<div>
						<span className='text-gray-400'>chatId:</span>{' '}
						{format('chatId', data?.chatId)}
					</div>
					<div>
						<span className='text-gray-400'>chatTitle:</span>{' '}
						{format('chatTitle', data?.chatTitle)}
					</div>
					<div>
						<span className='text-gray-400'>confidence:</span>{' '}
						{format('confidence', data?.confidence)}
					</div>
					<div>
						<span className='text-gray-400'>receivedAt:</span>{' '}
						{format('receivedAt', data?.receivedAt)}
					</div>
					<div>
						<span className='text-gray-400'>createdAt:</span>{' '}
						{format('createdAt', data?.createdAt)}
					</div>
					<div>
						<span className='text-gray-400'>msgId:</span>{' '}
						{format('msgId', data?.msgId ?? data?.messageId)}
					</div>
				</div>
			</div>
		</>
	)
}
