'use client'

import { useEffect, useRef, useState } from 'react'

import { TimeframeCoin } from '@/types/signal.types'

import { formatVolumeValue } from '@/utils/formatVolumeValue'

interface TimeframeCoinsTableProps {
	coins: TimeframeCoin[]
	title: string
	timeframe: string
	isGainer: boolean
	isVolume?: boolean
	isFunding?: boolean
}

interface EnhancedTimeframeCoin extends TimeframeCoin {
	highlight: boolean
}

export function TimeframeCoinsTable({
	coins,
	title,
	timeframe,
	isGainer,
	isVolume = false,
	isFunding = false
}: TimeframeCoinsTableProps) {
	const [uniqueCoins, setUniqueCoins] = useState<EnhancedTimeframeCoin[]>([])
	const prevCoinsMapRef = useRef<Map<string, TimeframeCoin>>(new Map())

	useEffect(() => {
		// Create a map of existing coins for quick lookup
		const prevCoinsMap = prevCoinsMapRef.current

		// Map coins to enhanced coins with highlight for new/changed entries
		const enhancedCoins: EnhancedTimeframeCoin[] = coins.map(coin => {
			const prevCoin = prevCoinsMap.get(coin.symbol)
			const isNew = !prevCoin
			const hasChanged =
				prevCoin &&
				(prevCoin.change !== coin.change ||
					(coin.value !== undefined && prevCoin.value !== coin.value))

			return {
				...coin,
				highlight: isNew || hasChanged ? true : false
			}
		})

		setUniqueCoins(enhancedCoins)

		// Store current coins for next comparison
		const newCoinsMap = new Map<string, TimeframeCoin>()
		coins.forEach(coin => {
			newCoinsMap.set(coin.symbol, coin)
		})
		prevCoinsMapRef.current = newCoinsMap

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

	// Define table headers and value formatting based on table type
	const getColumnLabel = () => {
		return 'Изменение'
	}

	const formatValue = (coin: TimeframeCoin) => {
		// For gainers/losers - keep 3 decimal places for percentage
		if (coin.change) {
			const numericValue = Number(coin.change)
			return isNaN(numericValue) ? coin.change : `${numericValue.toFixed(3)}%`
		}

		return '0.000%'
	}

	// Color based on data type
	const valueColor = isGainer ? 'text-green-600' : 'text-red-600'

	return (
		<div className='overflow-x-auto'>
			<h3 className='text-lg font-semibold mb-2'>
				{isFunding
					? 'Фандинг'
					: isVolume
						? 'Топ'
						: isGainer
							? 'Растущие'
							: 'Падающие'}{' '}
				монеты ({timeframe})
			</h3>
			<table className='w-full text-sm border'>
				<thead>
					<tr className='bg-gray-100 dark:bg-gray-800'>
						<th className='p-2 border'>Монета</th>
						{isFunding ? (
							<>
								<th className='p-2 border'>Ставка</th>
								<th className='p-2 border'>Изменение</th>
							</>
						) : isVolume ? (
							<>
								<th className='p-2 border'>Объем</th>
								<th className='p-2 border'>Изменение</th>
							</>
						) : (
							<th className='p-2 border'>{getColumnLabel()}</th>
						)}
					</tr>
				</thead>
				<tbody>
					{uniqueCoins.length > 0 ? (
						uniqueCoins.map(coin => {
							const highlightClass = coin.highlight
								? 'bg-yellow-100 dark:bg-yellow-800/30 transition-colors duration-1000'
								: ''

							const changeColor = coin.change.startsWith('-')
								? 'text-red-600'
								: 'text-green-600'

							return (
								<tr
									key={coin.symbol}
									className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${highlightClass}`}
								>
									<td className={`p-2 border font-medium`}>
										{coin.symbol.replace('USDT', '').toUpperCase()}
									</td>
									{isFunding ? (
										<>
											<td className={`p-2 border font-medium`}>
												{coin.change}
											</td>
											<td className={`p-2 border font-medium ${changeColor}`}>
												{parseFloat(coin.value?.toString() || '0').toFixed(3)}%
											</td>
										</>
									) : isVolume ? (
										<>
											<td className={`p-2 border font-medium`}>
												{formatVolumeValue(coin.value)}
											</td>
											<td className={`p-2 border font-medium ${changeColor}`}>
												{parseFloat(coin.change).toFixed(3)}%
											</td>
										</>
									) : (
										<td className={`p-2 border font-medium ${valueColor}`}>
											{formatValue(coin)}
										</td>
									)}
								</tr>
							)
						})
					) : (
						<tr>
							<td
								colSpan={isFunding || isVolume ? 3 : 2}
								className='p-4 text-center'
							>
								Ожидание сигналов {title}...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
