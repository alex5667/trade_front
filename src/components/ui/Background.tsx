import Image from 'next/image'

import background from '../../../public/backround.webp'

import styles from './Background.module.scss'

export default function Background({ z = 1 }: { z?: number }) {
	return (
		<div className={styles.backgroundWrapper}>
			<Image
				alt='Background'
				src={background}
				placeholder='blur'
				quality={100}
				fill
				priority
				sizes='100vw'
				className={styles.responsiveImage}
				style={{
					zIndex: z
				}}
			/>
			<div className={styles.svgContainer}>
				<div className={styles.textContainerBoiko}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='100%'
						height='100%'
						viewBox='0 0 800 300'
						preserveAspectRatio='xMidYMid meet'
					>
						<defs>
							<linearGradient
								id='grad1'
								x1='0%'
								y1='0%'
								x2='100%'
								y2='100%'
							>
								<stop
									offset='0%'
									style={{ stopColor: '$secondary', stopOpacity: 0.3 }}
								/>
								<stop
									offset='100%'
									style={{ stopColor: 'rgb(255,255,255)', stopOpacity: 0.2 }}
								/>
							</linearGradient>
							<filter
								id='inset-shadow'
								x='-50%'
								y='-50%'
								width='200%'
								height='200%'
							>
								<feComponentTransfer in='SourceAlpha'>
									<feFuncA
										type='table'
										tableValues='1 0'
									/>
								</feComponentTransfer>
								<feGaussianBlur stdDeviation='3' />
								<feOffset
									dx='2'
									dy='2'
									result='offsetblur'
								/>
								<feFlood
									floodColor='black'
									result='color'
								/>
								<feComposite
									in2='offsetblur'
									operator='in'
								/>
								<feComposite
									in2='SourceAlpha'
									operator='in'
								/>
								<feMerge>
									<feMergeNode />
									<feMergeNode in='SourceGraphic' />
								</feMerge>
							</filter>
							<filter
								id='volume-shadow'
								x='-50%'
								y='-50%'
								width='200%'
								height='200%'
							>
								<feGaussianBlur
									in='SourceAlpha'
									stdDeviation='4'
									result='blur'
								/>
								<feOffset
									in='blur'
									dx='4'
									dy='4'
									result='offsetBlur'
								/>
								<feMerge>
									<feMergeNode in='offsetBlur' />
									<feMergeNode in='SourceGraphic' />
								</feMerge>
							</filter>
						</defs>

						<text
							className={styles.textStyleBoiko}
							x='50%'
							y='97%'
							dominantBaseline='auto'
							textAnchor='middle'
							fill='url(#grad1)'
							stroke='rgba(255,255,255,0.6)'
							strokeWidth='0.1'
							// filter='url(#inset-shadow)'
							filter='url(#volume-shadow)'
						>
							Boiko School
						</text>
					</svg>
				</div>

				<div className={styles.textContainerFood}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='100%'
						height='100%'
						viewBox='0 0 800 300'
						preserveAspectRatio='xMidYMid meet'
					>
						<text
							className={styles.textStyleFood}
							x='50%'
							y='3%'
							dominantBaseline='hanging'
							textAnchor='middle'
							fill='url(#grad1)'
							stroke='rgba(255,255,255,0.6)'
							strokeWidth='0.1'
							// filter='url(#inset-shadow)'
							filter='url(#volume-shadow)'
						>
							Food Court
						</text>
					</svg>
				</div>
			</div>
		</div>
	)
}
