/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkline } from '../Sparkline.js'

const meta = {
	title: 'Sparkline',
}
export default meta

export const Basic = () => {
	return <Sparkline width={150} height={30} data={[1, 2, 3, 4]}></Sparkline>
}