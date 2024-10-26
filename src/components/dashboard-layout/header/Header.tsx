import { GlobalLoader } from './GlobalLoader'
import { Profile } from './profile/Profile'

export function Header() {
	return (
		<header className='px-5 py-3'>
			<GlobalLoader />
			<Profile />
		</header>
	)
}
