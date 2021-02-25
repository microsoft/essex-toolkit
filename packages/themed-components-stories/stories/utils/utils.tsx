import { JoinData } from './types'

export function search(
	p: string[],
	clusterIDMap: any,
): JoinData[][] | undefined {
	// Find all parents for selected node
	const container: any[] = []
	if (p.length > 0) {
		const all = innerSearch(p, clusterIDMap, container)
		return all
	}
}
export function innerSearch(
	parents: string[],
	clusterIDMap: any,
	container: any[],
) {
	if (parents.length > 0) {
		parents.forEach(d => {
			const values = clusterIDMap[`${d}`]
			const p = values.reduce(
				(acc: { add: (arg0: number) => void }, d: JoinData) => {
					if (d.parentCluster) {
						acc.add(d.parentCluster)
					}
					return acc
				},
				new Set([]),
			)
			container.push(values)
			innerSearch(Array.from(p), clusterIDMap, container)
		})
	}
	return container
}

export function CSVToArray(strData: string, strDelimiter: string) {
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = strDelimiter || ','

	// Create a regular expression to parse the CSV values.
	let objPattern = new RegExp(
		// Delimiters.
		'(\\' +
			strDelimiter +
			'|\\r?\\n|\\r|^)' +
			// Quoted fields.
			'(?:"([^"]*(?:""[^"]*)*)"|' +
			// Standard fields.
			'([^"\\' +
			strDelimiter +
			'\\r\\n]*))',
		'gi',
	)

	// Create an array to hold our data. Give the array
	// a default empty first row.
	let arrData: string[][] = [[]]

	// Create an array to hold our individual pattern
	// matching groups.
	let arrMatches: any = null

	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while ((arrMatches = objPattern.exec(strData))) {
		// Get the delimiter that was found.
		let strMatchedDelimiter = arrMatches[1]

		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push([])
		}

		let strMatchedValue: string = ''

		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[2]) {
			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"')
		} else {
			// We found a non-quoted value.
			strMatchedValue = arrMatches[3]
		}

		// Now that we have our value string, let's add
		// it to the data array.
		arrData[arrData.length - 1].push(strMatchedValue)
	}

	// Return the parsed data.
	return arrData
}

export function randomNumber(min: number, max: number): number {
	const r = Math.random() * (max - min) + min
	return Math.floor(r)
}
