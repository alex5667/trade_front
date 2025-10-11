'use client'

import { useMemo, useState } from 'react'

import { Regime } from '@/lib/regime-tips'
import { REGIME_TIPS_COMPACT, compactTips } from '@/lib/regime-tips-compact'

const colorByRegime: Record<Regime, string> = {
	range: '#6b7280',
	squeeze: '#eab308',
	trending_bull: '#22c55e',
	trending_bear: '#ef4444',
	expansion: '#3b82f6'
}

type SectionKey =
	| 'do'
	| 'avoid'
	| 'entries'
	| 'confirmations'
	| 'exits'
	| 'risk'
	| 'invalidation'
	| 'transitions'
	| 'checklist'

const ORDER: Array<{ key: SectionKey; title: string; emoji: string }> = [
	{ key: 'do', title: 'Делать', emoji: '✅' },
	{ key: 'entries', title: 'Входы', emoji: '🎯' },
	{ key: 'checklist', title: 'Чек-лист', emoji: '🧾' },
	{ key: 'confirmations', title: 'Подтверждения', emoji: '🔎' },
	{ key: 'exits', title: 'Выходы', emoji: '📤' },
	{ key: 'risk', title: 'Риск', emoji: '🛡' },
	{ key: 'avoid', title: 'Избегать', emoji: '⛔' },
	{ key: 'invalidation', title: 'Инвалидация', emoji: '❌' },
	{ key: 'transitions', title: 'Смена режима', emoji: '🔁' }
]

export function MobileRegimeTipsCard({ regime }: { regime: Regime }) {
	// Берём уже компактную версию, и дополнительно страхуемся
	const base = REGIME_TIPS_COMPACT[regime]
	const t = useMemo(() => compactTips(base, 3), [base])

	const col = colorByRegime[regime]
	const [openKey, setOpenKey] = useState<SectionKey>('do')

	return (
		<div
			style={{
				border: `1px solid ${col}`,
				borderRadius: 12,
				padding: 12,
				background: '#0b0c0f',
				color: '#e5e7eb'
			}}
		>
			<div
				style={{
					display: 'flex',
					gap: 8,
					alignItems: 'center',
					color: col,
					marginBottom: 6
				}}
			>
				<span
					style={{ width: 8, height: 8, borderRadius: 8, background: col }}
				/>
				<strong style={{ fontSize: 14 }}>{t.title}</strong>
			</div>
			<p style={{ margin: '2px 0 10px 0', fontSize: 12, opacity: 0.9 }}>
				{t.summary}
			</p>

			<div style={{ display: 'grid', gap: 8 }}>
				{ORDER.map(({ key, title, emoji }) => {
					const list = (t as any)[key] as string[] | undefined
					if (!list?.length) return null
					const isOpen = openKey === key
					return (
						<div
							key={key}
							style={{
								border: '1px solid #1f2937',
								borderRadius: 10,
								overflow: 'hidden',
								background: '#0f1115'
							}}
						>
							<button
								onClick={() => setOpenKey(isOpen ? (null as any) : key)}
								style={{
									width: '100%',
									textAlign: 'left',
									padding: '8px 10px',
									background: 'transparent',
									color: '#e5e7eb',
									fontWeight: 600,
									fontSize: 13,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between'
								}}
							>
								<span>
									{emoji} {title}
								</span>
								<span style={{ opacity: 0.7 }}>{isOpen ? '−' : '+'}</span>
							</button>
							{isOpen && (
								<ul
									style={{
										margin: 0,
										padding: '0 14px 10px 22px',
										fontSize: 12,
										lineHeight: 1.35
									}}
								>
									{list.slice(0, 3).map((x, i) => (
										<li
											key={i}
											style={{ marginTop: 6 }}
										>
											{x}
										</li>
									))}
								</ul>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
