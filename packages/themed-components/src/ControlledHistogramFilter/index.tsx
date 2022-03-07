/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import {
	IconButton,
	ContextualMenuItemType,
	DirectionalHint,
	Label,
	Link,
	TextField,
} from '@fluentui/react'
import { useState, useMemo, useEffect } from 'react'
import { NumberSpinButton } from '../NumberSpinButton/index.js'
import { HistogramSelect } from './HistogramSelect.js'

export interface ControlledHistogramFilterProps {
	name: string
	data: number[]
	width: number
	height: number
	selectedRange: [number | undefined, number | undefined]
	onChange?: (range: [number | undefined, number | undefined]) => any
	selectedFill?: string
	unselectedFill?: string
}

const CHART_MARGINS = {
	top: 4,
	right: 8,
	bottom: 12,
	left: 40,
}

/**
 * ControlledHistogramFilter displays a histogram that contains
 * a D3 brush and basic numberical filtering with thematic theming
 */

export const ControlledHistogramFilter = ({
	name,
	data,
	width,
	height,
	selectedRange,
	onChange,
	selectedFill,
	unselectedFill,
}: ControlledHistogramFilterProps): JSX.Element => {
	const [bins, setBins] = useState<number>(20)
	const minValue = useMemo(() => Math.min(...data), [data])
	const maxValue = useMemo(() => Math.max(...data), [data])
	const [menuMin, setMenuMin] = useState<string>(
		selectedRange[0] ? selectedRange[0].toString() : '',
	)
	const [menuMax, setMenuMax] = useState<string>(
		selectedRange[1] ? selectedRange[1].toString() : '',
	)

	// reset the min and max values in the menu if selected range has changed
	useEffect(() => {
		setMenuMin(selectedRange[0] ? selectedRange[0].toString() : '')
		setMenuMax(selectedRange[1] ? selectedRange[1].toString() : '')
	}, [selectedRange])

	// apply or clear filter ranges when the menu closes
	const onMenuClose = (menu?: IContextualMenuProps) => {
		const minV = menuMin === '' ? undefined : parseFloat(menuMin)
		const maxV = menuMax === '' ? undefined : parseFloat(menuMax)
		if (minV !== minValue || maxV !== maxValue) {
			if (onChange) onChange([minV, maxV])
		}
	}

	// handlers to change the pending value for the filter form the drop down menu
	// filter is not applied until menu is closed
	const validateTextFilter = (value: string) => {
		if (value === '') {
			return true
		} else {
			try {
				parseFloat(value)
				return true
			} catch (err) {
				return false
			}
		}
	}
	const handleMinRange = (
		event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		newValue?: string | undefined,
	) => {
		if (onChange && validateTextFilter(newValue || '')) {
			setMenuMin(newValue || '')
		}
	}
	const handleMaxRange = (
		event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		newValue?: string | undefined,
	) => {
		if (onChange && validateTextFilter(newValue || '')) {
			setMenuMax(newValue || '')
		}
	}

	const clearFilter = () => {
		if (onChange) {
			onChange([undefined, undefined])
		}
	}

	return (
		<div
			style={{
				width,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div style={{ width, height: 32, display: 'flex' }}>
				<Label
					style={{
						marginLeft: 52 + CHART_MARGINS.left,
						width: width - 52 - CHART_MARGINS.left,
						textAlign: 'center',
					}}
				>
					{name}
				</Label>
				<IconButton
					style={{
						border: 'none',
						fontSize: '0.6em',
						justifySelf: 'end',
					}}
					iconProps={{ iconName: 'FilterSettings' }}
					menuProps={{
						alignTargetEdge: true,
						directionalHint: DirectionalHint.bottomRightEdge,
						onMenuDismissed: onMenuClose,
						items: [
							{
								key: '1',
								itemType: ContextualMenuItemType.Section,
								sectionProps: {
									title: 'Histogram Settings',
									items: [
										{
											key: 'bins',
											// eslint-disable-next-line react/display-name
											onRender: () => (
												<div style={{ marginLeft: 8 }}>
													<NumberSpinButton
														label="bins"
														value={bins}
														max={100}
														min={5}
														onChange={setBins}
														step={5}
													/>
												</div>
											),
										},
									],
								},
							},
							{
								key: '2',
								itemType: ContextualMenuItemType.Section,
								sectionProps: {
									title: 'Filter Settings',
									items: [
										{
											key: 'minRange',
											// eslint-disable-next-line react/display-name
											onRender: () => (
												<div style={{ margin: 10 }}>
													<TextField
														label="min value"
														value={menuMin.toString()}
														onChange={handleMinRange}
													/>
												</div>
											),
										},
										{
											key: 'maxRange',
											// eslint-disable-next-line react/display-name
											onRender: () => (
												<div style={{ margin: 10 }}>
													<TextField
														label="max value"
														value={menuMax.toString()}
														onChange={handleMaxRange}
													/>
												</div>
											),
										},
										{
											key: 'clear',
											// eslint-disable-next-line react/display-name
											onRender: () => (
												<Link onClick={clearFilter} style={{ margin: 10 }}>
													Clear Filter
												</Link>
											),
										},
									],
								},
							},
						],
					}}
				/>
			</div>
			<HistogramSelect
				width={width}
				height={height}
				margins={CHART_MARGINS}
				data={data}
				numberOfBins={bins}
				selectedRange={selectedRange}
				onRangeChanged={onChange}
				selectedFill={selectedFill}
				unselectedFill={unselectedFill}
			/>
		</div>
	)
}
