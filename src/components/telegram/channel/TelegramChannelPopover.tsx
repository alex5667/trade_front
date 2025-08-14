import chStyles from './Channel.module.scss'

interface TelegramChannelPopoverProps {
	anchor: { top: number; left: number } | null
	data: { id?: string | number; createdAt?: string; updatedAt?: string } | null
	onClose: () => void
}

export const TelegramChannelPopover = ({
	anchor,
	data,
	onClose
}: TelegramChannelPopoverProps) => {
	if (!anchor || !data) return null
	const format = (value: any) =>
		value === null || value === undefined || value === '' ? '-' : String(value)
	return (
		<>
			<button
				className={chStyles.popoverOverlay}
				aria-label='overlay'
				onClick={onClose}
			></button>
			<div
				role='dialog'
				aria-modal='true'
				className={chStyles.popover}
				style={{ top: anchor.top, left: anchor.left }}
			>
				<button
					onClick={onClose}
					className={chStyles.popoverClose}
					aria-label='Закрыть'
				>
					×
				</button>
				<h2 className={chStyles.popoverTitle}>Channel meta</h2>
				<div className={chStyles.popoverMeta}>
					<div>
						<span className={chStyles.popoverKey}>ID:</span> {format(data.id)}
					</div>
					<div>
						<span className={chStyles.popoverKey}>Created:</span>{' '}
						{format(data.createdAt)}
					</div>
					<div>
						<span className={chStyles.popoverKey}>Updated:</span>{' '}
						{format(data.updatedAt)}
					</div>
				</div>
			</div>
		</>
	)
}
