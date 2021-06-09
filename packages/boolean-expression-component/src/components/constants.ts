import { BooleanOperation, Palette } from '../types'

export const DEFAULT_PALETTE: Palette = {
	backgroundColor: 'white',
	operations: {
		[BooleanOperation.AND]: '#80acf7',
		[BooleanOperation.OR]: '#4D7BBA',
	},
}

export const NO_OP = () => {
	/* nothing */
}
