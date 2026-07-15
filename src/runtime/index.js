import actorCatalog from './catalog/actors.js'
import policyCatalog from './catalog/policies.js'
import projectorCatalog from './catalog/projectors.js'
import workflowCatalog from './catalog/workflows.js'

class PeggerRegistry {
  constructor() {
    this.reset()
  }

  reset() {
    this.actors = new Map()
    this.policies = new Map()
    this.projectors = new Map()
    this.workflows = new Map()
  }

  registerActor(definition) {
    this.actors.set(definition.name, definition)
    return definition
  }

  registerPolicy(definition) {
    this.policies.set(definition.name, definition)
    return definition
  }

  registerProjector(definition) {
    this.projectors.set(definition.name, definition)
    return definition
  }

  registerWorkflow(definition) {
    this.workflows.set(definition.name, definition)
    return definition
  }

  discover() {
    return [
      ...Array.from(this.actors.values(), item => ({ type: 'actor', name: item.name, ...item.metadata })),
      ...Array.from(this.policies.values(), item => ({ type: 'policy', name: item.name, ...item.metadata })),
      ...Array.from(this.projectors.values(), item => ({ type: 'projector', name: item.name, ...item.metadata })),
      ...Array.from(this.workflows.values(), item => ({ type: 'workflow', name: item.name, ...item.metadata })),
    ]
  }

  all() {
    return {
      actors: Array.from(this.actors.values()),
      policies: Array.from(this.policies.values()),
      projectors: Array.from(this.projectors.values()),
      workflows: Array.from(this.workflows.values()),
    }
  }
}

export function createRegistry() {
  return new PeggerRegistry()
}

export function bootstrapRegistry(registry = createRegistry()) {
  registry.reset()
  actorCatalog.forEach(definition => registry.registerActor(definition))
  policyCatalog.forEach(definition => registry.registerPolicy(definition))
  projectorCatalog.forEach(definition => registry.registerProjector(definition))
  workflowCatalog.forEach(definition => registry.registerWorkflow(definition))
  return registry
}

export function createPeggerRuntime() {
  const registry = bootstrapRegistry()

  function executeWorkflow(workflowName, input = {}) {
    const workflow = registry.workflows.get(workflowName)

    if (!workflow) {
      throw new Error(`Unknown workflow: ${workflowName}`)
    }

    const context = {
      input,
      state: {},
      policies: {},
      workflow,
    }

    let output = null

    workflow.pipeline.forEach(step => {
      if (step.actor) {
        const actor = registry.actors.get(step.actor)

        if (!actor) {
          throw new Error(`Unknown actor: ${step.actor}`)
        }

        actor.handler(context, step.config || {})
        return
      }

      if (step.policy) {
        const policy = registry.policies.get(step.policy)

        if (!policy) {
          throw new Error(`Unknown policy: ${step.policy}`)
        }

        context.policies[policy.name] = policy
        return
      }

      if (step.projector) {
        const projector = registry.projectors.get(step.projector)

        if (!projector) {
          throw new Error(`Unknown projector: ${step.projector}`)
        }

        output = projector.transform(context, step.config || {})
      }
    })

    return {
      context,
      output,
      workflow,
    }
  }

  return {
    executeWorkflow,
    getPanelView(panelId) {
      return executeWorkflow('panel.view', { panelId }).output
    },
    getStarMapView() {
      return executeWorkflow('star-map.view').output
    },
    getThemeView() {
      return executeWorkflow('theme.view').output
    },
    registry,
  }
}

export default createPeggerRuntime
