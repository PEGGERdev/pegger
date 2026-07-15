export { bootstrapRegistry as bootstrap, createPeggerRuntime, createRegistry } from '@/runtime/index.js'

import { bootstrapRegistry, createRegistry } from '@/runtime/index.js'

export const registry = bootstrapRegistry(createRegistry())

export default registry
