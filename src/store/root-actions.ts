import { collapsedSlice } from './collapsed/collapsed.slice'

import { sidebarSlice } from './sidebar/sidebar.slice'
import { userSlice } from './user/user.slice'

export const rootActions = {
	...userSlice.actions,
	...collapsedSlice.actions,
	...sidebarSlice.actions

}
