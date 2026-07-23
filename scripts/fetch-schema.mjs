/**
 * Snapshots the WordPress GraphQL schema to SDL so queries can be validated
 * offline (in CI, without a running WordPress).
 *
 * Run via `pnpm codegen`, or on its own with `pnpm schema`.
 */
import 'dotenv/config'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'

const endpoint = process.env.GRAPHQL_ENDPOINT
const outFile = resolve('./src/lib/graphql/schema.graphql')

if (!endpoint) {
	console.error('GRAPHQL_ENDPOINT is not set. Copy .env.example to .env first.')
	process.exit(1)
}

const response = await fetch(endpoint, {
	method: 'POST',
	headers: { 'content-type': 'application/json' },
	// Descriptions are kept so codegen can carry them into generated.ts as JSDoc.
	body: JSON.stringify({ query: getIntrospectionQuery({ descriptions: true }) })
})

if (!response.ok) {
	console.error(`Introspection failed: ${response.status} ${response.statusText}`)
	process.exit(1)
}

const { data, errors } = await response.json()

if (errors?.length) {
	console.error('Introspection returned errors:', JSON.stringify(errors, null, 2))
	process.exit(1)
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, printSchema(buildClientSchema(data)) + '\n')

console.log(`Wrote schema snapshot to ${outFile}`)
