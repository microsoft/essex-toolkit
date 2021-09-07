/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, IButtonStyles } from '@fluentui/react'
import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'

interface ITableExpander {
	isOpen: boolean
	handleButtonClick: (state: boolean) => void
	styles?: IButtonStyles
}
const iconButtonStyles = { root: { maxHeight: '15px', maxWidth: '15px' } }

export const TableExpander: React.FC<ITableExpander> = memo(
	function TableExpander({
		isOpen,
		handleButtonClick,
		styles,
	}: ITableExpander) {
		const iconName = useMemo(
			() => (isOpen ? 'DoubleChevronRight12' : 'DoubleChevronLeft12'),
			[isOpen],
		)
		const buttonStyle = styles ?? iconButtonStyles
		const handleClick = useCallback(() => {
			handleButtonClick(!isOpen)
		}, [handleButtonClick, isOpen])
		return (
			<>
				<Header>
					<IconButton
						styles={buttonStyle}
						iconProps={{
							iconName,
						}}
						text="Panel Resize"
						onClick={handleClick}
					/>
				</Header>
			</>
		)
	},
)

const Header = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`
