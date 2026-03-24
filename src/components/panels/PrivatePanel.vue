<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="private-panel">
    <p class="private-panel__description">{{ data.description }}</p>
    
    <div class="private-panel__items">
      <a
        v-for="item in data.items"
        :key="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="private-card"
      >
        <div class="private-card__icon">
          <i :class="item.icon" />
          <span v-if="item.badge" class="private-card__badge">{{ item.badge }}</span>
        </div>
        <div class="private-card__content">
          <h3 class="private-card__name">{{ item.name }}</h3>
          <p class="private-card__note">{{ item.note }}</p>
        </div>
        <div class="private-card__arrow">
          <i class="bi bi-lock-fill" />
        </div>
      </a>
    </div>

    <div class="private-panel__warning">
      <i class="bi bi-shield-lock" />
      <span>Access restricted. Authentication required.</span>
    </div>
  </div>
</template>

<style scoped>
.private-panel__description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.private-panel__items {
  display: grid;
  gap: 0.75rem;
}

.private-card {
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

.private-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(234, 88, 12, 0.4);
}

.private-card__icon {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--pegger-orange, #ea580c), #c2410c);
  border-radius: 0.6rem;
  font-size: 1.25rem;
  color: #fff;
}

.private-card__badge {
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 2px 6px;
  font-size: 0.6rem;
  font-weight: 700;
  background: #fff;
  color: var(--pegger-orange, #ea580c);
  border-radius: 4px;
}

.private-card__content {
  display: grid;
  gap: 0.25rem;
  align-content: center;
}

.private-card__name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.private-card__note {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.private-card__arrow {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  transition: color 200ms ease;
}

.private-card:hover .private-card__arrow {
  color: var(--pegger-orange, #ea580c);
}

.private-panel__warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background: rgba(234, 88, 12, 0.1);
  border: 1px solid rgba(234, 88, 12, 0.2);
  border-radius: 0.6rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.private-panel__warning i {
  color: var(--pegger-orange, #ea580c);
}
</style>
