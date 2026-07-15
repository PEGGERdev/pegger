<script setup>
import { computed } from 'vue'
import theme from '@/config/theme'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'contact', 'social', 'private'].includes(v)
  }
})

const emit = defineEmits(['click'])

const cardClasses = computed(() => {
  return [
    'item-card',
    `item-card--${props.variant}`
  ]
})

const iconStyle = computed(() => {
  const colors = {
    default: theme.colors.primary,
    contact: theme.colors.accent,
    social: theme.colors.purple,
    private: theme.colors.orange
  }
  return {
    background: `linear-gradient(135deg, ${colors[props.variant]}, ${colors[props.variant]}dd)`
  }
})

const hoverBorderColor = computed(() => {
  const colors = {
    default: 'rgba(31, 124, 114, 0.4)',
    contact: 'rgba(47, 110, 168, 0.4)',
    social: 'rgba(124, 58, 237, 0.4)',
    private: 'rgba(234, 88, 12, 0.4)'
  }
  return colors[props.variant]
})

const actionColor = computed(() => {
  const colors = {
    default: theme.colors.primary,
    contact: theme.colors.accent,
    social: theme.colors.purple,
    private: theme.colors.orange
  }
  return colors[props.variant]
})

const hasLink = computed(() => !!props.item.url)
const hasAction = computed(() => !!props.item.action)

function handleClick() {
  if (hasLink.value || hasAction.value) {
    return
  }
  emit('click', props.item)
}

function getIconComponent() {
  return props.item.icon
}
</script>

<template>
  <a
    v-if="hasLink"
    :href="item.url"
    :target="item.url.startsWith('http') ? '_blank' : undefined"
    :rel="item.url.startsWith('http') ? 'noopener noreferrer' : undefined"
    :class="cardClasses"
  >
    <div class="item-card__icon" :style="iconStyle">
      <i :class="getIconComponent()" />
      <span v-if="item.badge" class="item-card__badge">{{ item.badge }}</span>
    </div>

    <div class="item-card__content">
      <h3 class="item-card__name">{{ item.name || item.label }}</h3>
      <p v-if="item.description" class="item-card__description">{{ item.description }}</p>
      <p v-else-if="item.value" class="item-card__value">{{ item.value }}</p>
      <p v-else-if="item.note" class="item-card__note">{{ item.note }}</p>

      <div v-if="item.tech" class="item-card__tech">
        <span v-for="tech in item.tech" :key="tech" class="tech-tag">
          {{ tech }}
        </span>
      </div>
    </div>

    <div class="item-card__action">
      <i v-if="hasLink" class="bi bi-arrow-up-right" />
      <i v-else-if="item.action" class="bi bi-send" />
      <i v-else class="bi bi-lock-fill" />
    </div>
  </a>

  <a
    v-else-if="hasAction"
    :href="item.action"
    :class="cardClasses"
    @click="handleClick"
  >
    <div class="item-card__icon" :style="iconStyle">
      <i :class="getIconComponent()" />
    </div>

    <div class="item-card__content">
      <span class="item-card__label">{{ item.label }}</span>
      <span class="item-card__value">{{ item.value }}</span>
    </div>

    <div class="item-card__action">
      <i class="bi bi-send" />
    </div>
  </a>

  <button
    v-else
    :class="cardClasses"
    @click="handleClick"
  >
    <div class="item-card__icon" :style="iconStyle">
      <i :class="getIconComponent()" />
      <span v-if="item.badge" class="item-card__badge">{{ item.badge }}</span>
    </div>

    <div class="item-card__content">
      <h3 class="item-card__name">{{ item.name }}</h3>
      <p v-if="item.note" class="item-card__note">{{ item.note }}</p>
    </div>

    <div class="item-card__action">
      <i class="bi bi-arrow-right" />
    </div>
  </button>
</template>

<style scoped>
.item-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.8rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 200ms ease, background 200ms ease, border-color 200ms ease;
  width: 100%;
  text-align: left;
  font-family: inherit;
}

.item-card:hover,
.item-card:focus-visible {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: v-bind(hoverBorderColor);
}

.item-card__icon {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.6rem;
  font-size: 1.25rem;
  color: #fff;
  flex-shrink: 0;
}

.item-card__badge {
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

.item-card__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.item-card__name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.item-card__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-card__value {
  font-size: 1rem;
  color: #fff;
  margin: 0;
}

.item-card__description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
}

.item-card__note {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.item-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.tech-tag {
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.8);
}

.item-card__action {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: color 200ms ease, transform 200ms ease;
}

.item-card:hover .item-card__action,
.item-card:focus-visible .item-card__action {
  color: v-bind(actionColor);
  transform: translateX(2px);
}

.item-card:hover .item-card__action {
  color: v-bind(actionColor);
  transform: translate(2px, -2px);
}

.item-card--contact .item-card__content {
  display: grid;
  gap: 0.15rem;
}

.item-card--private .item-card__warning {
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

.item-card--private .item-card__warning i {
  color: var(--pegger-orange, #ea580c);
}
</style>
