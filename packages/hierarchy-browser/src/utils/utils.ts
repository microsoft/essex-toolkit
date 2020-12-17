/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	EntityId,
	IEntityDetail,
	CommunityId,
	INeighborCommunityDetail,
	IHierarchyDataResponse,
	IHierarchyNeighborResponse,
	ILoadParams,
	ICommunityDetail,
} from '..'
import { ICommunity, IEntityMap } from '../common/types/types'

interface IFlattenedEntities {
	id: EntityId
	[key: string]: EntityId
}

interface IEntityCounter {
	current: EntityId[]
	next?: EntityId[]
}
export function flattenJSONObjects(
	entities: IEntityDetail[],
): IFlattenedEntities[] {
	return entities.map(d => {
		if (d.attrs) {
			return Object.assign({}, { id: d.id, ...d.attrs })
		}
		return d
	})
}

export function convertJSONToCSV(objArray: IFlattenedEntities[]): string {
	return objArray.reduce((str, item) => {
		const keys = Object.keys(item)
		let line = ''
		keys.forEach(key => {
			if (line !== '') line += ','
			line += item[key]
		})
		str += line + '\r\n'
		return str
	}, '')
}

function convertHeaderToString(header: string[]): string {
	return header.reduce((str, key, i) => {
		if (str !== '') str += ','
		str += key
		if (i === header.length - 1) {
			str += '\r\n'
		}
		return str
	}, '')
}

export function exportCSVFile(items: IEntityDetail[], fileTitle: string): void {
	const flatEntities = flattenJSONObjects(items)
	const headers = Object.keys(flatEntities[0])
	const datastring = convertJSONToCSV(flatEntities)
	const headerstring = convertHeaderToString(headers)
	const csv = headerstring + datastring
	const exportedFilename = fileTitle + '.csv'
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
	if (navigator.msSaveBlob) {
		// IE 10+
		navigator.msSaveBlob(blob, exportedFilename)
	} else {
		const link = document.createElement('a')
		if (link.download !== undefined) {
			// Browsers that support HTML5 download attribute
			const url = URL.createObjectURL(blob)
			link.setAttribute('href', url)
			link.setAttribute('download', exportedFilename)
			link.style.visibility = 'hidden'
			document.body.appendChild(link)
			link.click()
			;(link.parentNode as HTMLElement).removeChild(link)
		}
	}
}

export function getStaticEntities(
	communities: ICommunity[],
	entityMap: IEntityMap,
	level: number,
	filtered: boolean,
	community: CommunityId,
): IEntityDetail[] {
	const levelIds = communities.reduce(
		(acc, d) => {
			if (d.entityIds) {
				if (d.communityId === community) {
					acc.current = acc.current.concat(d.entityIds)
				}
				if (filtered && d.level === level + 1) {
					acc.next = acc.next?.concat(d.entityIds)
				}
			}
			return acc
		},
		{ current: [], next: [] } as IEntityCounter,
	)
	const seen = new Set(levelIds.next)
	return levelIds.current.reduce((acc, id) => {
		const entity = entityMap[`${id}`]
		if (entity) {
			if (!filtered) {
				acc.push(entity)
			} else if (!seen.has(id)) {
				acc.push(entity)
			}
		}
		return acc
	}, [] as IEntityDetail[])
}

export function getStaticNeighborEntities(
	communities: INeighborCommunityDetail[],
	entityMap: IEntityMap,
	community: CommunityId,
): IEntityDetail[] {
	const levelIds = communities.reduce(
		(acc, d) => {
			if (d.entityIds) {
				if (d.communityId === community) {
					acc.current = acc.current.concat(d.entityIds)
				}
			}
			return acc
		},
		{ current: [] } as IEntityCounter,
	)
	return levelIds.current.reduce((acc, id) => {
		const entity = entityMap[`${id}`]
		if (entity) {
			acc.push(entity)
		}
		return acc
	}, [] as IEntityDetail[])
}

export function createEntityMap(
	entities?: IEntityDetail[],
): IEntityMap | undefined {
	if (entities) {
		return entities.reduce((acc, entity) => {
			const id = entity.id
			acc[id] = entity
			return acc
		}, {} as IEntityMap)
	}
}

export function isEntitiesAsync(
	entities?:
		| (IEntityDetail[] | INeighborCommunityDetail[])
		| ((
				params: ILoadParams,
		  ) => Promise<IHierarchyNeighborResponse | IHierarchyDataResponse>),
): boolean {
	return !Array.isArray(entities) || entities instanceof Promise
}

export function addLevelLabels(communities: ICommunityDetail[]): ICommunity[] {
	const max = communities.length - 1
	return communities.map((comm, index) =>
		Object.assign({}, { ...comm, level: max - index }),
	)
}

export interface IColorRGB {
	r: number
	g: number
	b: number
}

export function hexToRgb(hex: string): IColorRGB | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null
}

export function dedup(entities: IEntityDetail[]): IEntityDetail[] {
	const seen: Set<EntityId> = new Set([])
	const deduped = entities.reduce((acc, d) => {
		if (!seen.has(d.id)) {
			seen.add(d.id)
			acc.push(d)
		}
		return acc
	}, [] as IEntityDetail[])
	return deduped
}
