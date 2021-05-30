import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  safelist: [
    // Colors
    // Typography
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
    // Borders
    'rounded',
    'border',
    // Spacing
    'p-1',
    'p-2',
    'px-1',
    'py-1',
    // Sizing
    // Display
    // Flexbox
    'flex',
    'flex-col',
    'flex-grow',
    // Grid
    'grid',
    // Positioning
    'place-items-center',
    'absolute',
    'relative',
    // Behaviors
    'cursor-default',
    'cursor-pointer',
    'cursor-move',
    'cursor-not-allowed',
  ]
})
