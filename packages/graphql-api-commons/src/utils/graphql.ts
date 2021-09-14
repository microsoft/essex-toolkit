/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

export function attachDirectiveResolvers<ResolverType>(
	schema: GraphQLSchema,
	directiveResolvers: Record<string, ResolverType>,
): GraphQLSchema {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: fieldConfig => {
			const newFieldConfig = { ...fieldConfig }

			const directives = getDirectives(schema, fieldConfig)

			for (const directive of directives) {
				const directiveName = directive.name
				if (directiveResolvers[directiveName]) {
					const resolver = directiveResolvers[directiveName]
					const originalResolver =
						newFieldConfig.resolve != null
							? newFieldConfig.resolve
							: defaultFieldResolver
					const directiveArgs = directive.args
					newFieldConfig.resolve = (source, originalArgs, context, info) => {
						return (resolver as any)(
							() =>
								new Promise((resolve, reject) => {
									const result = originalResolver(
										source,
										originalArgs,
										context,
										info,
									)
									if (result instanceof Error) {
										reject(result)
									}
									resolve(result)
								}),
							source,
							directiveArgs as any,
							context,
							info,
						)
					}
				}
			}

			return newFieldConfig
		},
	})
}
