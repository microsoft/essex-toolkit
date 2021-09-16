/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphQLSchema } from 'graphql'
import { container, DependencyContainer } from 'tsyringe'
import {
	AppBuilder,
	BaseInjectorNames,
	LoggerProvider,
	RequestContextProvider,
} from '..'

export function registerAppBuilder(ctx: DependencyContainer = container): void {
	ctx.register(BaseInjectorNames.AppBuilder, { useClass: AppBuilder })
}

export function registerLogger(ctx: DependencyContainer = container): void {
	ctx.register(BaseInjectorNames.Logger, { useClass: LoggerProvider })
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
	ctx: DependencyContainer,
): void {
	ctx.register(BaseInjectorNames.RequestContextProviders, {
		useValue: providers,
	})
}
