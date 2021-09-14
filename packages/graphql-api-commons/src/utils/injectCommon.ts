/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DependencyContainer } from 'tsyringe'
import { AppBuilder, BaseInjectorNames, LoggerProvider } from '..'

/**
 * Inject Boilerplace Components
 * @param container the DI container
 */
export async function injectCommon(
	container: DependencyContainer,
): Promise<void> {
	container.register(BaseInjectorNames.Logger, {
		useValue: container.resolve(LoggerProvider).get(),
	})
	container.register(BaseInjectorNames.AppBuilder, {
		useValue: container.resolve(AppBuilder),
	})
}
