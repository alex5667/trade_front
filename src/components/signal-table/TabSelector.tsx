'use client'

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
	const tabs = [
		{ id: 'volatility' as TabType, label: 'Волатильность' },
		{ id: 'volume' as TabType, label: 'Объем' },
		{ id: 'priceChange' as TabType, label: 'Изменения цен' },
		{ id: 'topGainers' as TabType, label: 'Топ Растущих' },
		{ id: 'topLosers' as TabType, label: 'Топ Падающих' },
		{ id: 'volatilityRanges' as TabType, label: 'Волатильность в диапазоне' }
	]

	return (
		<div className='mb-4 border-b border-gray-200 dark:border-gray-700'>
			<ul className='flex flex-wrap -mb-px text-sm font-medium text-center'>
				{tabs.map(tab => (
					<li
						key={tab.id}
						className='mr-2'
					>
						<button
							className={`inline-block p-4 border-b-2 rounded-t-lg ${
								activeTab === tab.id
									? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
									: 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
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
