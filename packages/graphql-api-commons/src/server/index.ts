/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppBuilder, PreRunCb, IBaseAppContext } from '@crisishub/api-commons'
import { GraphQLSchema } from 'graphql'
import { Logger } from 'pino'
import { inject, singleton } from 'tsyringe'
import { IBaseConfiguration } from '../configuration'
import { BaseInjectorNames } from '../injectors'

@singleton()
export class Server<
	TConfiguration extends IBaseConfiguration,
	TContext extends IBaseAppContext<TConfiguration>,
> {
	constructor(
		@inject(BaseInjectorNames.Configuration)
		private _configuration: TConfiguration,
		@inject(BaseInjectorNames.Schema) private _schema: GraphQLSchema,
		@inject(BaseInjectorNames.AppContext) private _appContext: TContext,
		@inject(BaseInjectorNames.Logger) private _logger: Logger,
	) {}

	public async start(preRun?: PreRunCb): Promise<void> {
		try {
			this._logger.info('intializing server...')

			const appBuilder = new AppBuilder(
				this._appContext,
				this._logger,
				this._schema,
			)

			this._logger.info('starting server...')

			await appBuilder.start(preRun)

			this._logger.info(
				`server listening on port ${this._configuration.serverPort}`,
			)
		} catch (err) {
			this._logger.error('error starting app', err)
			throw err
		}
	}
}
