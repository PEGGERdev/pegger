export const testScenarios = {
  workflows: {
    'star-map.view': {
      description: 'Project the complete star map view model',
      input: {},
      expected: {
        starCount: 21,
        brightStars: 7,
        dimStars: 14,
        connections: 26,
        typedDimStars: true
      }
    },
    'panel.view': {
      description: 'Project a panel view model from the selected panel id',
      input: { panelId: 'apps' },
      expected: {
        id: 'apps',
        hasItems: true,
        variant: 'default'
      }
    },
    'theme.view': {
      description: 'Expose theme source data and active policies',
      input: {},
      expected: {
        hasColors: true,
        hasAnimations: true,
        hasTypography: true
      }
    }
  },

  actors: {
    'load-source': {
      description: 'Load a full content source into workflow state',
      config: { source: 'starMap', as: 'starMap' },
      expected: { stateKey: 'starMap' }
    },
    'load-record': {
      description: 'Load a single record from a source',
      input: { panelId: 'apps' },
      config: { source: 'panels', inputKey: 'panelId', as: 'panel' },
      expected: { stateKey: 'panel', id: 'apps' }
    },
    'copy-input': {
      description: 'Copy selected workflow input into state',
      input: { panelId: 'skills' },
      config: { inputKey: 'panelId', as: 'selectedPanelId' },
      expected: { stateKey: 'selectedPanelId', value: 'skills' }
    }
  },

  policies: {
    'theme-colors': {
      description: 'Theme color definitions',
      expected: {
        keys: ['primary', 'accent', 'purple', 'orange']
      }
    },
    'animation-settings': {
      description: 'Animation configuration',
      expected: {
        keys: ['magneticRange', 'magneticStrength', 'wobbleDuration']
      }
    }
  },

  projectors: {
    'star-map-view': {
      description: 'Project the star map source into a view model',
      expected: { starCount: 21, brightStars: 7 }
    },
    'panel-view': {
      description: 'Project selected panel data for display',
      expected: { variant: 'default', hasItems: true }
    },
    'theme-view': {
      description: 'Project theme policies and source data',
      expected: { hasColors: true, hasAnimations: true }
    }
  },

  coverage: {
    allStars: [
      { id: 'portfolio', type: 'bright', panel: 'apps' },
      { id: 'spotonsight', type: 'bright', panel: 'apps' },
      { id: 'payqr', type: 'bright', panel: 'apps' },
      { id: 'contact', type: 'bright', panel: 'contact' },
      { id: 'github', type: 'bright', panel: 'socials' },
      { id: 'linkedin', type: 'bright', panel: 'socials' },
      { id: 'dev', type: 'bright', panel: 'private' }
    ],
    allPanels: ['apps', 'contact', 'socials', 'private', 'skills'],
    allVariants: ['default', 'contact', 'social', 'private']
  }
}

export default testScenarios
