export type Regime =
	| 'range'
	| 'squeeze'
	| 'trending_bull'
	| 'trending_bear'
	| 'expansion'

export type SignalType =
	| 'fvg'
	| 'ob'
	| 'breaker'
	| 'volumeSpike'
	| 'volatility'
	| 'smt'
	| 'other'

export interface RegimeTips {
	key: Regime
	title: string
	summary: string
	do: string[]
	avoid: string[]
	entries: string[]
	confirmations: string[]
	exits: string[]
	risk: string[]
	invalidation: string[]
	transitions: string[]
	checklist: string[]
	gateRules: Array<{
		allow: boolean
		types: SignalType[]
		reason: string
	}>
}

export const REGIME_TIPS: Record<Regime, RegimeTips> = {
	range: {
		key: 'range',
		title: 'Range — боковик/диапазон',
		summary: 'Цена пилит в канале; импульсы выдыхаются. Приоритет mean-reversion, быстрые тейки.',
		do: [
			'Играть возвраты к Equilibrium (50%) и VWAP',
			'Искать SMT-дивергенции у границ (BTC/ETH, Цена/RSI/CVD)',
			'Работать от VAH/VAL/POC с короткими целями'
		],
		avoid: [
			'Пробойные стратегии без подтверждения объёмом/дельтой',
			'Долгие удержания — импульсы быстро гаснут'
		],
		entries: [
			'Fade ложных пробоев границ → возврат к VWAP/EQ',
			'Fill локальных FVG/BPR внутри рейнджа'
		],
		confirmations: [
			'SMT-дивергенция на LTF',
			'Разворот Delta/CVD у границы',
			'RSI-дивергенция'
		],
		exits: [
			'Цель 1 — EQ/VWAP; цель 2 — противоположная граница',
			'Частичная фиксация 50/50'
		],
		risk: [
			'Малые стопы за локальный экстремум/OB',
			'RR 1:1.5–1:2'
		],
		invalidation: [
			'Серии BOS в одну сторону + рост ADX-slope',
			'Удержание выше/ниже диапазона с объёмом'
		],
		transitions: [
			'ADX-slope ↑ и ATR% ↑ → Expansion/Trend',
			'ATR% ≤ p25 → Squeeze'
		],
		checklist: [
			'ADX < p40? ATR% ≤ p50?',
			'Есть SMT/RSI/CVD дивергенция у границы?',
			'Где VWAP/POC/VAH/VAL относительно цены?'
		],
		gateRules: [
			{ allow: false, types: ['fvg', 'ob', 'breaker'], reason: 'Пробойные сетапы в рейндже часто дают фальстарт' },
			{ allow: true, types: ['smt'], reason: 'SMT-дивергенции хорошо отрабатывают возврат к средним' },
			{ allow: true, types: ['volumeSpike', 'volatility', 'other'], reason: 'Разрешено при подтверждении ордер-флоу' }
		]
	},

	squeeze: {
		key: 'squeeze',
		title: 'Squeeze — сжатие',
		summary: 'Узкие бары, низкий ATR%. Пружина «наматывается». Это пред-фаза, не направление.',
		do: [
			'Ждать триггера: рост ADX-slope, выброс дельты/объёма',
			'Разметить уровни ретеста для входа после выхода'
		],
		avoid: [
			'Гадать направление внутри катушки',
			'Большие позиции при низкой воле'
		],
		entries: [
			'После импульса — вход на ретест FVG/OB по направлению',
			'Breaker после fakeout → reversal'
		],
		confirmations: [
			'ADX-slope > 0 на LTF',
			'Delta spike в сторону выхода',
			'Absorption/Iceberg на ретесте'
		],
		exits: [
			'Частичная фиксация у первой ликвидности',
			'Безубыток после первого импульса'
		],
		risk: [
			'Размер позиции ниже стандартного',
			'Стоп с запасом (после выхода вола растёт)'
		],
		invalidation: [
			'Возврат внутрь без объёма',
			'ADX остаётся низким → Range'
		],
		transitions: [
			'ADX-slope ↑ + ATR%-slope ↑ → Expansion',
			'Нет выхода + нет объёма → Range'
		],
		checklist: [
			'ATR% ≤ p25? ADX < p40?',
			'Есть импульс и зона ретеста?',
			'OF подтверждает (дельта/абсорбция)?'
		],
		gateRules: [
			{ allow: false, types: ['fvg', 'ob', 'breaker'], reason: 'До выхода пробойные сетапы рискованны' },
			{ allow: true, types: ['volumeSpike', 'volatility'], reason: 'Можно использовать как триггеры' },
			{ allow: true, types: ['smt', 'other'], reason: 'Только с подтверждением ADX-slope/Delta' }
		]
	},

	trending_bull: {
		key: 'trending_bull',
		title: 'Trend ↑ — бычий тренд',
		summary: 'Последовательные BOS↑, выкупы откатов. Приоритет — входы по тренду.',
		do: [
			'Покупать из discount зоны (ICT)',
			'Играть OB/FVG в сторону тренда',
			'Держать часть до забора ликвидности над хай'
		],
		avoid: [
			'Контртрендовые шорты без сильной дивергенции',
			'Продажи «потому что перекуплен»'
		],
		entries: [
			'OB/FVG в discount (LTF-триггер внутри зоны)',
			'Breaker после забора лоу',
			'Pullback к VWAP по тренду'
		],
		confirmations: [
			'+DI > −DI, ADX ≥ p60/75 и растёт',
			'CVD/дельта в лонг на откате',
			'SMT: лидер делает HH'
		],
		exits: [
			'Тейки на ликвидности (equal highs, FVG-fill)',
			'Трейлинг по swing lows'
		],
		risk: [
			'Стоп за OB/FVG/структурный лоу',
			'RR ≥ 1:2; докупка только на чётком ретесте'
		],
		invalidation: [
			'ADX-slope ↓, серия CHoCH вниз',
			'RSI/CVD дивергенции без follow-through'
		],
		transitions: [
			'ADX ↓ и ATR% ↓ → Range',
			'ATR% ↑ при нестабильном ADX → волатильная Expansion'
		],
		checklist: [
			'HTF bias ↑? +DI>−DI? ADX ≥ p60?',
			'Есть чистый OB/FVG в discount?',
			'OF подтверждает (дельта/абсорбция)?'
		],
		gateRules: [
			{ allow: true, types: ['fvg', 'ob', 'breaker'], reason: 'По-тренду сетапы приоритетны' },
			{ allow: true, types: ['smt'], reason: 'SMT — ускорение тренда/конфлюэнс' },
			{ allow: true, types: ['volumeSpike', 'volatility', 'other'], reason: 'Как триггеры/подтверждение' }
		]
	},

	trending_bear: {
		key: 'trending_bear',
		title: 'Trend ↓ — медвежий тренд',
		summary: 'Последовательные BOS↓, продажи откатов. Приоритет — входы по тренду.',
		do: [
			'Шортить из premium зоны (ICT)',
			'Играть OB/FVG по тренду',
			'Держать часть до забора ликвидности под лоу'
		],
		avoid: [
			'Ловить разворот в лонг без мощных подтверждений',
			'Покупки «потому что перепродан»'
		],
		entries: [
			'OB/FVG в premium (LTF-триггер внутри зоны)',
			'Breaker после забора хай',
			'Pullback к VWAP по тренду'
		],
		confirmations: [
			'−DI > +DI, ADX ≥ p60/75 и растёт',
			'CVD/дельта в шорт на откате',
			'SMT: лидер делает LL'
		],
		exits: [
			'Тейки на ликвидности (equal lows, FVG-fill)',
			'Трейлинг по swing highs'
		],
		risk: [
			'Стоп за OB/FVG/структурный хай',
			'RR ≥ 1:2; усреднений избегать'
		],
		invalidation: [
			'ADX-slope ↓, серия CHoCH вверх',
			'RSI/CVD дивергенции без продолжения'
		],
		transitions: [
			'ADX ↓ и ATR% ↓ → Range',
			'ATR% ↑ при неустойчивом ADX → Expansion'
		],
		checklist: [
			'HTF bias ↓? −DI>+DI? ADX ≥ p60?',
			'Есть чистый OB/FVG в premium?',
			'OF подтверждает (дельта/абсорбция)?'
		],
		gateRules: [
			{ allow: true, types: ['fvg', 'ob', 'breaker'], reason: 'По-тренду сетапы приоритетны' },
			{ allow: true, types: ['smt'], reason: 'SMT — ускорение/конфлюэнс' },
			{ allow: true, types: ['volumeSpike', 'volatility', 'other'], reason: 'Как триггеры/подтверждение' }
		]
	},

	expansion: {
		key: 'expansion',
		title: 'Expansion — расширение/price discovery',
		summary: 'Рывок из консолидации: ATR% и ADX растут. Направление ещё фиксируется.',
		do: [
			'Ловить follow-through на откатах к первым FVG/OB',
			'Смотреть Delta spikes и Absorption на ретестах'
		],
		avoid: [
			'Пересиживать без стопа — волатильность высока',
			'Входить против свежего импульса'
		],
		entries: [
			'Ретест первого FVG/OB после прорыва',
			'Breaker в сторону импульса'
		],
		confirmations: [
			'ADX-slope > 0 и ATR%-slope > 0',
			'Delta spike/Imbalance по направлению',
			'RSI/MACD ускорение'
		],
		exits: [
			'Частичная фиксация на первых ликвидностях/inefficiencies',
			'Трейлинг по LTF-свингам'
		],
		risk: [
			'Стоп шире (по ATR), позиция меньше',
			'Перезаход — только после нового ретеста'
		],
		invalidation: [
			'Провал ретеста (возврат под уровень) и ADX-slope ↓',
			'Отсутствие объёма — импульс гаснет'
		],
		transitions: [
			'Стабильно растущий ADX + доминация DI → тренд',
			'Угасание ADX/ATR% → Range'
		],
		checklist: [
			'Чистый импульс и зона первого ретеста?',
			'ADX-slope > 0 и ATR%-slope > 0?',
			'OF показывает реальную агрессию?'
		],
		gateRules: [
			{ allow: true, types: ['fvg', 'ob', 'breaker'], reason: 'Играем откат к первой зоне по направлению' },
			{ allow: true, types: ['volumeSpike', 'volatility'], reason: 'Можно использовать как триггеры' },
			{ allow: true, types: ['smt', 'other'], reason: 'Допустимо при подтверждении направленности' }
		]
	}
}
