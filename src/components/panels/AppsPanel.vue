<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="apps-panel">
    <div class="apps-panel__items">
      <a
        v-for="item in data.items"
        :key="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="app-card"
      >
        <div class="app-card__icon">
          <i :class="item.icon" />
        </div>
        <div class="app-card__content">
          <h3 class="app-card__name">{{ item.name }}</h3>
          <p class="app-card__description">{{ item.description }}</p>
          <div class="app-card__tech">
            <span v-for="tech in item.tech" :key="tech" class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </div>
        <div class="app-card__arrow">
          <i class="bi bi-arrow-up-right" />
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.apps-panel__items {
  display: grid;
  gap: 1rem;
}

.app-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.8rem;
  text-decoration: none;
  color: inherit;
  transition: transform 200ms ease, background 200ms ease, border-color 200ms ease;
}

.app-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(31, 124, 114, 0.4);
}

.app-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--peggar-primary, #1f7c72), var(--peggar-accent, #2f6ea8));
  border-radius: 0.6rem;
  font-size: 1.25rem;
  color: #fff;
}

.app-card__content {
  min-width: 0;
}

.app-card__name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.25rem 0;
}

.app-card__description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.app-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tech-tag {
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.8);
}

.app-card__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: color 200ms ease, transform 200ms ease;
}

.app-card:hover .app-card__arrow {
  color: var(--peggar-primary, #1f7c72);
  transform: translate(2px, -2px);
}
</style>
