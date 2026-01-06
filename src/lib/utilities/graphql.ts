import { GRAPHQL_ENDPOINT } from '$env/static/private'
import { error } from '@sveltejs/kit'

export function checkResponse(response: Response) {
	const { headers, ok } = response
	if (!ok) {
		error(502, 'Bad Gateway')
	}

	if (!headers.get('content-type')?.includes('application/json')) {
		error(502, 'Bad Gateway: expected JSON data from GraphQL backend')
	}
}

interface GraphQLOptions {
	/** Include authentication headers */
	includeAuth?: boolean
	/** Original request (for cookie forwarding) */
	request?: Request
	/** Preview token from WordPress */
	token?: string
}

export async function graphqlQuery<TData = any, TVariables = any>(
	query: string,
	variables: TVariables,
	options?: GraphQLOptions
): Promise<Response> {
	const headers: HeadersInit = {
		'content-type': 'application/json'
	}

	// Add preview token if provided
	if (options?.token) {
		headers['X-Preview-Token'] = options.token
	}

	// Forward cookies from request if includeAuth is set
	if (options?.includeAuth && options?.request) {
		const cookie = options.request.headers.get('cookie')
		if (cookie) {
			headers['Cookie'] = cookie
		}
	}

	return fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			query,
			variables
		}),
		cache: 'no-cache'
	})
}
