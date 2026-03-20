<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
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
        <div class="social-card__icon">
          <i :class="item.icon" />
        </div>
        <div class="social-card__content">
          <h3 class="social-card__name">{{ item.name }}</h3>
          <p class="social-card__description">{{ item.description }}</p>
        </div>
        <div class="social-card__link">
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
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.8rem;
  text-decoration: none;
  color: inherit;
  transition: transform 200ms ease, background 200ms ease, border-color 200ms ease;
}

.social-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(124, 58, 237, 0.4);
}

.social-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--peggar-purple, #7c3aed), #5b21b6);
  border-radius: 0.6rem;
  font-size: 1.25rem;
  color: #fff;
}

.social-card__content {
  display: grid;
  gap: 0.25rem;
  align-content: center;
}

.social-card__name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.social-card__description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.social-card__link {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  transition: color 200ms ease;
}

.social-card:hover .social-card__link {
  color: var(--peggar-purple, #7c3aed);
}
</style>
