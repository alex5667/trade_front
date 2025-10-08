import Link from 'next/link'

import { RegimeWidget } from '@/components/regime-badge'
import { RegimeHealth } from '@/components/regime-health'
import { SignalsList } from '@/components/signals-list'

import { FilterableSignal } from '@/types/signal.types'

const UserBoardPage = () => {
	// Пример сигналов (в реальном приложении будут из Redux/API)
	const mockSignals: FilterableSignal[] = [
		{ type: 'fvg', side: 'long', symbol: 'BTCUSDT' },
		{ type: 'ob', side: 'short', symbol: 'ETHUSDT' },
		{ type: 'volumeSpike', symbol: 'BNBUSDT' },
		{ type: 'breaker', side: 'long', symbol: 'SOLUSDT' },
		{ type: 'smt', symbol: 'ADAUSDT' }
	]

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>User Dashboard</h1>
				<Link
					href='/i/regime-dashboard'
					className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors'
				>
					Advanced Regime Dashboard
				</Link>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Виджет рыночного режима с спарклайнами */}
				<div className='lg:col-span-1 space-y-4'>
					<RegimeWidget
						symbol='BTCUSDT'
						timeframe='1m'
						showStatus={true}
						showSparkline={true}
						sparklinePoints={100}
					/>

					<RegimeHealth
						symbol='BTCUSDT'
						timeframe='1m'
					/>
				</div>

				{/* Список отфильтрованных сигналов */}
				<div className='lg:col-span-2'>
					<SignalsList
						signals={mockSignals}
						enableFiltering={true}
					/>
				</div>
			</div>
		</div>
	)
}

export default UserBoardPage
