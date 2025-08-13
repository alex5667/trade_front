import { FormEvent, useState } from 'react'

import { SimpleField } from '@/components/ui/fields/SImpleField'

import type { CreateTelegramChannelDto } from '@/services/telegramChannel.api'

interface TelegramChannelFormProps {
	onCreate: (data: CreateTelegramChannelDto) => Promise<void>
	className?: string
	buttonClass?: string
	labelClass?: string
}

export const TelegramChannelForm = ({
	onCreate,
	className = '',
	buttonClass = '',
	labelClass = ''
}: TelegramChannelFormProps) => {
	const [form, setForm] = useState<Record<string, any>>({
		title: '',
		username: '',
		chatId: '',
		link: '',
		description: '',
		language: '',
		membersCount: '',
		isPaid: false,
		price: '',
		signalsFormat: 'NONE',
		marketsCsv: '',
		tagsCsv: '',
		winratePct: '',
		status: 'ACTIVE',
		source: 'MANUAL'
	})
	const setField = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!String(form.title || '').trim()) return
		const payload: CreateTelegramChannelDto = {
			title: String(form.title).trim(),
			username: String(form.username || '').trim() || undefined,
			chatId: form.chatId || undefined,
			link: String(form.link || '').trim(),
			description: String(form.description || '').trim() || undefined,
			language: String(form.language || '').trim() || undefined,
			membersCount:
				form.membersCount === '' ? undefined : Number(form.membersCount),
			isPaid: !!form.isPaid,
			price: form.price === '' ? undefined : String(form.price),
			signalsFormat: form.signalsFormat,
			markets: String(form.marketsCsv || '')
				.split(',')
				.map(s => s.trim())
				.filter(Boolean),
			tags: String(form.tagsCsv || '')
				.split(',')
				.map(s => s.trim())
				.filter(Boolean),
			winratePct: form.winratePct === '' ? undefined : String(form.winratePct),
			status: form.status,
			source: form.source
		}
		console.log('Create TelegramChannel payload:', payload)
		await onCreate(payload)
		setForm({
			title: '',
			username: '',
			chatId: '',
			link: '',
			description: '',
			language: '',
			membersCount: '',
			isPaid: false,
			price: '',
			signalsFormat: 'NONE',
			marketsCsv: '',
			tagsCsv: '',
			winratePct: '',
			status: 'ACTIVE',
			source: 'MANUAL'
		})
	}
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
		{ key: 'language', label: 'Language' },
		{ key: 'membersCount', label: 'Members', type: 'number' },
		{ key: 'isPaid', label: 'Paid', isCheckbox: true },
		{ key: 'price', label: 'Price' },
		{ key: 'signalsFormat', label: 'Signals Format' },
		{ key: 'marketsCsv', label: 'Markets (csv)' },
		{ key: 'tagsCsv', label: 'Tags (csv)' },
		{ key: 'winratePct', label: 'Winrate %' },
		{ key: 'status', label: 'Status' },
		{ key: 'source', label: 'Source' }
	]
	return (
		<form
			onSubmit={handleSubmit}
			className={className}
		>
			{fields.map(f => (
				<div key={f.key}>
					{f.isCheckbox ? (
						<label className={labelClass}>
							<input
								type='checkbox'
								checked={!!form[f.key]}
								onChange={e => setField(f.key, e.target.checked)}
							/>{' '}
							{f.label}
						</label>
					) : (
						<SimpleField
							id={f.key}
							label={f.label}
							onChange={e => setField(f.key, e.target.value)}
							placeholder={f.label}
							extra=''
							value={form[f.key] ?? ''}
							type={f.type || 'text'}
						/>
					)}
				</div>
			))}
			<button
				type='submit'
				className={buttonClass}
			>
				Добавить
			</button>
		</form>
	)
}
