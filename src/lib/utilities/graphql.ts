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

export async function graphqlQuery<TData = any, TVariables = any>(
	query: string,
	variables: TVariables,
	options?: { requireAuth?: boolean }
): Promise<Response> {
	const headers: HeadersInit = {
		'content-type': 'application/json'
	}

	// Note: To enable authenticated requests, import WP_USERNAME and WP_APP_PW
	// from $env/static/private and add them to your .env file

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
