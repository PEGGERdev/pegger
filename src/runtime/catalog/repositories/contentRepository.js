import { panelData, starMapData } from '../../../data/starMapData.js'
import theme from '../../../config/theme.js'

const sources = {
  panels: panelData,
  starMap: starMapData,
  theme,
}

export function getSource(sourceName) {
  return sources[sourceName] ?? null
}

export function getRecord(sourceName, recordId) {
  const source = getSource(sourceName)

  if (!source || typeof source !== 'object') {
    return null
  }

  return source[recordId] ?? null
}

export function listSourceKeys(sourceName) {
  const source = getSource(sourceName)

  if (!source || typeof source !== 'object') {
    return []
  }

  return Object.keys(source)
}

export default {
  getRecord,
  getSource,
  listSourceKeys,
}
