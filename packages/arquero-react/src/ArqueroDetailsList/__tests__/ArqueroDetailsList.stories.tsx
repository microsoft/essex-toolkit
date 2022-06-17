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

import { DetailsListFeatures, StatsColumnType } from '../types.js'
import {
	BlockContainer,
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
	showNumberMagnitude: false,
	showBooleanSymbol: false,
	showDateFormatted: false,
	showSparkbar: false,
	showSparkline: false,
	showCategoricalBar: false,
	showDropdown: false,
	statsColumnTypes: [
		StatsColumnType.Type,
		StatsColumnType.Min,
		StatsColumnType.Max,
		StatsColumnType.Distinct,
		StatsColumnType.Invalid,
	],
}

const options: IDropdownOption[] = Object.values(StatsColumnType).map(o => {
	return { key: o, text: o } as IDropdownOption
})

export const ArqueroDetailsListStory = (args, { loaded: { stocks } }: any) => {
	const [features, setFeatures] = useState<DetailsListFeatures>(mockFeatures)
	const [compact, setCompact] = useState<boolean>(false)

	const handleSmartHeadersChange = useCallback(
		(e: any, checked?: boolean) =>
			setFeatures({ ...features, smartHeaders: checked }),
		[features, setFeatures],
	)

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

	const handleArrayFeaturesChange = useCallback(
		(propName: string, checked?: boolean) => {
			setFeatures({
				...features,
				[propName]: checked,
			})
		},

		[features, setFeatures],
	)

	const handleCompactChange = useCallback(
		(_e: any, checked: boolean | undefined) => setCompact(checked ?? false),
		[setCompact],
	)

	if (!stocks) {
		return <div>Loading</div>
	}

	return (
		<div>
			<BlockContainer>
				<ControlBlock>
					<Control>
						<Checkbox
							label={'Smart headers'}
							checked={features.smartHeaders}
							onChange={handleSmartHeadersChange}
						/>
					</Control>
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
				</ControlBlock>
				<ControlBlock>
					<Control>
						<Checkbox
							label={'Smart cells'}
							checked={features.smartCells}
							onChange={(e: any, checked) =>
								handleFeaturesChange('smartCells', checked)
							}
						/>
					</Control>
					<Control>
						<Checkbox
							label={'Number magnitude'}
							checked={features.showNumberMagnitude}
							disabled={features.smartCells}
							onChange={(e: any, checked) =>
								handleFeaturesChange('showNumberMagnitude', checked)
							}
						/>
					</Control>
					<Control>
						<Checkbox
							label={'Boolean symbol'}
							checked={features.showBooleanSymbol}
							disabled={features.smartCells}
							onChange={(e: any, checked) =>
								handleFeaturesChange('showBooleanSymbol', checked)
							}
						/>
					</Control>
					<Control>
						<Checkbox
							label={'Format date'}
							checked={features.showDateFormatted}
							disabled={features.smartCells}
							onChange={(e: any, checked) =>
								handleFeaturesChange('showDateFormatted', checked)
							}
						/>
					</Control>
				</ControlBlock>
				<ControlBlock>
					<Control>
						<Checkbox
							label={'Sparkbar'}
							checked={!!features.showSparkbar}
							disabled={features.smartCells}
							onChange={(e: any, checked) =>
								handleArrayFeaturesChange('showSparkbar', checked)
							}
						/>
					</Control>
					<Control>
						<Checkbox
							label={'Sparkline'}
							checked={!!features.showSparkline}
							disabled={features.smartCells}
							onChange={(e: any, checked) =>
								handleArrayFeaturesChange('showSparkline', checked)
							}
						/>
					</Control>
					<Control>
						<Checkbox
							label={'Categorical bar'}
							checked={!!features.showCategoricalBar}
							disabled={features.smartCells}
							onChange={(e: any, checked) =>
								handleArrayFeaturesChange('showCategoricalBar', checked)
							}
						/>
					</Control>
					<Control>
						<Checkbox
							label={'Multivalues on dropdown'}
							checked={!!features.showDropdown}
							disabled={features.smartCells}
							onChange={(e: any, checked) =>
								handleArrayFeaturesChange('showDropdown', checked)
							}
						/>
					</Control>
					<Control>
						<Checkbox
							label={'Compact rows'}
							checked={compact}
							onChange={handleCompactChange}
						/>
					</Control>
				</ControlBlock>
			</BlockContainer>

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
				compact={compact}
				isSortable={true}
				isStriped={false}
				isColumnClickable={false}
				showColumnBorders={false}
				selectionMode={SelectionMode.none}
				layoutMode={DetailsListLayoutMode.fixedColumns}
				columns={mockColumns}
				isHeadersFixed={false}
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
