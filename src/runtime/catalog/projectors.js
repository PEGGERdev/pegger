export const projectorCatalog = [
  {
    name: 'star-map-view',
    metadata: { output: 'view-model', input: 'starMap' },
    transform(context) {
      const starMap = context.state.starMap
      const brightStars = starMap?.brightStars || []
      const dimStars = starMap?.dimStars || []

      return {
        center: starMap?.center || null,
        brightStars,
        dimStars,
        clusters: starMap?.clusters || [],
        connections: starMap?.connections || [],
        allStars: [...brightStars, ...dimStars],
      }
    },
  },
  {
    name: 'panel-view',
    metadata: { output: 'view-model', input: 'panels' },
    transform(context) {
      const panel = context.state.panel

      if (!panel) {
        return null
      }

      return {
        ...panel,
        variant: panel.type || 'default',
      }
    },
  },
  {
    name: 'theme-view',
    metadata: { output: 'view-model', input: 'theme' },
    transform(context) {
      return {
        theme: context.state.theme,
        colors: context.policies['theme-colors']?.rules || {},
        animations: context.policies['animation-settings']?.rules || {},
      }
    },
  },
]

export default projectorCatalog
