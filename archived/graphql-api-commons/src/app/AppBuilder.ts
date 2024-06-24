/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { startStandaloneServer } from '@apollo/server/standalone'
import type { FastifyInstance } from 'fastify'
import fastify from 'fastify'
import { GraphQLSchema } from 'graphql'
import { IncomingMessage } from 'http'
import { Logger } from 'pino'
import { inject, singleton } from 'tsyringe'

import type { IBaseConfiguration } from '../configuration/index.js'
import { BaseInjectorNames } from '../injectors.js'
import type { IBuiltAppContext, IRequestAppContext } from './index.js'

export type PreRunCb = (app: FastifyInstance) => Promise<void>

export interface RequestContextProvider<
	Configuration extends IBaseConfiguration,
	Components,
	RequestContext,
> {
	apply(
		ctx: IRequestAppContext<Configuration, Components, RequestContext>,
		request: IncomingMessage,
	): Promise<Partial<RequestContext>>
}

@singleton()
export class AppBuilder<
	Configuration extends IBaseConfiguration,
	Components,
	Context extends IBuiltAppContext<Configuration, Components>,
	RequestContext,
> {
	private _apolloServer: ApolloServer

	public constructor(
		@inject(BaseInjectorNames.AppContext)
		private _appContext: Context,
		@inject(BaseInjectorNames.Logger) private _logger: Logger,
		@inject(BaseInjectorNames.Schema) private _schema: GraphQLSchema,
		@inject(BaseInjectorNames.RequestContextProviders)
		private _requestContextProviders: Array<
			RequestContextProvider<Configuration, Components, RequestContext>
		>,
	) {
		this._apolloServer = this.createApolloServer()
	}

	private get config() {
		return this._appContext.configuration
	}

	private createApolloServer(): ApolloServer {
		return new ApolloServer({
			schema: this._schema,
			plugins: this.config.serverPlayground
				? undefined
				: [ApolloServerPluginLandingPageDisabled()],
			logger: this._logger,
			introspection: this.config.serverIntrospection,
		})
	}

	public async start(preRun?: PreRunCb): Promise<void> {
		const app = fastify({ logger: this._logger })
		const { url } = await startStandaloneServer(this._apolloServer, {
			context: async ({ req }) => {
				const ctx = { ...this._appContext, request: {} as RequestContext }
				for (const rcp of this._requestContextProviders) {
					const result = await rcp.apply(ctx, req)
					ctx.request = { ...ctx.request, ...result }
				}
				return ctx
			},
			listen: { port: 4000 },
		})
		await this._apolloServer.start()

		app.setErrorHandler(async (error, request, reply) => {
			if (error.validation) {
				void reply
					.code(400)
					.send({ message: error.message, validation: error.validation })
			} else {
				void reply
					.code(error.statusCode || 500)
					.send({ messsage: error.message })
			}
		})
		await preRun?.(app)
		await app.listen({
			port: this.config.serverPort,
		})
	}
}
