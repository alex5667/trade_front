import { useState } from 'react'

import tableStyles from '@/components/signal-table/volume-spike-table/VolumeSpikeTable.module.scss'

import { TelegramChannelPopover } from './TelegramChannelPopover'
import { TelegramChannelRow } from './TelegramChannelRow'
import styles from '@/app/i/telegram-channel/TelegramChannel.module.scss'

interface TelegramChannelListProps {
	channels: any[]
	onSave: (id: string | number, data: Record<string, any>) => Promise<void>
	onDelete: (id: string | number) => Promise<void>
	isSaving?: boolean
	isDeleting?: boolean
}

export const TelegramChannelList = ({
	channels,
	onSave,
	onDelete,
	isSaving,
	isDeleting
}: TelegramChannelListProps) => {
	const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
		null
	)
	const [meta, setMeta] = useState<any | null>(null)
	const handleOpen = (e: React.MouseEvent, ch: any) => {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
		setAnchor({
			top: rect.top + window.scrollY + 24,
			left: rect.left + window.scrollX + 16
		})
		setMeta({ id: ch.id, createdAt: ch.createdAt, updatedAt: ch.updatedAt })
	}
	const handleClose = () => {
		setAnchor(null)
		setMeta(null)
	}
	return (
		<div className={tableStyles.tableWrapper}>
			<table className={tableStyles.table}>
				<thead>
					<tr className={`${tableStyles.headRow} ${tableStyles.headSticky}`}>
						<th
							scope='col'
							className={tableStyles.cell}
						></th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Title
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Username
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Chat ID
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Link
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Description
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Paid
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Signals Format
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Markets (csv)
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Tags (csv)
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Winrate %
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Status
						</th>
						<th
							scope='col'
							className={tableStyles.cell}
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{channels.map(ch => (
						<TelegramChannelRow
							key={String(ch.id)}
							channel={ch}
							onOpenMeta={handleOpen}
							onSave={(id, data) => onSave(id, data)}
							onDelete={id => onDelete(id)}
							styles={styles as any}
							isSaving={isSaving}
							isDeleting={isDeleting}
						/>
					))}
				</tbody>
			</table>
			<TelegramChannelPopover
				anchor={anchor}
				data={meta}
				onClose={handleClose}
			/>
		</div>
	)
}
