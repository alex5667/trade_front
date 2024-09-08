import Image from 'next/image'

import background from '../../../public/backround.webp'

export default function Background() {
	return (
		<Image
			alt='Background'
			src={background}
			placeholder='blur'
			quality={100}
			fill
			priority
			sizes='100vw'
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				zIndex: 1
			}}
		/>
	)
}
