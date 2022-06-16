/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { SortDirection } from '@essex/arquero'
import { ArqueroDetailsList } from '@essex/arquero-react'
import type { IDropdownOption } from '@fluentui/react'
import {
	Checkbox,
	DetailsListLayoutMode,
	Dropdown,
	SelectionMode,
} from '@fluentui/react'
import { useCallback, useState } from 'react'

import { StatsColumnType } from '../types.js'
import {
	Control,
	ControlBlock,
	dropdownStyles,
} from './ArqueroDetailsListStory.styles.js'
import { PerformanceTestStory } from './PerformanceTestStory/PerformanceTestStory.js'
import { RowGroupingTestStory } from './RowGroupingTestStory/RowGroupingTestStory.js'

const meta = {
	title: '@essex:arquero-react/ArqueroDetailsList',
}

export default meta

const mockColumns = [
	{
		key: 'Symbol',
		name: 'Symbol',
		fieldName: 'Symbol',
		minWidth: 50,
		iconName: 'FavoriteStarFill',
	},
]

const mockFeatures = {
	smartHeaders: false,
	statsColumnHeaders: true,
	histogramColumnHeaders: true,
	smartCells: true,
	statsColumnTypes: [
		StatsColumnType.Type,
		StatsColumnType.Min,
		StatsColumnType.Max,
		StatsColumnType.Distinct,
		StatsColumnType.Invalid,
	],
}

export interface Features {
	smartHeaders: boolean
	statsColumnHeaders: boolean
	histogramColumnHeaders: boolean
	smartCells: boolean
	statsColumnTypes: StatsColumnType[]
}

const options: IDropdownOption[] = Object.values(StatsColumnType).map(o => {
	return { key: o, text: o } as IDropdownOption
})

export const ArqueroDetailsListStory = (args, { loaded: { stocks } }: any) => {
	const [features, setFeatures] = useState<Features>(mockFeatures)

	const handleFeaturesChange = useCallback(
		(propName: string, checked?: boolean) =>
			setFeatures({ ...features, [propName]: checked }),
		[features, setFeatures],
	)

	const handleStatsColumnTypeChange = useCallback(
		(e: any, option: IDropdownOption | undefined) => {
			const selectedKeys = features.statsColumnTypes || []
			const selectedTypes = option?.selected
				? [...selectedKeys, option.key as StatsColumnType]
				: selectedKeys.filter(key => key !== option?.key)

			option &&
				setFeatures({
					...features,
					statsColumnTypes: selectedTypes,
				})
		},
		[features, setFeatures],
	)

	if (!stocks) {
		return <div>Loading</div>
	}

	return (
		<div>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Column header stats'}
						checked={features.statsColumnHeaders}
						disabled={features.smartHeaders}
						onChange={(e: any, checked) =>
							handleFeaturesChange('statsColumnHeaders', checked)
						}
					/>
					<Dropdown
						disabled={!features.statsColumnHeaders && !features.smartHeaders}
						onChange={handleStatsColumnTypeChange}
						multiSelect
						options={options}
						selectedKeys={features.statsColumnTypes}
						styles={dropdownStyles}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Column header histograms'}
						checked={features.histogramColumnHeaders}
						disabled={features.smartHeaders}
						onChange={(e: any, checked) =>
							handleFeaturesChange('histogramColumnHeaders', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Smart cells'}
						checked={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('smartCells', checked)
						}
					/>
				</Control>
			</ControlBlock>

			<ArqueroDetailsList
				table={stocks}
				features={features}
				offset={0}
				limit={Infinity}
				includeAllColumns={true}
				visibleColumns={[
					'Symbol',
					'Date',
					'Close',
					'Volume',
					'Open',
					'High',
					'Low',
					'Week',
					'Month',
				]}
				isSortable={true}
				isStriped={false}
				isColumnClickable={false}
				showColumnBorders={false}
				selectionMode={SelectionMode.none}
				layoutMode={DetailsListLayoutMode.fixedColumns}
				columns={mockColumns}
				isHeadersFixed={false}
				compact={false}
				isResizable={true}
				defaultSortDirection={SortDirection.Ascending}
				defaultSortColumn={'Volume'}
			/>
		</div>
	)
}

ArqueroDetailsListStory.story = {
	name: 'Arquero Details List Story',
}

export const PerformanceStory = (args, { loaded: { stocks } }: any) => {
	if (!stocks) {
		return <div>Loading</div>
	}

	return <PerformanceTestStory mockTablePerformance={stocks} />
}

PerformanceStory.story = {
	name: 'Performance story',
}

export const RowGroupingStory = (args, { loaded: { stocks } }: any) => {
	if (!stocks) {
		return <div>Loading</div>
	}

	return <RowGroupingTestStory mockTable={stocks} />
}

RowGroupingStory.story = {
	name: 'Row grouping story',
}
