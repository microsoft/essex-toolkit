/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	BooleanOperation,
	FilterExpressionView,
} from '@essex/boolean-expression-component'

const meta = {
	title: '@essex:boolean-expression-component/BooleanExpression',
}
export default meta

export const SingleClause = () => {
	return (
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
	)
}

SingleClause.storyName = 'Single Clause'

export const TwoClausesInAttribute = () => {
	return (
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
	)
}
TwoClausesInAttribute.storyName = 'Two Clauses in Single Attribute'

export const TwoAttributes = () => {
	return (
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
	)
}
TwoAttributes.storyName = 'Two Attributes'
