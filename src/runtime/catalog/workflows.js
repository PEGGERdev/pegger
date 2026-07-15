export const workflowCatalog = [
  {
    name: 'star-map.view',
    metadata: { intent: 'Present the star map' },
    pipeline: [
      { actor: 'load-source', config: { source: 'starMap', as: 'starMap' } },
      { projector: 'star-map-view' },
    ],
  },
  {
    name: 'panel.view',
    metadata: { intent: 'Present a selected panel' },
    pipeline: [
      { actor: 'load-record', config: { source: 'panels', inputKey: 'panelId', as: 'panel' } },
      { projector: 'panel-view' },
    ],
  },
  {
    name: 'theme.view',
    metadata: { intent: 'Expose theme policies to the UI' },
    pipeline: [
      { actor: 'load-source', config: { source: 'theme', as: 'theme' } },
      { policy: 'theme-colors' },
      { policy: 'animation-settings' },
      { projector: 'theme-view' },
    ],
  },
]

export default workflowCatalog
