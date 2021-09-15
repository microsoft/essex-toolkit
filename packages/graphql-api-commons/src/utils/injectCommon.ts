/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DependencyContainer } from 'tsyringe'
import { AppBuilder, BaseInjectorNames, LoggerProvider } from '..'

export type ContainerRegister = (
	container: DependencyContainer,
	token: BaseInjectorNames,
) => void

export interface BaseRegisters {
	[BaseInjectorNames.Configuration]: ContainerRegister
	[BaseInjectorNames.Schema]: ContainerRegister
	[BaseInjectorNames.RequestContextProviders]: ContainerRegister
	[BaseInjectorNames.AppContext]: ContainerRegister
	[BaseInjectorNames.Logger]?: ContainerRegister
	[BaseInjectorNames.AppBuilder]?: ContainerRegister
}

/**
 * Inject Boilerplace Components
 * @param container the DI container
 * @param baseRegisters container registers for base injectors
 */
export function injectCommon(
	container: DependencyContainer,
	baseRegisters: BaseRegisters,
): void {
	const registers = {
		...baseRegisters,
		[BaseInjectorNames.AppBuilder]:
			baseRegisters.AppBuilder ||
			((container, token) => {
				container.register(token, {
					useClass: AppBuilder,
				})
			}),
		[BaseInjectorNames.Logger]:
			baseRegisters.AppBuilder ||
			((container, token) => {
				container.register(token, {
					useValue: container.resolve(LoggerProvider).get(),
				})
			}),
	}

	registers.Configuration(container, BaseInjectorNames.Configuration)
	registers.Logger(container, BaseInjectorNames.Logger)
	registers.Schema(container, BaseInjectorNames.Schema)
	registers.RequestContextProviders(
		container,
		BaseInjectorNames.RequestContextProviders,
	)
	registers.AppContext(container, BaseInjectorNames.AppContext)
	registers.AppBuilder(container, BaseInjectorNames.AppBuilder)
}
