import { FastifyRequest } from 'fastify'
import {
	IAuthenticator,
	IBaseConfiguration,
	IRequestAppContext,
	RequestContextProvider,
} from '..'

export class IdentityRequestContextProvider<
	Configuration extends IBaseConfiguration,
	Components extends { authenticator: IAuthenticator<unknown, Identity> },
	RequestContext extends { identity: Identity | null },
	Identity,
> implements RequestContextProvider<Configuration, Components, RequestContext>
{
	public async apply(
		ctx: IRequestAppContext<Configuration, Components, RequestContext>,
		request: FastifyRequest,
	): Promise<Partial<RequestContext>> {
		const { authenticator } = ctx.components
		const identity = await authenticator.verifyToken(
			request.headers.authorization ?? null,
		)
		return { identity } as Partial<RequestContext>
	}
}
