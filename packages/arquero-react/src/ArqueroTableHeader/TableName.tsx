/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { memo, useCallback, useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'

import { RenameCallout } from './RenameCallout.js'

interface TableNameProps {
	onRenameTable?: (name: string) => void
	name?: string
	color?: string
}

/**
 * Renders the table name if passed, or the option to rename the name if the function
 * onRenameTable is passed to be called when clicking save or pressing enter on the callout
 */
export const TableName: React.FC<TableNameProps> = memo(function TableName({
	onRenameTable,
	name,
	color,
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [editedName, setEditedName] = useState(name || '')

	useEffect(() => {
		setEditedName(name as string)
	}, [name, setEditedName])

	const onChange = useCallback(
		(_e: any, value?: string) => {
			setEditedName(value as string)
		},
		[setEditedName],
	)

	const onSend = useCallback(
		(newName?: string) => {
			// if the user enters an empty value, save the previous value
			const incomingName = (!newName ? name : newName) as string
			onRenameTable && onRenameTable(incomingName)
			setIsEditing(false)
			setEditedName(incomingName)
		},
		[onRenameTable, setIsEditing, setEditedName, name],
	)

	return (
		<Container>
			<If condition={!!onRenameTable}>
				<Then>
					<Container>
						<H3Editable
							color={color}
							id="editName"
							title="Edit"
							onClick={() => setIsEditing(true)}
						>
							{name}
						</H3Editable>
						<If condition={isEditing}>
							<Then>
								<RenameCallout
									onSend={onSend}
									editedName={editedName}
									onChange={onChange}
									name={name}
								/>
							</Then>
						</If>
					</Container>
				</Then>
				<Else>
					<If condition={name}>
						<Then>
							<H3 color={color}>{name}</H3>
						</Then>
					</If>
				</Else>
			</If>
		</Container>
	)
})

const H3 = styled.h3<{ color?: string }>`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme, color }) =>
		color || theme.application().background().hex()};
`

const H3Editable = styled(H3)`
	cursor: pointer;
	border-bottom: 1px dotted
		${({ theme }) => theme.application().background().hex()};
`

const Container = styled.div``
