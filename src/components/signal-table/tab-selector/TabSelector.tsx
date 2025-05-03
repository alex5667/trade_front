'use client'

import styles from './TabSelector.module.scss'

type TabType =
	| 'volatility'
	| 'volume'
	| 'priceChange'
	| 'topGainers'
	| 'topLosers'
	| 'volatilityRanges'

interface TabSelectorProps {
	activeTab: TabType
	onChange: (tab: TabType) => void
}

export function TabSelector({ activeTab, onChange }: TabSelectorProps) {
	const tabs: { id: TabType; label: string }[] = [
		{ id: 'volatility', label: 'Волатильность' },
		{ id: 'volume', label: 'Объем' },
		{ id: 'priceChange', label: 'Изменения цен' },
		{ id: 'topGainers', label: 'Топ Растущих' },
		{ id: 'topLosers', label: 'Топ Падающих' },
		{ id: 'volatilityRanges', label: 'Волатильность в диапазоне' }
	]

	return (
		<div className={styles.container}>
			<ul className={styles.list}>
				{tabs.map(tab => (
					<li
						key={tab.id}
						className={styles.item}
					>
						<button
							className={`${styles.tabButton} ${
								activeTab === tab.id ? styles.active : styles.inactive
							}`}
							onClick={() => onChange(tab.id)}
						>
							{tab.label}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}
