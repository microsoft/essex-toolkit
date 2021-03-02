/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IChoiceGroupOption } from '@fluentui/react'
import { JoinData } from './types'
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
	headerText: 'small',
	subHeaderText: 'tiny',
	subheader: { fontStyle: 'italic' },
	tableItems: { fontStyle: 'italic', textAlign: 'center' },
	tableItemsText: 'large',
	neighborExpandButton: { root: { color: 'black' } },
	root: { background: '#ced4e4' },
}
export const customStyle = { cardOverview, table } as IStyles

export function search(
	p: string[],
	clusterIDMap: { [x: string]: JoinData[] },
): JoinData[][] | undefined {
	// Find all parents for selected node
	const container: JoinData[][] = []
	if (p.length > 0) {
		const all = innerSearch(p, clusterIDMap, container)
		return all
	}
}
export function innerSearch(
	parents: string[],
	clusterIDMap: { [x: string]: JoinData[] },
	container: JoinData[][],
): JoinData[][] {
	if (parents.length > 0) {
		parents.forEach(d => {
			const values = clusterIDMap[`${d}`]
			const p = values.reduce((acc, d: JoinData) => {
				if (d.parentCluster) {
					acc.add(`${d.parentCluster}`)
				}
				return acc
			}, new Set([]) as Set<string>)
			container.push(values)
			innerSearch(Array.from(p), clusterIDMap, container)
		})
	}
	return container
}

export const loadRemoteData = async (
	url: string,
	setFunc: (d: any[]) => void,
): Promise<void> => {
	const resp = await fetch(url)
	const data = await resp.text()
	const parsedData = CSVToArray(data, ',')
	const header = parsedData[0]
	const sliced = parsedData.slice(1)
	const mappedValues: any[] = sliced.map(arr => {
		const obj = header.reduce((accum, colName, index) => {
			let value: string | number = arr[index]
			value = isNaN(+value) ? value : +value
			accum = { ...accum, [colName]: value }
			return accum
		}, {} as any)
		return obj
	})
	setFunc(mappedValues)
}

export function CSVToArray(strData: string, strDelimiter: string): string[][] {
	strDelimiter = strDelimiter || ','
	const objPattern = new RegExp(
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

	const arrData: string[][] = [[]]
	let arrMatches: any = null

	while ((arrMatches = objPattern.exec(strData))) {
		const strMatchedDelimiter = arrMatches[1]

		if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
			arrData.push([])
		}

		let strMatchedValue = ''
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
