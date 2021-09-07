/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { IEntityDetail } from '..'
import { IFilterProps } from '../hooks/interfaces'

export interface IEmptyEnityList {
	filterProps: IFilterProps
	entities: IEntityDetail[]
	isLoading: boolean
}
export const EmptyEntityList: React.FC<IEmptyEnityList> = memo(
	function EmptyEntityList({
		filterProps,
		entities,
		isLoading,
	}: IEmptyEnityList) {
		return (
			<Container>
				{filterProps.state && entities.length === 0 && !isLoading ? (
					<>
						No unique items to show at this level. Toggle filter to view all
						items in this community.
					</>
				) : null}
			</Container>
		)
	},
)
const Container = styled.div``
