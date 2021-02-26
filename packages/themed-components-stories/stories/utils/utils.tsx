import { JoinData } from './types'
import { IChoiceGroupOption } from '@fluentui/react'
import { IStyles } from '@essex-js-toolkit/hierarchy-browser'

export const selectedClusterID = 204

export const clusterSampleID1 = 205
export const clusterSampleID2 = 128
export const clusterSampleID3 = 130
export const visibleColumns = ['x', 'y', 'd']
export const options: IChoiceGroupOption[] = [
	{ key: `${selectedClusterID}`, text: `${selectedClusterID}` },
	{ key: `${clusterSampleID1}`, text: `${clusterSampleID1}` },
	{ key: `${clusterSampleID2}`, text: `${clusterSampleID2}` },
	{ key: `${clusterSampleID3}`, text: `${clusterSampleID3}` },
]

// CUSTOM STYLES
const cardOverview = {
	root: { border: '1px solid white', borderRadius: '0px', background: 'black' },
	header: { color: '#f683ba' },
	headerText: 'mediumPlus',
	subHeaderText: 'medium',
	subheader: { color: 'white' },
	iconButton: { root: { color: '#f683ba' } },
}

const table = {
	header: { color: '#f683ba', height: '10px' },
	headerText: 'medium',
	subHeaderText: 'tiny',
	subheader: { fontStyle: 'italic' },
	tableItems: { fontStyle: 'italic', textAlign: 'center' },
	tableItemsText: 'medium',
	neighborExpandButton: { root: { color: 'black' } },
	root: { background: '#ced4e4' },
}
export const customStyle = { cardOverview, table } as IStyles

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
	strDelimiter = strDelimiter || ','
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

	let arrData: string[][] = [[]]
	let arrMatches: any = null

	while ((arrMatches = objPattern.exec(strData))) {
		let strMatchedDelimiter = arrMatches[1]

		if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
			arrData.push([])
		}

		let strMatchedValue: string = ''
		if (arrMatches[2]) {
			strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"')
		} else {
			strMatchedValue = arrMatches[3]
		}

		arrData[arrData.length - 1].push(strMatchedValue)
	}

	return arrData
}

export function randomNumber(min: number, max: number): number {
	const r = Math.random() * (max - min) + min
	return Math.floor(r)
}
