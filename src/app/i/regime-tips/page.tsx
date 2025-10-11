/**
 * Regime Tips Page - Страница с подсказками по режимам
 * ------------------------------
 * Показывает детальные рекомендации для всех режимов рынка
 */
'use client'

import { useState } from 'react'

import { RegimeTipsCard, WhyGateBadge } from '@/components/regime-tips'

import styles from './RegimeTips.module.scss'
import { Regime, SignalType } from '@/lib/regime-tips'

/**
 * Regime Tips Page - Страница с подсказками по режимам
 * ------------------------------
 * Показывает детальные рекомендации для всех режимов рынка
 */

const REGIMES: Regime[] = [
	'range',
	'squeeze',
	'trending_bull',
	'trending_bear',
	'expansion'
]

const SIGNAL_TYPES: Array<{ type: SignalType; label: string }> = [
	{ type: 'fvg', label: 'FVG' },
	{ type: 'ob', label: 'Order Block' },
	{ type: 'breaker', label: 'Breaker' },
	{ type: 'volumeSpike', label: 'Volume Spike' },
	{ type: 'volatility', label: 'Volatility' },
	{ type: 'smt', label: 'SMT' },
	{ type: 'other', label: 'Other' }
]

export default function RegimeTipsPage() {
	const [selectedRegime, setSelectedRegime] = useState<Regime>('range')

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<h1 className={styles.title}>Подсказки по режимам рынка</h1>
				<p className={styles.subtitle}>
					Детальные рекомендации по торговле в различных рыночных условиях
				</p>
			</div>

			<div className={styles.regimeSelector}>
				{REGIMES.map(regime => (
					<button
						key={regime}
						className={`${styles.regimeButton} ${selectedRegime === regime ? styles.active : ''}`}
						onClick={() => setSelectedRegime(regime)}
						data-regime={regime}
					>
						{regime.replace('_', ' ').toUpperCase()}
					</button>
				))}
			</div>

			<div className={styles.content}>
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Подсказки для режима</h2>
					<RegimeTipsCard regime={selectedRegime} />
				</section>

				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>
						Статус сигналов в режиме {selectedRegime}
					</h2>
					<div className={styles.gateRules}>
						<div className={styles.gateGrid}>
							{SIGNAL_TYPES.map(({ type, label }) => (
								<div
									key={type}
									className={styles.gateItem}
								>
									<span className={styles.gateLabel}>{label}</span>
									<WhyGateBadge
										regime={selectedRegime}
										type={type}
										showTooltip={true}
									/>
								</div>
							))}
						</div>

						<div className={styles.directionTests}>
							<h3 className={styles.directionTitle}>
								Проверка по направлению (для трендов)
							</h3>
							<div className={styles.directionGrid}>
								<div className={styles.directionItem}>
									<span className={styles.directionLabel}>FVG Long</span>
									<WhyGateBadge
										regime={selectedRegime}
										type='fvg'
										side='long'
										showTooltip={true}
									/>
								</div>
								<div className={styles.directionItem}>
									<span className={styles.directionLabel}>FVG Short</span>
									<WhyGateBadge
										regime={selectedRegime}
										type='fvg'
										side='short'
										showTooltip={true}
									/>
								</div>
								<div className={styles.directionItem}>
									<span className={styles.directionLabel}>OB Long</span>
									<WhyGateBadge
										regime={selectedRegime}
										type='ob'
										side='long'
										showTooltip={true}
									/>
								</div>
								<div className={styles.directionItem}>
									<span className={styles.directionLabel}>OB Short</span>
									<WhyGateBadge
										regime={selectedRegime}
										type='ob'
										side='short'
										showTooltip={true}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}
