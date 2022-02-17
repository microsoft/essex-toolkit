/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FastifyRequest } from 'fastify'
import {
	IAuthenticator,
	IBaseConfiguration,
	IRequestAppContext,
	RequestContextProvider,
} from '../index.js'

export interface IdentityRequestContext<Identity> {
	identity: Identity | null
}

export type Transformer<T> = (value: T) => T
export const stripBearerPrefix: Transformer<string | null> = header =>
	header == null
		? null
		: header.indexOf('Bearer ') === 0
		? header.slice('Bearer '.length)
		: header

export class IdentityRequestContextProvider<
	Configuration extends IBaseConfiguration,
	Components extends { authenticator: IAuthenticator<unknown, Identity> },
	RequestContext extends IdentityRequestContext<Identity>,
	Identity,
> implements RequestContextProvider<Configuration, Components, RequestContext>
{
	private _headerName: string
	private _headerTransformer: Transformer<string | null>

	public constructor(
		headerName = 'authorization',
		headerTransformer = stripBearerPrefix,
	) {
		this._headerTransformer = headerTransformer
		this._headerName = headerName
	}

	public async apply(
		ctx: IRequestAppContext<Configuration, Components, RequestContext>,
		request: FastifyRequest,
	): Promise<Partial<RequestContext>> {
		const { authenticator } = ctx.components
		const token = this._headerTransformer(
			(request.headers[this._headerName] as string) ?? null,
		)
		const identity = await authenticator.verifyToken(token)
		return { identity } as Partial<RequestContext>
	}
}
