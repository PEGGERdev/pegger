<script setup>
defineProps({
  data: {
    type:     Object,
    required: true,
  },
})
</script>

<template>
  <div class="private-panel">
    <p v-if="data.description" class="private-panel__description">
      {{ data.description }}
    </p>

    <div class="private-panel__items">
      <a
        v-for="item in data.items"
        :key="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="private-card"
      >
        <!-- Icon + badge -->
        <div class="private-card__icon" aria-hidden="true">
          <i :class="item.icon" />
          <span v-if="item.badge" class="private-card__badge">
            {{ item.badge }}
          </span>
        </div>

        <!-- Content -->
        <div class="private-card__content">
          <h3 class="private-card__name">{{ item.name }}</h3>
          <p v-if="item.note" class="private-card__note">{{ item.note }}</p>
        </div>

        <!-- Lock icon -->
        <div class="private-card__lock" aria-hidden="true">
          <i class="bi bi-box-arrow-up-right" />
        </div>
      </a>
    </div>

    <!-- Auth notice -->
    <div class="private-panel__warning" role="note">
      <i class="bi bi-shield-lock-fill" aria-hidden="true" />
      <span>Access restricted — authentication required.</span>
    </div>
  </div>
</template>

<style scoped>
/* ── Description ── */
.private-panel__description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 1.25rem;
  line-height: 1.55;
}

/* ── Items ── */
.private-panel__items {
  display: grid;
  gap: 0.75rem;
}

/* ── Card ── */
.private-card {
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

.private-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.085);
  border-color: rgba(var(--pegger-orange-rgb), 0.42);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}

.private-card:focus-visible {
  outline: 2px solid var(--pegger-orange);
  outline-offset: 2px;
}

/* ── Icon ── */
.private-card__icon {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--pegger-orange, #ea580c),
    #9a3412
  );
  border-radius: 0.65rem;
  font-size: 1.22rem;
  color: #fff;
  flex-shrink: 0;
  transition: transform 200ms ease;
}

.private-card:hover .private-card__icon {
  transform: scale(1.06) rotate(-2deg);
}

.private-card__badge {
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 2px 7px;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: #fff;
  color: var(--pegger-orange, #ea580c);
  border-radius: 4px;
  line-height: 1.4;
}

/* ── Content ── */
.private-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  min-width: 0;
}

.private-card__name {
  font-family: var(--pegger-font-display);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.01em;
}

.private-card__note {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.46);
  margin: 0;
}

/* ── Arrow / lock ── */
.private-card__lock {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.28);
  font-size: 0.9rem;
  transition: color 200ms ease, transform 200ms ease;
  flex-shrink: 0;
}

.private-card:hover .private-card__lock {
  color: var(--pegger-orange, #ea580c);
  transform: translate(2px, -2px);
}

/* ── Warning banner ── */
.private-panel__warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 0.72rem 1rem;
  background: rgba(var(--pegger-orange-rgb), 0.09);
  border: 1px solid rgba(var(--pegger-orange-rgb), 0.22);
  border-radius: 0.65rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
}

.private-panel__warning i {
  color: var(--pegger-orange, #ea580c);
  font-size: 0.9rem;
  flex-shrink: 0;
}
</style>
