const tailwindColors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

const colors = {
	transparent: 'transparent',
	currentcolor: 'currentcolor',
	white: '#ffffff',
	black: '#000000',
	red: {
		dark: 'rgb(128, 40, 52)',
	},
	gray: {
		50: '#e9e9e9',
		100: '#d2d3d3',
		200: '#bcbcbc',
		300: '#a5a6a6',
		400: '#8f8f90',
		500: '#78797a',
		600: '#626263',
		700: '#4b4c4d',
		800: '#333334',
		900: '#1a1a1a',
		dark: 'rgb(75, 76, 77)',
	},
	'blue-bright': tailwindColors.blue,
	blue: {
		50: '#edf1f8',
		100: '#d4dae5',
		200: '#bbc4d1',
		300: '#a2adbe',
		400: '#8a96aa',
		500: '#717f97',
		600: '#586983',
		700: '#3f5270',
		800: '#263b5c',
		900: '#0f1724',
		dark: 'rgb(38, 59, 92)',
	},
	green: {
		dark: 'rgb(114, 149, 105)',
	},
	orange: {
		dark: 'rgb(198, 153, 40)',
	},
	tan: {
		fading: 'rgb(219, 219, 204)',
		// for info tables, accent is odd rows, light is even rows (PHB 178)
		accent: 'rgb(209, 208, 187)',
		light: 'rgb(222, 222, 208)',
	},
	brown: {
		dark: 'rgb(116, 66, 19)',
	},
	olive: {
		dark: 'rgb(70, 83, 45)',
	},
	book: {
		phb: 'rgb(38, 59, 92)',
		dmg: 'rgb(116, 66, 19)',
		mm: 'rgb(70, 83, 45)',
	},
	theme: {
		DEFAULT: 'var(--theme-color)',
	},
};

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.ts', './src/**/*.html'],
	theme: {
		colors,
		extend: {
			fontSize: {
				'4xs': '0.375rem',
				'3xs': '0.5rem',
				'2xs': '0.625rem',
			},
			fontFamily: {
				header: ['"Martel"', 'serif'],
				text: ['"Source Serif Pro"', 'serif'],
				info: ['"Lato"', 'sans-serif'],
				flavor: ['"IM Fell Great Primer"', 'sans-serif'],
			},
			screens: {
				print: { raw: 'print' },
			},
			spacing: {
				em: '1em',
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: [`odd`, `even`],
			backgroundImage: [`odd`, `even`],
			margin: [`first`],
		},
	},
	plugins: [
		plugin.withOptions(({ className = 'theme' } = {}) => {
			return ({ e, addUtilities, theme, variants }) => {
				const caretColors = generateColors(e, theme('colors'), `.${className}`, (color) => ({
					'--theme-color': color,
				}));
				addUtilities(caretColors, variants('caretColor'));
			};
		}),
	],
	corePlugins: {
		preflight: false,
	},
	important: '.foundry-reset.dndmashup',
};

const generateColors = (e, themeColors, prefix, styleGenerator) =>
	Object.keys(themeColors).reduce((acc, key) => {
		if (typeof themeColors[key] === 'string') {
			return {
				...acc,
				[`${prefix}-${e(key)}`]: styleGenerator(themeColors[key]),
			};
		}

		const innerColors = generateColors(e, themeColors[key], `${prefix}-${e(key)}`, styleGenerator);

		return {
			...acc,
			...innerColors,
		};
	}, {});
