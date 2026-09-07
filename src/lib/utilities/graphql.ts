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

interface GraphQLError {
	message?: string
	path?: (string | number)[]
}

interface GraphQLResponse {
	data?: unknown
	errors?: GraphQLError[]
}

/**
 * Formats the `errors` array of a GraphQL response into readable lines.
 *
 * WordPress answers a partially failed query with HTTP 200: the failing field
 * is null, everything else resolves, and `errors` carries the reason. Without
 * this the failure is invisible — the block just renders with a missing
 * attribute, which is far harder to trace than an outright error.
 */
export function describeGraphQLErrors(json: unknown): string[] {
	const errors = (json as GraphQLResponse | null | undefined)?.errors

	if (!Array.isArray(errors)) {
		return []
	}

	return errors.map((err) => {
		const message = err?.message ?? 'Unknown GraphQL error'
		const path = err?.path?.join('.')

		return path ? `${message} (at ${path})` : message
	})
}

/**
 * Logs any GraphQL errors on an otherwise successful response.
 *
 * Deliberately does not throw: the catch-all route is prerendered, so a single
 * bad field should not fail an entire build. Returns the messages so callers
 * can escalate if they want to.
 */
export function reportGraphQLErrors(json: unknown, context: string): string[] {
	const messages = describeGraphQLErrors(json)

	if (messages.length > 0) {
		console.error(`GraphQL errors (${context}):\n  ${messages.join('\n  ')}`)
	}

	return messages
}

/**
 * Throws 502 when the backend rejected the query outright.
 *
 * A rejected query — a field that no longer exists, a malformed document — comes
 * back as HTTP 200 with `errors` and no `data`, which is indistinguishable from
 * "no such page" and surfaces as a 404. WordPress keeps moving block attributes
 * between releases (7.0 dropped `textAlign` from core/heading, 7.1 dropped it from
 * core/post-title), and because the queries share one fragment a single removed
 * field takes down every route at once.
 *
 * Unlike reportGraphQLErrors this does throw, including during prerendering. That
 * is deliberate: a query the backend refuses yields no page to build, so failing
 * the build beats shipping a site of 404s. Partial failures — `errors` alongside
 * usable `data` — remain non-fatal and stay with reportGraphQLErrors.
 */
export function assertGraphQLSucceeded(json: unknown, context: string): void {
	const payload = json as GraphQLResponse | null | undefined
	const messages = describeGraphQLErrors(payload)

	if (messages.length > 0 && payload?.data == null) {
		error(502, `GraphQL backend rejected the query (${context}): ${messages.join('; ')}`)
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

export async function graphqlQuery(
	query: string,
	variables: Record<string, unknown>,
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
