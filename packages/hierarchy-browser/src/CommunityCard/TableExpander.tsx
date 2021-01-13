/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import React, { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'

interface ITableExpander {
	isOpen: boolean
	handleButtonClick: (state: boolean) => void
}
const iconButtonStyles = { root: { maxHeight: '15px', maxWidth: '15px' } }

export const TableExpander: React.FC<ITableExpander> = memo(
	function TableExpander({ isOpen, handleButtonClick }: ITableExpander) {
		const iconName = useMemo(
			() => (isOpen ? 'DoubleChevronRight12' : 'DoubleChevronLeft12'),
			[isOpen],
		)

		const handleClick = useCallback(() => {
			handleButtonClick(!isOpen)
		}, [handleButtonClick, isOpen])
		return (
			<>
				<Header>
					<IconButton
						styles={iconButtonStyles}
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
