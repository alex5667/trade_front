import cn from 'clsx'
import React, { TextareaHTMLAttributes, forwardRef } from 'react'

import styles from './AutocompleteInput.module.scss'

type AutoCompleteTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	setIsShow: (value: boolean) => void
	handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
	inputValue: string
}

const AutoCompleteTextarea = forwardRef<
	HTMLTextAreaElement,
	AutoCompleteTextareaProps
>(({ setIsShow, handleChange, inputValue, ...rest }, ref) => {
	return (
		<textarea
			rows={1}
			ref={ref}
			className={cn(styles.input)}
			value={inputValue}
			onChange={handleChange}
			onFocus={() => setIsShow(true)}
			onBlur={() => {
				setTimeout(() => setIsShow(false), 200)
			}}
			{...rest}
		/>
	)
})

AutoCompleteTextarea.displayName = 'AutoCompleteTextarea'

export default AutoCompleteTextarea
