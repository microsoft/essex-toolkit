/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useState } from 'react'
import { TimeBrush } from './TimeBrush.js'
import type { TimeBrushProps } from './TimeBrush.types.js'

const meta = {
	title: '@essex:components/TimeBrush',
	component: TimeBrush,
}
export default meta

const PrimaryComponent: React.FC<TimeBrushProps> = (args) => {
	const [from, setFrom] = useState<string | undefined>(undefined)
	const [to, setTo] = useState<string | undefined>(undefined)

	const handleOnChange = useCallback(
		(from: string, to: string) => {
			setFrom(from)
			setTo(to)
		},
		[setFrom, setTo],
	)

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<TimeBrush {...args} from={from} to={to} onChange={handleOnChange} />
		</div>
	)
}

const defaultItems = [
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-01T00:00:00'),
		term: 'DocumentCreateDate',
		count: 161,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-02T00:00:00'),
		term: 'DocumentCreateDate',
		count: 133,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-03T00:00:00'),
		term: 'DocumentCreateDate',
		count: 101,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-04T00:00:00'),
		term: 'DocumentCreateDate',
		count: 108,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-05T00:00:00'),
		term: 'DocumentCreateDate',
		count: 124,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-06T00:00:00'),
		term: 'DocumentCreateDate',
		count: 182,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-07T00:00:00'),
		term: 'DocumentCreateDate',
		count: 152,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-08T00:00:00'),
		term: 'DocumentCreateDate',
		count: 180,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-09T00:00:00'),
		term: 'DocumentCreateDate',
		count: 142,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-10T00:00:00'),
		term: 'DocumentCreateDate',
		count: 116,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-11T00:00:00'),
		term: 'DocumentCreateDate',
		count: 128,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-12T00:00:00'),
		term: 'DocumentCreateDate',
		count: 115,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-13T00:00:00'),
		term: 'DocumentCreateDate',
		count: 102,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-14T00:00:00'),
		term: 'DocumentCreateDate',
		count: 131,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-15T00:00:00'),
		term: 'DocumentCreateDate',
		count: 124,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-16T00:00:00'),
		term: 'DocumentCreateDate',
		count: 122,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-17T00:00:00'),
		term: 'DocumentCreateDate',
		count: 88,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-18T00:00:00'),
		term: 'DocumentCreateDate',
		count: 84,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-19T00:00:00'),
		term: 'DocumentCreateDate',
		count: 124,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-20T00:00:00'),
		term: 'DocumentCreateDate',
		count: 122,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-21T00:00:00'),
		term: 'DocumentCreateDate',
		count: 102,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-22T00:00:00'),
		term: 'DocumentCreateDate',
		count: 139,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-23T00:00:00'),
		term: 'DocumentCreateDate',
		count: 107,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-24T00:00:00'),
		term: 'DocumentCreateDate',
		count: 79,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-25T00:00:00'),
		term: 'DocumentCreateDate',
		count: 84,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-26T00:00:00'),
		term: 'DocumentCreateDate',
		count: 101,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-27T00:00:00'),
		term: 'DocumentCreateDate',
		count: 93,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-28T00:00:00'),
		term: 'DocumentCreateDate',
		count: 119,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-29T00:00:00'),
		term: 'DocumentCreateDate',
		count: 114,
	},
	{
		__typename: 'DatesHistogramBar',
		date: new Date('2023-06-30T00:00:00'),
		term: 'DocumentCreateDate',
		count: 98,
	},
]

const startDate = new Date('2023-06-01T00:00:00')
const endDate = new Date('2023-06-30T00:00:00')

const defaultRange = [startDate, endDate]

export const Primary = {
	render: (args: TimeBrushProps) => <PrimaryComponent {...args} />,
	args: {
		width: 460,
		height: 25,
		dateRange: defaultRange,
		elements: defaultItems,
	},
}
