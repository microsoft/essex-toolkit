import React, { memo, useCallback } from 'react'
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'

import './Style.css'
interface Selections {
	options: IChoiceGroupOption[]
	defaultSelectedKey: string
	onChange: (option: IChoiceGroupOption) => void
	label: string
}

const styles = { flexContainer: { display: 'inline-flex' } }

export const Selections: React.FC<Selections> = memo(function Selections({
	options,
	defaultSelectedKey,
	onChange,
	label,
}: Selections) {
	const _onChange = useCallback(
		(
			ev: React.FormEvent<HTMLInputElement | HTMLElement> | undefined,
			option: IChoiceGroupOption | undefined,
		): void => {
			if (option) {
				onChange(option)
			}
		},
		[onChange],
	)
	return (
		<ChoiceGroup
			styles={styles}
			defaultSelectedKey={defaultSelectedKey}
			options={options}
			onChange={_onChange}
			label={label}
			required={true}
		/>
	)
})
