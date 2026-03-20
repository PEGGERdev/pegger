<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="contact-panel">
    <div class="contact-panel__items">
      <a
        v-for="item in data.items"
        :key="item.label"
        :href="item.action"
        class="contact-item"
      >
        <div class="contact-item__icon">
          <i :class="item.icon" />
        </div>
        <div class="contact-item__content">
          <span class="contact-item__label">{{ item.label }}</span>
          <span class="contact-item__value">{{ item.value }}</span>
        </div>
        <div class="contact-item__action">
          <i class="bi bi-send" />
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.contact-panel__items {
  display: grid;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.8rem;
  text-decoration: none;
  color: inherit;
  transition: transform 200ms ease, background 200ms ease, border-color 200ms ease;
}

.contact-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(47, 110, 168, 0.4);
}

.contact-item__icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--peggar-accent, #2f6ea8), #1e4a6e);
  border-radius: 0.6rem;
  font-size: 1.1rem;
  color: #fff;
}

.contact-item__content {
  flex: 1;
  display: grid;
  gap: 0.15rem;
}

.contact-item__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-item__value {
  font-size: 1rem;
  color: #fff;
}

.contact-item__action {
  color: rgba(255, 255, 255, 0.4);
  transition: color 200ms ease, transform 200ms ease;
}

.contact-item:hover .contact-item__action {
  color: var(--peggar-accent, #2f6ea8);
  transform: translateX(2px);
}
</style>
