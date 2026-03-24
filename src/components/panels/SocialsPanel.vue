<script setup>
defineProps({
  data: {
    type:     Object,
    required: true,
  },
})
</script>

<template>
  <div class="socials-panel">
    <div class="socials-panel__items">
      <a
        v-for="item in data.items"
        :key="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-card"
      >
        <div class="social-card__icon" aria-hidden="true">
          <i :class="item.icon" />
        </div>

        <div class="social-card__content">
          <h3 class="social-card__name">{{ item.name }}</h3>
          <p class="social-card__description">{{ item.description }}</p>
        </div>

        <div class="social-card__link" aria-hidden="true">
          <i class="bi bi-box-arrow-up-right" />
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.socials-panel__items {
  display: grid;
  gap: 0.75rem;
}

.social-card {
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
    transform    200ms ease,
    background   200ms ease,
    border-color 200ms ease,
    box-shadow   200ms ease;
}

.social-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.085);
  border-color: rgba(var(--pegger-purple-rgb), 0.42);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}

.social-card:focus-visible {
  outline: 2px solid var(--pegger-purple);
  outline-offset: 2px;
}

/* ── Icon ── */
.social-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--pegger-purple, #7c3aed),
    #4c1d95
  );
  border-radius: 0.65rem;
  font-size: 1.25rem;
  color: #fff;
  flex-shrink: 0;
  transition: transform 200ms ease;
}

.social-card:hover .social-card__icon {
  transform: scale(1.06) rotate(-2deg);
}

/* ── Content ── */
.social-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  min-width: 0;
}

.social-card__name {
  font-family: var(--pegger-font-display);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.01em;
}

.social-card__description {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.58);
  margin: 0;
  line-height: 1.45;
}

/* ── Link arrow ── */
.social-card__link {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.28);
  font-size: 0.9rem;
  transition: color 200ms ease, transform 200ms ease;
  flex-shrink: 0;
}

.social-card:hover .social-card__link {
  color: var(--pegger-purple, #7c3aed);
  transform: translate(2px, -2px);
}
</style>
