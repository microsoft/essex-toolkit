/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphQLSchema } from 'graphql'
import type { DependencyContainer } from 'tsyringe'
import { container } from 'tsyringe'

import type { RequestContextProvider } from '../index.js'
import { AppBuilder, BaseInjectorNames, LoggerProvider } from '../index.js'

export function registerAppBuilder(ctx: DependencyContainer = container): void {
	ctx.register(BaseInjectorNames.AppBuilder, { useClass: AppBuilder })
}

export function registerLogger(ctx: DependencyContainer = container): void {
	ctx.register(BaseInjectorNames.Logger, {
		useValue: ctx.resolve(LoggerProvider).get(),
	})
}

export function registerSchema(
	schema: GraphQLSchema,
	ctx: DependencyContainer = container,
): void {
	ctx.register(BaseInjectorNames.Schema, { useValue: schema })
}

export function registerRequestContextProviders(
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	providers: RequestContextProvider<any, unknown, unknown>[],
	ctx: DependencyContainer = container,
): void {
	ctx.register(BaseInjectorNames.RequestContextProviders, {
		useValue: providers,
	})
}
