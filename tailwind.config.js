/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'!mb-0',
		'!gap-0',
		'md:grid-cols-2',
		'md:grid-cols-3',
		'bg-black',
		'bg-white-pure',
		'object-cover',
		'object-fit',
		'object-fill',
		'object-none',
		'text-xl',
		'object-contain',
		'stroke-green',
		'stroke-black',
		'basestyles',
		...Array.from({ length: 8 }, (_, i) => `pt-${i + 1}`),
		...Array.from({ length: 8 }, (_, i) => `pb-${i + 1}`),
		...Array.from({ length: 60 }, (_, i) => `delay-[${i * 50}ms]`), // Generates delay-[0ms] through delay-[900ms]
		'bg-transparent',
		'bg-current',
		'bg-black',
		'bg-white-pure',
		'bg-white-off',
		'bg-green',
		'bg-yellow', 
		'bg-blue',
		'bg-red',
		'bg-sand'
	],
	theme: {
		fontFamily: {
			sans: ['Inter Tight'],
			martina: ['Martina Plantijn'],
			manchette: ['Manchette Fine'],
			boogy: ['Boogy Brut Poster']
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: '#262625',
			white: {
				pure: '#FFFFFF',
				off: '#fbf9f2'
			},
			green: '#3BCE6C',
			yellow: '#F0BF08',
			blue: '#509FB9',
			red: '#F47932',
			sand: '#DEC68C'
		},
		fontSize: {
			xs: '.5rem',
			sm: ['0.875rem', '1.138rem'],
			base: ['1.063rem', '1.438rem'],
			lg: ['1.8rem', '1.05'],
			xl: ['2.5rem', '1.05'],
			'2xl': ['2.875rem', '1.2'],
			'3xl': ['3.275rem', '1.2'],
			'4xl': ['4.313rem', '1.2']
		},
		screens: {
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '668px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1204px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px'
			// => @media (min-width: 1536px) { ... }
		},

		extend: {
			spacing: {
				// Assuming the base size is 0.25rem for 'spacing|10'
				// Tailwind uses rem units by default, where 1rem usually equals 16px.
				// Adjust these values as necessary for your design system
				1: '0.25rem', // Represents 'spacing|20', equivalent to 8px.
				2: '0.5rem', // Represents 'spacing|20', equivalent to 8px
				3: '0.7rem', // Represents 'spacing|20', equivalent to 8px
				4: '1rem', // Represents 'spacing|40', equivalent to 16px
				5: '1.5rem', // Represents 'spacing|40', equivalent to 16px
				6: '2.25rem', // Represents 'spacing|60', equivalent to 24px
				7: '3.5rem', // Represents 'spacing|60', equivalent to 24px
				8: '5rem' // Represents 'spacing|80', equivalent to 32px
				// Add additional values if you need more steps between or beyond these values.
			},
			dropShadow: {
				lg: '3px -2px 6px rgb(0 0 0 / 0.4)'
			}
		}
	},
	plugins: [
		require('@tailwindcss/container-queries'),
	]
}
