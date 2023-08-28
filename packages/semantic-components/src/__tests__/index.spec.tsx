/*
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 *
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'

import semantic from '../index.js'

const ComponentA: React.FC<{
	id: string
	className: string
	style: React.CSSProperties
}> = ({ id, className, style }) => {
	return <div id={id} className={className} style={style} />
}
const SemanticA = semantic(ComponentA, {
	className: 'my-class',
	style: { color: 'red' },
})

const SemanticDiv = semantic.div({ id: 'abc' })

describe('Semantic Components', () => {
	it('can describe a standard HTML component', () => {
		render(<SemanticDiv />)
		const found = document.querySelector('#abc')
		expect(found).toBeDefined()
		expect(found).not.toBeNull()
	})

	it('can override the id of a component', () => {
		render(<SemanticDiv id='def' />)
		let found = document.querySelector('#abc')
		expect(found).toBeNull()
		found = document.querySelector('#def')
		expect(found).toBeDefined()
		expect(found).not.toBeNull()
	})

	it('can render a decorated custom component', () => {
		render(
			<SemanticDiv>
				<SemanticA id='def' />
			</SemanticDiv>,
		)

		expect(document.querySelectorAll('.my-class')).toHaveLength(1)
	})

	it('can augment the classnames of a component', () => {
		render(
			<SemanticDiv>
				<SemanticA id='def' className='c' />
			</SemanticDiv>,
		)
		expect(document.querySelectorAll('.my-class')).toHaveLength(1)
		expect(document.querySelectorAll('.c')).toHaveLength(1)
	})
})
