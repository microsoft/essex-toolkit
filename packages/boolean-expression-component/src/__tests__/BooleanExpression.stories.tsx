/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	BooleanOperation,
	FilterExpressionView,
} from '@essex/boolean-expression-component'

const story = {
	title: '@essex:boolean-expression-component/BooleanExpression',
}
export default story

export const SingleClause = () => {
	return (
		<div>
			<FilterExpressionView
				operation={BooleanOperation.AND}
				filters={[
					{
						id: 'age',
						label: 'Age',
						operation: BooleanOperation.AND,
						filters: [{ id: 'age.20+', label: '20+' }],
					},
				]}
			/>
		</div>
	)
}

SingleClause.storyName = 'Single Clause'

export const TwoClausesInAttribute = () => {
	return (
		<div>
			<FilterExpressionView
				operation={BooleanOperation.AND}
				filters={[
					{
						id: 'age',
						label: 'Age',
						operation: BooleanOperation.AND,
						filters: [
							{ id: 'age.20+', label: '20-29' },
							{ id: 'age.30+', label: '30-39' },
						],
					},
				]}
			/>
		</div>
	)
}
TwoClausesInAttribute.storyName = 'Two Clauses in Single Attribute'

export const TwoAttributes = () => {
	return (
		<div>
			<FilterExpressionView
				operation={BooleanOperation.AND}
				filters={[
					{
						id: 'age',
						label: 'Age',
						operation: BooleanOperation.AND,
						filters: [
							{ id: 'age.20+', label: '20-29' },
							{ id: 'age.30+', label: '30-39' },
						],
					},
					{
						id: 'location',
						label: 'Location',
						operation: BooleanOperation.OR,
						filters: [
							{ id: 'us', label: 'USA' },
							{ id: 'canada', label: 'Canada' },
						],
					},
				]}
			/>
		</div>
	)
}
TwoAttributes.storyName = 'Two Attributes'
