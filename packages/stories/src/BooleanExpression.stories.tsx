import React from 'react'
import {
	BooleanOperation,
	FilterExpressionView,
} from '@essex-js-toolkit/boolean-expression-component'
import { CSF } from './types'

const story = {
	title: 'BooleanExpression',
}
export default story

export const SingleClause: CSF = () => {
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

SingleClause.story = {
	name: 'Single Clause',
}

export const TwoClausesInAttribute: CSF = () => {
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
TwoClausesInAttribute.story = { name: 'Two Clauses in Single Attribute' }

export const TwoAttributes: CSF = () => {
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
TwoAttributes.story = { name: 'Two Attributes' }
