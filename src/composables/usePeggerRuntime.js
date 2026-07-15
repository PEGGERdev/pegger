import { computed } from 'vue'
import { createPeggerRuntime } from '@/runtime/index.js'

const runtime = createPeggerRuntime()

export function usePeggerRuntime() {
  const starMapView = computed(() => runtime.getStarMapView())
  const themeView = computed(() => runtime.getThemeView())

  function getPanelView(panelId) {
    return runtime.getPanelView(panelId)
  }

  return {
    getPanelView,
    runtime,
    starMapView,
    themeView,
  }
}

export default usePeggerRuntime
