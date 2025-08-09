import Image from 'next/image'

import logo from '../../../public/logo.png'

import styles from './Home.module.scss'

const Header = () => {
	return (
		<header>
			<div className={styles.header__container}>
				<div className={styles.logoImage}>
					<Image
						src={logo}
						alt='Trade logo'
						width={60}
						height={60}
						className={styles.logoImg}
						placeholder='blur'
					/>
				</div>

				<h1 className={styles.headerTitle}>Trade</h1>
			</div>
		</header>
	)
}

export default Header
