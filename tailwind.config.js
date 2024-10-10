/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'md:grid-cols-2',
    'md:grid-cols-3',
    'bg-black',
    'bg-white',
    'object-cover',
    'object-fit',
    'object-fill',
    'object-none',
    'text-xl',
    'object-contain',
    'stroke-green',
    'stroke-black',
    ...Array.from({ length: 8 }, (_, i) => `pt-${i + 1}`),
    ...Array.from({ length: 8 }, (_, i) => `pb-${i + 1}`),
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter Tight'],
      'display': ['Didot'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': "#282727",
      'white': "#FFFFFF",  
      'green': '#E0FF00',  
      'purple': {
        base: '#D59CE5',
        light: '#E4D5E8',
      },  
    },
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'base': ['1rem', '1.25'],
      'lg': ['1.25rem', '1.35'],
      'xl': ['1.75rem', '1.25'],
      '2xl': ['2.875rem', '1.2'],
     },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
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
        4: '1rem',   // Represents 'spacing|40', equivalent to 16px
        5: '1.5rem',   // Represents 'spacing|40', equivalent to 16px
        6: '2.25rem', // Represents 'spacing|60', equivalent to 24px
        7: '3.5rem', // Represents 'spacing|60', equivalent to 24px
        8: '5rem',   // Represents 'spacing|80', equivalent to 32px
        // Add additional values if you need more steps between or beyond these values.
      },
    },

  },
  plugins: [],
}
