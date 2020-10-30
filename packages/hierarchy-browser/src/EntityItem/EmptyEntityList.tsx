/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { IEntityDetail } from '..'
import { IFilterProps } from '../hooks/interfaces'

export interface IEmptyEnityList {
	filterProps: IFilterProps
	entities: IEntityDetail[]
	isLoading: boolean
}
const EmptyEntityList: React.FC<IEmptyEnityList> = memo(
	({ filterProps, entities, isLoading }) => {
		return (
			<div>
				{filterProps.state && entities.length === 0 && !isLoading ? (
					<>
						No unique items to show at this level. Toggle filter to view all
						items in this community.
					</>
				) : null}
			</div>
		)
	},
)

EmptyEntityList.displayName = 'EmptyEntityList'
export default EmptyEntityList
