import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: process.env.GRAPHQL_ENDPOINT,
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
