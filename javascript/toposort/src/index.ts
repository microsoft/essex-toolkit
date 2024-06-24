/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Toposort an edge list
 * @param edges - the edge list
 * @returns the topologically sorted node array
 */
export function toposort<T = string>(
	edges: ReadonlyArray<[T, T | undefined]>,
): T[] {
	return array(uniqueNodes(edges), edges)
}

/**
 *
 * @param nodes - the nodes array
 * @param edges - the edges array
 * @returns the topologically sorted node array
 */
export function array<T = string>(
	nodes: ReadonlyArray<T>,
	edges: ReadonlyArray<[T, T | undefined]>,
) {
	let cursor = nodes.length
	let i = cursor
	const sorted = new Array(cursor)
	const visited: Record<number, boolean> = {}
	// Better data structures make algorithm much faster.
	const outgoingEdges = makeOutgoingEdges(edges)
	const nodesHash = makeNodesHash(nodes)

	// check for unknown nodes
	edges.forEach(([from, to]) => {
		const hasFrom = nodesHash.has(from)
		const hasTo = to ? nodesHash.has(to) : true
		if (!(hasFrom && hasTo)) {
			throw new Error(
				'Unknown node. There is an unknown node in the supplied edges.',
			)
		}
	})

	while (i--) {
		const node = nodes[i]
		const isVisited = visited[i]
		if (node != null && !isVisited) {
			visit(node, i, new Set())
		}
	}

	return sorted

	function visit(node: T, i: number, predecessors: Set<T>) {
		if (predecessors.has(node)) {
			let nodeRep: string
			try {
				nodeRep = `, node was:${JSON.stringify(node)}`
			} catch (e) {
				nodeRep = ''
			}
			throw new Error(`Cyclic dependency${nodeRep}`)
		}

		if (!nodesHash.has(node)) {
			throw new Error(
				`Found unknown node. Make sure to provided all involved nodes. Unknown node: ${JSON.stringify(
					node,
				)}`,
			)
		}

		if (visited[i]) return
		visited[i] = true

		const outgoingSet = outgoingEdges.get(node) || new Set<T>()
		const outgoing = Array.from(outgoingSet)

		if (outgoing.length) {
			let outgoingLen = outgoing.length
			predecessors.add(node)
			do {
				const child = outgoing[--outgoingLen] as T
				visit(child, nodesHash.get(child) as number, predecessors)
			} while (outgoingLen)
			predecessors.delete(node)
		}

		sorted[--cursor] = node
	}
}

function uniqueNodes<T>(arr: ReadonlyArray<[T, T | undefined]>): T[] {
	const res = new Set<T>()
	for (let i = 0, len = arr.length; i < len; i++) {
		const [from, to] = arr[i] as [T, T | undefined]
		res.add(from)
		if (to != null) {
			res.add(to)
		}
	}
	return Array.from(res)
}

function makeOutgoingEdges<T>(
	arr: ReadonlyArray<[T, T | undefined]>,
): Map<T, Set<T>> {
	const edges = new Map<T, Set<T>>()
	for (let i = 0, len = arr.length; i < len; i++) {
		const [from, to] = arr[i] as [T, T | undefined]
		if (!edges.has(from)) {
			edges.set(from, new Set())
		}
		if (to != null && !edges.has(to)) {
			edges.set(to, new Set())
		}
		if (to != null) {
			edges.get(from)?.add(to)
		}
	}
	return edges
}

function makeNodesHash<T>(arr: ReadonlyArray<T>): Map<T, number> {
	const res = new Map<T, number>()
	for (let i = 0, len = arr.length; i < len; i++) {
		res.set(arr[i] as T, i)
	}
	return res
}
