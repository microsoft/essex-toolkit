/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-fastify'
import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { GraphQLSchema } from 'graphql'
import { Logger } from 'pino'
import { inject, singleton } from 'tsyringe'
import { IAuthenticator } from '..'
import { IBaseConfiguration } from '../configuration'
import { BaseInjectorNames } from '../injectors'
import { IRequestAppContext } from './BaseAppContext'

export type PreRunCb = (app: FastifyInstance) => Promise<void>

@singleton()
export class AppBuilder<
	Configuration extends IBaseConfiguration,
	Context extends IRequestAppContext<
		Configuration,
		IAuthenticator<unknown, unknown>,
		unknown
	>,
> {
	private _apolloServer: ApolloServer

	public constructor(
		@inject(BaseInjectorNames.AppContext) private _appContext: Context,
		@inject(BaseInjectorNames.Logger) private _logger: Logger,
		@inject(BaseInjectorNames.Schema) private _schema: GraphQLSchema,
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
				: [ApolloServerPluginLandingPageDisabled],
			logger: this._logger,
			introspection: this.config.serverIntrospection,
			context: async ({ request }: { request?: FastifyRequest }) => {
				const { authenticator } = this._appContext.components
				const identity = await authenticator.verifyToken(
					request?.headers?.authorization,
				)

				return {
					...this._appContext,
					request: {
						identity,
					},
				} as Context
			},
			debug: false,
		})
	}

	public async start(preRun?: PreRunCb): Promise<void> {
		const app = fastify({ logger: this._logger })

		await this._apolloServer.start()
		app.setErrorHandler(async (error, request, reply) => {
			if (error.validation) {
				reply
					.code(400)
					.send({ messsage: error.message, validation: error.validation })
			} else {
				reply.code(error.statusCode || 500).send({ messsage: error.message })
			}
		})
		/* eslint-disable  @essex/adjacent-await */
		await preRun?.(app)
		await app.register(
			this._apolloServer.createHandler({
				cors: true,
			}),
		)
		await app.listen({
			port: this.config.serverPort,
		})
	}
}
