/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkbar } from '../Sparkbar.js'

const meta = {
	title: 'Sparkbar',
}
export default meta

export const BasicAscending = () => {
	return <Sparkbar width={150} height={30} data={[1, 2, 3, 4]}></Sparkbar>
}
