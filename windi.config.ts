import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  safelist: [
    // Colors
    // Typography
    'text-xs',
    'text-xl',
    'font-bold',
    'text-center',
    'text-white',
    'text-black',
    'text-green-500',
    'text-yellow-500',
    'text-red-500',
    'underline',
    // Backgrounds
    'bg-white',
    'bg-black',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    // Borders
    'rounded',
    'border',
    // Spacing
    'p-1',
    'p-2',
    'px-1',
    'py-1',
    'px-2',
    'py-2',
    'm-1',
    'm-2',
    'mx-1',
    'my-1',
    'mx-2',
    'my-2',
    // Sizing
    // Display
    // Flexbox
    'flex',
    'flex-col',
    'flex-grow',
    // Grid
    'grid',
    // Positioning
    'self-center',
    'place-items-center',
    'absolute',
    'relative',
    // Filters
    'backdrop-filter',
    // Behaviors
    'cursor-default',
    'cursor-pointer',
    'cursor-move',
    'cursor-not-allowed',
  ]
})