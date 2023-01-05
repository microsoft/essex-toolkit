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
	private listeners = new Map<string, Handler[]>()

	/**
	 * Adds an event listener for the given event
	 */
	public on(key: string, handler?: Handler): DestroyObject | undefined {
		if (!this.listeners.has(key)) {
			this.listeners.set(key, [])
		}
		const listeners = this.listeners.get(key)
		if (listeners && handler) {
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
				Object.keys(this.listeners).forEach((otherKey) => {
					const { namespace: otherNamespace } =
						this.getNamespaceAndEvent(otherKey)
					if (otherNamespace === namespace) {
						this.listeners.delete(otherKey)
					}
				})
			} else {
				const listeners = this.listeners.get(key)
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
		const keys = [...this.listeners.keys()]
		keys.forEach((otherKey) => {
			const { event } = this.getNamespaceAndEvent(otherKey)
			const handlers = this.listeners.get(otherKey)
			if (handlers && event === name) {
				handlers.forEach((l) => l.apply(this, args))
			}
		})
	}

	/**
	 * Returns the namespace and event name
	 * @param eventKey - The event key, either "<event>" or "<event>.<namespace>"
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
