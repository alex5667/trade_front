/**
 * RegimeTipsCard - Карточка с подсказками по торговле в режиме
 * ------------------------------
 * Отображает детальные рекомендации для текущего рыночного режима
 */
'use client'

import React from 'react'

import s from './RegimeTipsCard.module.scss'
import { REGIME_TIPS, Regime } from '@/lib/regime-tips'

/**
 * RegimeTipsCard - Карточка с подсказками по торговле в режиме
 * ------------------------------
 * Отображает детальные рекомендации для текущего рыночного режима
 */

interface RegimeTipsCardProps {
	regime: Regime
	compact?: boolean
}

export const RegimeTipsCard: React.FC<RegimeTipsCardProps> = ({
	regime,
	compact = false
}) => {
	const tips = REGIME_TIPS[regime]

	return (
		<div
			className={`${s.card} ${compact ? s.compact : ''}`}
			data-regime={regime}
		>
			<div className={s.header}>
				<div
					className={s.indicator}
					data-regime={regime}
				/>
				<h3 className={s.title}>{tips.title}</h3>
			</div>

			<p className={s.summary}>{tips.summary}</p>

			<div className={s.sections}>
				<Section
					title='✅ Делать'
					items={tips.do}
				/>
				<Section
					title='⛔ Избегать'
					items={tips.avoid}
				/>
				<Section
					title='🎯 Входы'
					items={tips.entries}
				/>
				<Section
					title='🔎 Подтверждения'
					items={tips.confirmations}
				/>
				<Section
					title='🎯 Выходы'
					items={tips.exits}
				/>
				<Section
					title='🛡 Риск'
					items={tips.risk}
				/>
				<Section
					title='❌ Инвалидация'
					items={tips.invalidation}
				/>
				<Section
					title='🔁 Смена режима'
					items={tips.transitions}
				/>
			</div>

			<div className={s.checklistSection}>
				<Section
					title='🧾 Чек-лист'
					items={tips.checklist}
				/>
			</div>
		</div>
	)
}

interface SectionProps {
	title: string
	items: string[]
}

const Section: React.FC<SectionProps> = ({ title, items }) => {
	return (
		<div className={s.section}>
			<div className={s.sectionTitle}>{title}</div>
			<ul className={s.sectionList}>
				{items.map((item, i) => (
					<li key={i}>{item}</li>
				))}
			</ul>
		</div>
	)
}

export default RegimeTipsCard
