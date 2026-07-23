import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	// Generated from the committed schema snapshot rather than the live endpoint, so
	// generated.ts and schema.graphql can never drift apart and types can be
	// regenerated without a running WordPress. `pnpm codegen` refreshes the snapshot
	// first; `pnpm schema` refreshes it on its own.
	schema: './src/lib/graphql/schema.graphql',
	documents: ['./src/**/*.graphql', '!./src/**/*preview*.graphql'],
	generates: {
		'./src/lib/graphql/generated.ts': {
			plugins: ['typescript', 'typescript-operations', 'typescript-generic-sdk'],
			config: {
				useTypeImports: true
			}
		}
	}
}

export default config
