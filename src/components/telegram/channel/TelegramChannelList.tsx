import tableStyles from '@/components/signal-table/volume-spike-table/VolumeSpikeTable.module.scss'

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
	return (
		<div className={tableStyles.tableWrapper}>
			<table className={tableStyles.table}>
				<thead>
					<tr className={`${tableStyles.headRow} ${tableStyles.headSticky}`}>
						<th
							scope='col'
							className={`${tableStyles.cell} ${tableStyles.stickyCol0}`}
						>
							ID
						</th>
						<th
							scope='col'
							className={`${tableStyles.cell} ${tableStyles.stickyCol1}`}
						>
							Created
						</th>
						<th
							scope='col'
							className={`${tableStyles.cell} ${tableStyles.stickyCol2}`}
						>
							Updated
						</th>
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
							onSave={(id, data) => onSave(id, data)}
							onDelete={id => onDelete(id)}
							styles={styles as any}
							isSaving={isSaving}
							isDeleting={isDeleting}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}
