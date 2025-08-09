import { Loader as LoaderIcon } from 'lucide-react'

import styles from './Loader.module.scss'

const Loader = () => {
	return (
		<div className={styles.container}>
			<LoaderIcon className={styles.icon} />
		</div>
	)
}

export default Loader
