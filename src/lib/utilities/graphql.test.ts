import { describe, it, expect, vi, afterEach } from 'vitest'
import { describeGraphQLErrors, reportGraphQLErrors } from './graphql'

afterEach(() => {
	vi.restoreAllMocks()
})

describe('describeGraphQLErrors', () => {
	it('returns nothing for a clean response', () => {
		expect(describeGraphQLErrors({ data: { nodeByUri: {} } })).toEqual([])
	})

	it('returns nothing for null, undefined, or a non-object', () => {
		expect(describeGraphQLErrors(null)).toEqual([])
		expect(describeGraphQLErrors(undefined)).toEqual([])
		expect(describeGraphQLErrors('boom')).toEqual([])
	})

	it('ignores a malformed errors value', () => {
		expect(describeGraphQLErrors({ errors: 'nope' })).toEqual([])
	})

	it('includes the field path so the failing attribute is identifiable', () => {
		// Shape of the real WP 7.0 failure: core/accordion-item attributes resolved
		// to null because openByDefault errored, with the rest of the page intact.
		const json = {
			data: { nodeByUri: { editorBlocks: [{ name: 'core/accordion-item', attributes: null }] } },
			errors: [
				{
					message: 'Internal server error',
					path: ['nodeByUri', 'editorBlocks', 3, 'attributes', 'openByDefault']
				}
			]
		}

		expect(describeGraphQLErrors(json)).toEqual([
			'Internal server error (at nodeByUri.editorBlocks.3.attributes.openByDefault)'
		])
	})

	it('handles errors without a path', () => {
		expect(describeGraphQLErrors({ errors: [{ message: 'Syntax error' }] })).toEqual([
			'Syntax error'
		])
	})

	it('falls back when an error carries no message', () => {
		expect(describeGraphQLErrors({ errors: [{}] })).toEqual(['Unknown GraphQL error'])
	})

	it('describes every error, not just the first', () => {
		const json = {
			errors: [
				{ message: 'First', path: ['a'] },
				{ message: 'Second', path: ['b'] }
			]
		}

		expect(describeGraphQLErrors(json)).toEqual(['First (at a)', 'Second (at b)'])
	})
})

describe('reportGraphQLErrors', () => {
	it('logs once with the context and every message', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
		const json = {
			errors: [{ message: 'Internal server error', path: ['attributes', 'openByDefault'] }]
		}

		const messages = reportGraphQLErrors(json, 'page /about')

		expect(messages).toEqual(['Internal server error (at attributes.openByDefault)'])
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy.mock.calls[0][0]).toContain('page /about')
		expect(spy.mock.calls[0][0]).toContain('attributes.openByDefault')
	})

	it('stays silent on a clean response', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

		expect(reportGraphQLErrors({ data: {} }, 'page /')).toEqual([])
		expect(spy).not.toHaveBeenCalled()
	})
})
