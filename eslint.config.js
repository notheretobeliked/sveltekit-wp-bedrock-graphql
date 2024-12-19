import js from '@eslint/js'
import ts from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		},
		// Add rules configuration to disable a11y rules
		rules: {
			'svelte/a11y-click-events-have-key-events': 'off',
			'svelte/a11y-missing-attribute': 'off',
			'svelte/a11y-missing-content': 'off',
			'svelte/a11y-label-has-associated-control': 'off'
			// Add any other a11y rules you want to disable
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
]
