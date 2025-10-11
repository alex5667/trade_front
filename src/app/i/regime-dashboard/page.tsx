/**
 * Regime Dashboard Page
 * ------------------------------
 * Полноценный дашборд с мониторингом рыночного режима,
 * здоровья пайплайна и контекстом для принятия решений
 */
'use client'

import { useState } from 'react'

import { RegimeWidget } from '@/components/regime-badge'
import { RegimeContext } from '@/components/regime-context'
import { RegimeHealth } from '@/components/regime-health'
import { RegimeTipsCard } from '@/components/regime-tips'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'

import styles from './RegimeDashboard.module.scss'

/**
 * Regime Dashboard Page
 * ------------------------------
 * Полноценный дашборд с мониторингом рыночного режима,
 * здоровья пайплайна и контекстом для принятия решений
 */

/**
 * Regime Dashboard Page
 * ------------------------------
 * Полноценный дашборд с мониторингом рыночного режима,
 * здоровья пайплайна и контекстом для принятия решений
 */

export default function RegimeDashboardPage() {
	const [symbol] = useState('BTCUSDT')
	const [ltf] = useState('1m')
	const [htf] = useState('1h')

	// Получаем текущий режим из WebSocket
	const { regime: liveRegime } = useRegimeSocket(symbol, ltf)
	const currentRegime = (liveRegime?.regime as any) || 'range'

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Market Regime Dashboard</h1>
				<p className={styles.subtitle}>
					Comprehensive market analysis with regime detection and health
					monitoring
				</p>
			</div>

			<div className={styles.grid}>
				{/* Основной виджет режима с графиками */}
				<div className={styles.mainWidget}>
					<RegimeWidget
						symbol={symbol}
						timeframe={ltf}
						showStatus={true}
						showSparkline={true}
						sparklinePoints={300}
					/>
				</div>

				{/* Health мониторинг */}
				<div className={styles.healthWidget}>
					<RegimeHealth
						symbol={symbol}
						timeframe={ltf}
						maxLagSec={180}
						refreshInterval={15000}
					/>
				</div>

				{/* Контекст LTF/HTF */}
				<div className={styles.contextWidget}>
					<RegimeContext
						symbol={symbol}
						ltf={ltf}
						htf={htf}
						signalType='fvg'
						side='long'
						refreshInterval={15000}
					/>
				</div>

				{/* Дополнительные виджеты можно добавить здесь */}
				<div className={styles.infoPanel}>
					<h3 className={styles.panelTitle}>Regime Types</h3>
					<div className={styles.regimeList}>
						<div className={styles.regimeItem}>
							<span className={`${styles.regimeDot} ${styles.range}`} />
							<strong>Range:</strong> Market in consolidation
						</div>
						<div className={styles.regimeItem}>
							<span className={`${styles.regimeDot} ${styles.squeeze}`} />
							<strong>Squeeze:</strong> Low volatility, potential breakout
						</div>
						<div className={styles.regimeItem}>
							<span className={`${styles.regimeDot} ${styles.trendingBull}`} />
							<strong>Trending Bull:</strong> Strong upward momentum
						</div>
						<div className={styles.regimeItem}>
							<span className={`${styles.regimeDot} ${styles.trendingBear}`} />
							<strong>Trending Bear:</strong> Strong downward momentum
						</div>
						<div className={styles.regimeItem}>
							<span className={`${styles.regimeDot} ${styles.expansion}`} />
							<strong>Expansion:</strong> High volatility phase
						</div>
					</div>
				</div>

				{/* Trading Tips for Current Regime */}
				<div className={styles.tipsWidget}>
					<RegimeTipsCard
						regime={currentRegime}
						compact={false}
					/>
				</div>
			</div>
		</div>
	)
}
