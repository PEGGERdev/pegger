<script setup>
defineProps({
  data: {
    type:     Object,
    required: true,
  },
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
        <!-- Icon -->
        <div class="app-card__icon" aria-hidden="true">
          <i :class="item.icon" />
        </div>

        <!-- Content -->
        <div class="app-card__content">
          <h3 class="app-card__name">{{ item.name }}</h3>
          <p class="app-card__description">{{ item.description }}</p>
          <div class="app-card__tech" aria-label="Technologies used">
            <span
              v-for="tech in item.tech"
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Arrow -->
        <div class="app-card__arrow" aria-hidden="true">
          <i class="bi bi-arrow-up-right" />
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.apps-panel__items {
  display: grid;
  gap: 0.75rem;
}

/* ── Card ── */
.app-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 0.9rem;
  text-decoration: none;
  color: inherit;
  transition:
    transform      200ms ease,
    background     200ms ease,
    border-color   200ms ease,
    box-shadow     200ms ease;
}

.app-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.085);
  border-color: rgba(var(--pegger-primary-rgb), 0.38);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}

.app-card:focus-visible {
  outline: 2px solid var(--pegger-primary);
  outline-offset: 2px;
}

/* ── Icon ── */
.app-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--pegger-primary, #1f7c72),
    var(--pegger-accent, #2f6ea8)
  );
  border-radius: 0.65rem;
  font-size: 1.22rem;
  color: #fff;
  flex-shrink: 0;
  transition: transform 200ms ease;
}

.app-card:hover .app-card__icon {
  transform: scale(1.06) rotate(-2deg);
}

/* ── Content ── */
.app-card__content {
  min-width: 0;
}

.app-card__name {
  font-family: var(--pegger-font-display);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.22rem;
  letter-spacing: -0.01em;
}

.app-card__description {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.62);
  margin: 0 0 0.55rem;
  line-height: 1.45;
}

/* ── Tech tags ── */
.app-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.tech-tag {
  padding: 0.18rem 0.52rem;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: rgba(var(--pegger-primary-rgb), 0.18);
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(var(--pegger-primary-rgb), 0.22);
  border-radius: 999px;
  transition: background 150ms ease;
}

.app-card:hover .tech-tag {
  background: rgba(var(--pegger-primary-rgb), 0.26);
}

/* ── Arrow ── */
.app-card__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 1rem;
  transition: color 200ms ease, transform 200ms ease;
  flex-shrink: 0;
}

.app-card:hover .app-card__arrow {
  color: var(--pegger-primary, #1f7c72);
  transform: translate(2px, -2px);
}
</style>
