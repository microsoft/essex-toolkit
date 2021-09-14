/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import pino, { Logger } from 'pino'
import { inject, singleton } from 'tsyringe'
import { IBaseConfiguration } from '../configuration'
import { BaseInjectorNames } from '../injectors'
import { Provider } from './Provider'

@singleton()
export class LoggerProvider<TConfiguration extends IBaseConfiguration>
	implements Provider<Logger>
{
	private _logger: Logger

	public constructor(
		@inject(BaseInjectorNames.Configuration) private _config: TConfiguration,
	) {
		this._logger = pino({
			serializers: {
				err: pino.stdSerializers.err,
				error: pino.stdSerializers.err,
			},
			prettyPrint: this._config.loggingPretty
				? {
						levelFirst: true,
				  }
				: undefined,
		})
	}

	public get(): Logger {
		return this._logger
	}
}
