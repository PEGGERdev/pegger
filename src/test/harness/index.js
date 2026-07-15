import { starMapData, panelData } from '../../data/starMapData.js'
import theme from '../../config/theme.js'
import { createPeggerRuntime } from '../../runtime/index.js'
import testScenarios from '../data/scenarios.js'

function createContext(input = {}) {
  return {
    input,
    state: {},
    policies: {},
  }
}

export class TestHarness {
  constructor() {
    this.results = []
    this.errors = []
    this.runtime = null
  }

  instantiate() {
    this.runtime = createPeggerRuntime()
    return this
  }

  verifyWorkflow(name, scenario) {
    const result = this.runtime.executeWorkflow(name, scenario.input)
    const output = result.output

    if (name === 'star-map.view') {
      const nodeIds = [output.center?.id, ...output.allStars.map(star => star.id)]
      const nodeIdSet = new Set(nodeIds)
      const clusterMemberIds = output.clusters.flatMap(cluster => cluster.memberIds)
      const uniqueClusterMemberIds = new Set(clusterMemberIds)
      const edgeKeys = new Set(output.connections.map(connection => (
        [connection.from, connection.to].sort().join(':')
      )))
      const validClusters = output.clusters.every(cluster => (
        cluster.memberIds.includes(cluster.anchorId)
        && cluster.memberIds.every(id => nodeIdSet.has(id))
        && theme.clusterTones[cluster.tone]
      ))
      const validConnections = output.connections.every(connection => (
        connection.from !== connection.to
        && nodeIdSet.has(connection.from)
        && nodeIdSet.has(connection.to)
      )) && edgeKeys.size === output.connections.length
      const passed = output.allStars.length === scenario.expected.starCount
        && output.brightStars.length === scenario.expected.brightStars
        && output.dimStars.length === scenario.expected.dimStars
        && output.clusters.length === scenario.expected.clusters
        && clusterMemberIds.length === scenario.expected.clusteredStars
        && uniqueClusterMemberIds.size === scenario.expected.clusteredStars
        && output.allStars.every(star => uniqueClusterMemberIds.has(star.id))
        && output.connections.length === scenario.expected.connections
        && output.dimStars.every(star => star.type === 'dim') === scenario.expected.typedDimStars
        && validClusters === scenario.expected.validClusters
        && validConnections === scenario.expected.validConnections
      this.results.push({
        type: 'workflow',
        name,
        status: passed ? 'success' : 'failed',
      })
      return
    }

    if (name === 'panel.view') {
      const passed = output?.id === scenario.expected.id
        && output?.variant === scenario.expected.variant
        && Array.isArray(output?.items) === scenario.expected.hasItems
      this.results.push({
        type: 'workflow',
        name,
        status: passed ? 'success' : 'failed',
      })
      return
    }

    const passed = Boolean(output?.colors) === scenario.expected.hasColors
      && Boolean(output?.animations) === scenario.expected.hasAnimations
      && Boolean(output?.theme?.typography) === scenario.expected.hasTypography
    this.results.push({
      type: 'workflow',
      name,
      status: passed ? 'success' : 'failed',
    })
  }

  verifyActor(name, scenario) {
    const actor = this.runtime.registry.actors.get(name)
    const context = createContext(scenario.input)
    actor.handler(context, scenario.config)

    const value = context.state[scenario.expected.stateKey]
    const passed = scenario.expected.id
      ? value?.id === scenario.expected.id
      : scenario.expected.value
        ? value === scenario.expected.value
        : value !== undefined

    this.results.push({ type: 'actor', name, status: passed ? 'success' : 'failed' })
  }

  verifyPolicy(name, scenario) {
    const policy = this.runtime.registry.policies.get(name)
    const keys = Object.keys(policy.rules)
    const passed = scenario.expected.keys.every(key => keys.includes(key))

    this.results.push({ type: 'policy', name, status: passed ? 'success' : 'failed' })
  }

  verifyProjector(name, scenario) {
    const projector = this.runtime.registry.projectors.get(name)
    const context = createContext({ panelId: 'apps' })
    context.state.starMap = starMapData
    context.state.panel = panelData.apps
    context.state.theme = theme
    context.policies['theme-colors'] = this.runtime.registry.policies.get('theme-colors')
    context.policies['animation-settings'] = this.runtime.registry.policies.get('animation-settings')

    const output = projector.transform(context)
    let passed = false

    if (name === 'star-map-view') {
      passed = output.allStars.length === scenario.expected.starCount
        && output.brightStars.length === scenario.expected.brightStars
        && output.clusters.length === scenario.expected.clusters
    } else if (name === 'panel-view') {
      passed = output.variant === scenario.expected.variant
        && Array.isArray(output.items) === scenario.expected.hasItems
    } else {
      passed = Boolean(output.colors) === scenario.expected.hasColors
        && Boolean(output.animations) === scenario.expected.hasAnimations
    }

    this.results.push({ type: 'projector', name, status: passed ? 'success' : 'failed' })
  }

  discoverAll() {
    this.results.push({
      type: 'discovery',
      name: 'registry-discovery',
      status: this.runtime.registry.discover().length > 0 ? 'success' : 'failed',
    })

    return this
  }

  run() {
    this.instantiate()

    Object.entries(testScenarios.workflows).forEach(([name, scenario]) => this.verifyWorkflow(name, scenario))
    Object.entries(testScenarios.actors).forEach(([name, scenario]) => this.verifyActor(name, scenario))
    Object.entries(testScenarios.policies).forEach(([name, scenario]) => this.verifyPolicy(name, scenario))
    Object.entries(testScenarios.projectors).forEach(([name, scenario]) => this.verifyProjector(name, scenario))

    this.discoverAll()

    this.errors = this.results.filter(result => result.status === 'failed')

    return {
      passed: this.results.length - this.errors.length,
      failed: this.errors.length,
      total: this.results.length,
      results: this.results,
      errors: this.errors,
      registryState: this.runtime.registry.all(),
    }
  }
}

export function runTests() {
  return new TestHarness().run()
}

export default TestHarness
