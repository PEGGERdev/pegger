import { ref, computed } from 'vue'
import { starMapData } from '@/data/starMapData'

export function useStarExpansion() {
  const activeStarId = ref(null)

  const activePanelId = computed(() => {
    if (!activeStarId.value) return null
    const allStars = [...starMapData.brightStars, ...starMapData.dimStars]
    const star = allStars.find(s => s.id === activeStarId.value)
    return star?.panel ?? null
  })

  const isExpanded = computed(() => activeStarId.value !== null)

  function openExpansion(starId) {
    if (activeStarId.value === starId) {
      closeExpansion()
    } else {
      activeStarId.value = starId
    }
  }

  function closeExpansion() {
    activeStarId.value = null
  }

  return {
    activeStarId,
    activePanelId,
    isExpanded,
    openExpansion,
    closeExpansion,
  }
}
