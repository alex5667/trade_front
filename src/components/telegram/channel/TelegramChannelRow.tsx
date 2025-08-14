import { useCallback, useState } from 'react'

import tableStyles from '@/components/signal-table/volume-spike-table/VolumeSpikeTable.module.scss'
import { SimpleField } from '@/components/ui/fields/SImpleField'

import type {
	TelegramChannel,
	TelegramChannelUpsert
} from '@/types/telegram.types'

type EditableTelegramChannel = Partial<TelegramChannel> & {
	id: string | number
}

interface TelegramChannelRowProps {
	channel: EditableTelegramChannel
	onSave: (id: string, data: TelegramChannelUpsert) => Promise<void>
	onDelete: (id: string) => Promise<void>
	onOpenMeta: (e: React.MouseEvent, ch: EditableTelegramChannel) => void
	styles: {
		button: string
		buttonPrimary: string
		buttonDanger: string
	}
	isSaving?: boolean
	isDeleting?: boolean
}

export const TelegramChannelRow = ({
	channel,
	onSave,
	onDelete,
	onOpenMeta,
	styles,
	isSaving,
	isDeleting
}: TelegramChannelRowProps) => {
	const [editing, setEditing] = useState(false)
	const [form, setForm] = useState<Record<string, any>>({
		title: channel.title || '',
		username: channel.username || '',
		chatId: channel.chatId || '',
		link: channel.link || '',
		description: channel.description || '',
		isPaid: !!channel.isPaid,
		signalsFormat: channel.signalsFormat || 'NONE',
		marketsCsv: (channel.markets || []).join(', '),
		tagsCsv: (channel.tags || []).join(', '),
		winratePct: channel.winratePct ?? '',
		status: channel.status || 'ACTIVE'
	})
	const setField = useCallback(
		(k: string, v: any) => setForm(p => ({ ...p, [k]: v })),
		[]
	)
	const handleSave = useCallback(async () => {
		const payload: TelegramChannelUpsert = {
			title: String(form.title ?? '').trim(),
			username: String(form.username ?? '').trim() || undefined,
			chatId: form.chatId || undefined,
			link: String(form.link ?? '').trim(),
			description: String(form.description ?? '').trim() || undefined,
			isPaid: !!form.isPaid,
			signalsFormat: form.signalsFormat,
			markets: String(form.marketsCsv || '')
				.split(',')
				.map((s: string) => s.trim())
				.filter(Boolean),
			tags: String(form.tagsCsv || '')
				.split(',')
				.map((s: string) => s.trim())
				.filter(Boolean),
			winratePct: form.winratePct === '' ? undefined : String(form.winratePct),
			status: form.status
		}
		await onSave(String(channel.id), payload)
		setEditing(false)
	}, [channel.id, form, onSave])

	const fields: Array<{
		key: string
		label: string
		type?: string
		isCheckbox?: boolean
	}> = [
		{ key: 'title', label: 'Title' },
		{ key: 'username', label: 'Username' },
		{ key: 'chatId', label: 'Chat ID' },
		{ key: 'link', label: 'Link' },
		{ key: 'description', label: 'Description' },
		{ key: 'isPaid', label: 'Paid', isCheckbox: true },
		{ key: 'signalsFormat', label: 'Signals Format' },
		{ key: 'marketsCsv', label: 'Markets (csv)' },
		{ key: 'tagsCsv', label: 'Tags (csv)' },
		{ key: 'winratePct', label: 'Winrate %' },
		{ key: 'status', label: 'Status' }
	]

	return (
		<tr className={tableStyles.row}>
			<td className={tableStyles.cell}>
				<button
					aria-label='Подробнее'
					className={styles.button}
					onClick={e => onOpenMeta(e, channel)}
				>
					+
				</button>
			</td>
			{fields.map(f => (
				<td
					key={f.key}
					className={tableStyles.cell}
				>
					{editing ? (
						f.isCheckbox ? (
							<label>
								<input
									aria-label={f.label}
									type='checkbox'
									checked={!!form[f.key]}
									onChange={e => setField(f.key, e.target.checked)}
								/>{' '}
								{f.label}
							</label>
						) : (
							<SimpleField
								id={`edit-${f.key}-${channel.id}`}
								label={f.label}
								onChange={e => setField(f.key, e.target.value)}
								placeholder={f.label}
								extra=''
								value={form[f.key] ?? ''}
								type={f.type || 'text'}
							/>
						)
					) : f.isCheckbox ? (
						form[f.key] ? (
							'true'
						) : (
							'false'
						)
					) : (
						String(form[f.key] ?? '-')
					)}
				</td>
			))}
			<td className={tableStyles.cell}>
				{editing ? (
					<>
						<button
							aria-label='Save channel'
							className={styles.buttonPrimary}
							disabled={isSaving}
							onClick={handleSave}
						>
							Сохранить
						</button>
						<button
							aria-label='Cancel edit'
							className={styles.button}
							onClick={() => setEditing(false)}
						>
							Отмена
						</button>
					</>
				) : (
					<>
						<button
							aria-label='Edit channel'
							className={styles.button}
							onClick={() => setEditing(true)}
						>
							Изменить
						</button>
						<button
							aria-label='Delete channel'
							className={`${styles.button} ${styles.buttonDanger}`}
							disabled={isDeleting}
							onClick={() => onDelete(String(channel.id))}
						>
							Удалить
						</button>
					</>
				)}
			</td>
		</tr>
	)
}
