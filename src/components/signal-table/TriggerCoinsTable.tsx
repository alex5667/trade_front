'use client'

import { useEffect, useRef, useState } from 'react'

interface TriggerCoinsTableProps {
	coins: string[]
	title: string
	timeframe: string
	isGainer: boolean
}

interface EnhancedCoin {
	symbol: string
	highlight: boolean
}

export function TriggerCoinsTable({
	coins,
	title,
	timeframe,
	isGainer
}: TriggerCoinsTableProps) {
	const [uniqueCoins, setUniqueCoins] = useState<EnhancedCoin[]>([])
	const prevCoinsRef = useRef<string[]>([])

	useEffect(() => {
		// Create a set of existing coins for quick lookup
		const prevCoinsSet = new Set(prevCoinsRef.current)

		// Map coins to enhanced coins with highlight for new entries
		const enhancedCoins: EnhancedCoin[] = coins.map(symbol => ({
			symbol,
			highlight: !prevCoinsSet.has(symbol)
		}))

		setUniqueCoins(enhancedCoins)

		// Store current coins for next comparison
		prevCoinsRef.current = coins

		// Reset highlights after 1 second
		const timer = setTimeout(() => {
			setUniqueCoins(prev =>
				prev.map(coin => ({
					...coin,
					highlight: false
				}))
			)
		}, 1000)

		return () => clearTimeout(timer)
	}, [coins])

	// Color based on gainer/loser status
	const valueColor = isGainer ? 'text-green-600' : 'text-red-600'

	return (
		<div className='overflow-x-auto'>
			<h3 className='text-lg font-semibold mb-2'>
				{isGainer ? 'Растущие' : 'Падающие'} монеты ({timeframe})
			</h3>
			<table className='w-full text-sm border'>
				<thead>
					<tr className='bg-title-dark dark:bg-bg-dark'>
						<th className='p-2 border'>Монета</th>
					</tr>
				</thead>
				<tbody>
					{uniqueCoins.length > 0 ? (
						uniqueCoins.map(coin => {
							const highlightClass = coin.highlight
								? 'bg-yellow-100 dark:bg-yellow-800/30 transition-colors duration-1000'
								: ''

							return (
								<tr
									key={coin.symbol}
									className={`hover:bg-hover-row-dark dark:hover:bg-hover-row-light ${highlightClass}`}
								>
									<td className={`p-2 border font-medium ${valueColor}`}>
										{coin.symbol}
									</td>
								</tr>
							)
						})
					) : (
						<tr>
							<td className='p-4 text-center'>Ожидание сигналов {title}...</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
