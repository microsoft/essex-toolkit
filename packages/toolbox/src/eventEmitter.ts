/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// taken from TableSorter https://github.com/Microsoft/PowerBI-visuals-TableSorter
type Handler = (...args: any[]) => any

interface DestroyObject {
	destroy: (key: string, handler?: Handler) => void
}
interface EventNameSpace {
	event: string
	namespace: string
}

/**
 * A mixin that adds support for event emitting
 */
export class EventEmitter {
	private listeners: { [key: string]: Handler[] } = {}

	/**
	 * Adds an event listener for the given event
	 */
	public on(key: string, handler?: Handler): DestroyObject | undefined {
		const listeners = (this.listeners[key] = this.listeners[key] || [])
		if (handler) {
			listeners.push(handler)
			return {
				destroy: () => {
					this.off(key, handler)
				},
			}
		}
	}

	/**
	 * Removes an event listener for the given event
	 */
	public off(key: string, handler?: Handler): void {
		if (handler) {
			const { namespace, event } = this.getNamespaceAndEvent(key)
			if (namespace && !event) {
				Object.keys(this.listeners).forEach(otherKey => {
					const { namespace: otherNamespace } = this.getNamespaceAndEvent(
						otherKey,
					)
					if (otherNamespace === namespace) {
						delete this.listeners[otherKey]
					}
				})
			} else {
				const listeners = this.listeners[key]
				if (listeners) {
					const idx = listeners.indexOf(handler)
					if (idx >= 0) {
						listeners.splice(idx, 1)
					}
				}
			}
		}
	}

	/**
	 * Raises the given event
	 */
	public emit(name: string, ...args: any[]): void {
		Object.keys(this.listeners).forEach(otherKey => {
			const { event } = this.getNamespaceAndEvent(otherKey)
			if (event === name) {
				this.listeners[otherKey].forEach(l => {
					l.apply(this, args)
				})
			}
		})
	}

	/**
	 * Returns the namespace and event name
	 * @param eventKey The event key, either "<event>" or "<event>.<namespace>"
	 */
	private getNamespaceAndEvent(eventKey: string): EventNameSpace {
		if (eventKey) {
			const [event, namespace] = eventKey.split('.')
			return {
				event,
				namespace,
			}
		}
		return {
			event: '',
			namespace: '',
		}
	}
}

export const eventEmitter = (): EventEmitter => {
	return new EventEmitter()
}
