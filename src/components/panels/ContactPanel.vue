<script setup>
defineProps({
  data: {
    type:     Object,
    required: true,
  },
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
        <div class="contact-item__icon" aria-hidden="true">
          <i :class="item.icon" />
        </div>

        <div class="contact-item__content">
          <span class="contact-item__label">{{ item.label }}</span>
          <span class="contact-item__value">{{ item.value }}</span>
        </div>

        <div class="contact-item__action" aria-hidden="true">
          <i class="bi bi-send-fill" />
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
  padding: 1.1rem 1.25rem;
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

.contact-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.085);
  border-color: rgba(var(--pegger-accent-rgb), 0.42);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}

.contact-item:focus-visible {
  outline: 2px solid var(--pegger-accent);
  outline-offset: 2px;
}

/* ── Icon ── */
.contact-item__icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--pegger-accent, #2f6ea8),
    #1b4a72
  );
  border-radius: 0.65rem;
  font-size: 1.1rem;
  color: #fff;
  flex-shrink: 0;
  transition: transform 200ms ease;
}

.contact-item:hover .contact-item__icon {
  transform: scale(1.06) rotate(-2deg);
}

/* ── Content ── */
.contact-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.14rem;
  min-width: 0;
}

.contact-item__label {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.contact-item__value {
  font-size: 0.96rem;
  font-weight: 500;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Action ── */
.contact-item__action {
  color: rgba(255, 255, 255, 0.28);
  font-size: 0.9rem;
  transition: color 200ms ease, transform 200ms ease;
  flex-shrink: 0;
}

.contact-item:hover .contact-item__action {
  color: var(--pegger-accent, #2f6ea8);
  transform: translateX(3px) translateY(-1px);
}
</style>
