import contentRepository from './repositories/contentRepository.js'

function getInputValue(context, config = {}) {
  if (Object.hasOwn(config, 'value')) {
    return config.value
  }

  if (config.inputKey) {
    return context.input?.[config.inputKey]
  }

  if (config.from) {
    return context.state[config.from]
  }

  return null
}

export const actorCatalog = [
  {
    name: 'load-source',
    metadata: { capability: 'load', domain: 'content' },
    handler(context, config) {
      context.state[config.as || config.source] = contentRepository.getSource(config.source)
      return context
    },
  },
  {
    name: 'load-record',
    metadata: { capability: 'load', domain: 'content' },
    handler(context, config) {
      const recordId = getInputValue(context, config)
      context.state[config.as || config.source] = contentRepository.getRecord(config.source, recordId)
      return context
    },
  },
  {
    name: 'copy-input',
    metadata: { capability: 'normalize', domain: 'workflow' },
    handler(context, config) {
      context.state[config.as] = getInputValue(context, config)
      return context
    },
  },
]

export default actorCatalog
