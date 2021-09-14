/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Logger } from 'pino'
import { inject, singleton } from 'tsyringe'
import { AppBuilder, PreRunCb, IBuiltAppContext } from '../app'
import { IBaseConfiguration } from '../configuration'
import { BaseInjectorNames } from '../injectors'

@singleton()
export class Server<
	Configuration extends IBaseConfiguration,
	Components,
	Context extends IBuiltAppContext<Configuration, Components>,
	RequestContext,
> {
	constructor(
		@inject(BaseInjectorNames.Configuration)
		private _configuration: Configuration,
		@inject(BaseInjectorNames.AppBuilder)
		private _appBuilder: AppBuilder<
			Configuration,
			Components,
			Context,
			RequestContext
		>,
		@inject(BaseInjectorNames.Logger) private _logger: Logger,
	) {}

	public async start(preRun?: PreRunCb): Promise<void> {
		try {
			this._logger.info('starting server...')
			await this._appBuilder.start(preRun)

			this._logger.info(
				`server listening on port ${this._configuration.serverPort}`,
			)
		} catch (err) {
			this._logger.error('error starting app', err)
			throw err
		}
	}
}
