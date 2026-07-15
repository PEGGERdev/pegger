import theme from '../../config/theme.js'

export const policyCatalog = [
  {
    name: 'theme-colors',
    metadata: { domain: 'theme', category: 'colors' },
    rules: {
      primary: theme.colors.primary,
      primaryRgb: theme.colors.primaryRgb,
      accent: theme.colors.accent,
      accentRgb: theme.colors.accentRgb,
      purple: theme.colors.purple,
      purpleRgb: theme.colors.purpleRgb,
      orange: theme.colors.orange,
      orangeRgb: theme.colors.orangeRgb,
      background: theme.colors.background,
      backgroundDeep: theme.colors.backgroundDeep,
    },
  },
  {
    name: 'animation-settings',
    metadata: { domain: 'theme', category: 'animations' },
    rules: {
      magneticRange: theme.animations.magneticRange,
      magneticStrength: theme.animations.magneticStrength,
      wobbleDuration: theme.animations.wobbleDuration,
      expansionDuration: theme.animations.expansionDuration,
      transitionDuration: theme.animations.transitionDuration,
    },
  },
]

export default policyCatalog
