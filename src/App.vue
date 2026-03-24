<script setup>
import { computed } from 'vue'
import StarMap    from './components/StarMap.vue'
import StarField  from './components/StarField.vue'
import StarPanel  from './components/StarPanel.vue'
import { useStarExpansion } from './composables/useStarExpansion'
import { panelData } from './data/starMapData'

const { activeStarId, activePanelId, isExpanded, openExpansion, closeExpansion } =
  useStarExpansion()

function scrollToNav() {
  document.getElementById('nav-section')?.scrollIntoView({ behavior: 'smooth' })
}

const navSections = computed(() => ({
  apps:    panelData.apps,
  socials: panelData.socials,
  contact: panelData.contact,
  private: panelData.private,
}))
</script>

<template>
  <div class="app-shell">
    <div class="orb orb--one" aria-hidden="true" />
    <div class="orb orb--two" aria-hidden="true" />
    <div class="orb orb--three" aria-hidden="true" />

    <StarField />

    <!-- Hero constellation -->
    <section class="hero" aria-label="Interaktive Konstellation">
      <StarMap
        :active-star-id="activeStarId"
        @star-click="openExpansion"
      />

      <button
        class="scroll-hint"
        aria-label="Nach unten scrollen"
        @click="scrollToNav"
      >
        <span class="scroll-hint__text">Entdecken</span>
        <i class="bi bi-chevron-down scroll-hint__icon" aria-hidden="true" />
      </button>
    </section>

    <!-- Text navigation / scroll section -->
    <section id="nav-section" class="nav-section" aria-label="Navigation">
      <div class="nav-section__inner">

        <div class="nav-intro">
          <h2 class="nav-intro__title">Hallo, ich bin Patrik.</h2>
          <p class="nav-intro__text">
            Junior Full-Stack Developer aus der Schweiz. Ich baue Webapps,
            experimentiere mit neuen Technologien und schreibe sauberen Code.
          </p>
        </div>

        <div
          v-for="(section, key) in navSections"
          :key="key"
          class="nav-group"
        >
          <h3 class="nav-group__title">
            <i :class="section.icon" aria-hidden="true" />
            {{ section.title }}
          </h3>
          <div class="nav-group__items">
            <a
              v-for="item in section.items"
              :key="item.name ?? item.label ?? item.value"
              :href="item.url ?? item.action ?? '#'"
              :target="item.url ? '_blank' : undefined"
              :rel="item.url ? 'noopener noreferrer' : undefined"
              class="nav-item"
            >
              <span class="nav-item__name">{{ item.name ?? item.label ?? item.value }}</span>
              <span v-if="item.description" class="nav-item__desc">{{ item.description }}</span>
              <span v-if="item.tech" class="nav-item__tech">{{ item.tech.join(' · ') }}</span>
              <i class="bi bi-arrow-up-right nav-item__arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Skills -->
        <div class="nav-group">
          <h3 class="nav-group__title">
            <i class="bi bi-code-slash" aria-hidden="true" />
            Tech Stack
          </h3>
          <div class="nav-skills">
            <div
              v-for="cat in panelData.skills.items"
              :key="cat.category"
              class="nav-skills__cat"
            >
              <span class="nav-skills__cat-name">{{ cat.category }}</span>
              <div class="nav-skills__tags">
                <span v-for="tag in cat.items" :key="tag" class="nav-skills__tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer class="nav-footer">
          <span>© {{ new Date().getFullYear() }} Patrik Egger</span>
          <span class="nav-footer__sep">·</span>
          <a href="mailto:patrik.egger@email.ch">patrik.egger@email.ch</a>
        </footer>
      </div>
    </section>

    <!-- Detail panel -->
    <StarPanel
      v-if="isExpanded && activePanelId"
      :panel-id="activePanelId"
      @close="closeExpansion"
    />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  position: relative;
}

/* ── Hero ── */
.hero {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── Scroll hint ── */
.scroll-hint {
  position: absolute;
  bottom: 2.2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.28rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255, 0.38);
  font-family: var(--pegger-font-body);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 200ms ease;
  animation: scrollBob 2.5s ease-in-out infinite;
}

.scroll-hint:hover { color: rgba(255,255,255, 0.75); }
.scroll-hint__text { font-size: 0.66rem; }
.scroll-hint__icon { font-size: 1.05rem; }

@keyframes scrollBob {
  0%,100% { transform: translateX(-50%) translateY(0); }
  50%     { transform: translateX(-50%) translateY(6px); }
}

/* ── Nav section ── */
.nav-section {
  position: relative;
  z-index: 2;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgba(10,10,18, 0.96) 70px,
    var(--pegger-bg-deep, #0a0a12) 180px
  );
  padding: 5rem 1.5rem 5rem;
}

.nav-section__inner {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

/* ── Intro ── */
.nav-intro__title {
  font-size: clamp(1.65rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
}

.nav-intro__text {
  font-size: 1.05rem;
  color: rgba(255,255,255, 0.6);
  line-height: 1.72;
  margin: 0;
  max-width: 520px;
}

/* ── Nav groups ── */
.nav-group__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--pegger-font-display);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--pegger-primary);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin: 0 0 1rem;
}

.nav-group__items { display: grid; gap: 0.55rem; }

/* ── Nav item ── */
.nav-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto auto;
  gap: 0.18rem 0.75rem;
  align-items: start;
  padding: 1rem 1.1rem;
  background: rgba(255,255,255, 0.038);
  border: 1px solid rgba(255,255,255, 0.07);
  border-radius: 0.85rem;
  text-decoration: none;
  color: inherit;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.nav-item:hover {
  background: rgba(255,255,255, 0.068);
  border-color: rgba(31,124,114, 0.35);
  transform: translateX(4px);
}

.nav-item:focus-visible {
  outline: 2px solid var(--pegger-primary);
  outline-offset: 2px;
}

.nav-item__name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  grid-column: 1; grid-row: 1;
}

.nav-item__desc {
  font-size: 0.81rem;
  color: rgba(255,255,255, 0.52);
  grid-column: 1; grid-row: 2;
  line-height: 1.45;
}

.nav-item__tech {
  font-size: 0.71rem;
  color: rgba(31,124,114, 0.9);
  font-weight: 600;
  grid-column: 1; grid-row: 3;
  margin-top: 0.28rem;
}

.nav-item__arrow {
  grid-column: 2; grid-row: 1;
  color: rgba(255,255,255, 0.28);
  font-size: 0.85rem;
  transition: color 180ms ease, transform 180ms ease;
  align-self: center;
}

.nav-item:hover .nav-item__arrow {
  color: var(--pegger-primary);
  transform: translate(2px,-2px);
}

/* ── Skills ── */
.nav-skills { display: grid; gap: 0.85rem; }

.nav-skills__cat {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
}

.nav-skills__cat-name {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255,255,255, 0.36);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  width: 82px;
  flex-shrink: 0;
}

.nav-skills__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.32rem;
}

.nav-skills__tag {
  padding: 0.2rem 0.6rem;
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(31,124,114, 0.13);
  border: 1px solid rgba(31,124,114, 0.22);
  border-radius: 999px;
  color: rgba(255,255,255, 0.76);
  transition: background 140ms ease;
}

.nav-skills__tag:hover { background: rgba(31,124,114, 0.25); }

/* ── Footer ── */
.nav-footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  color: rgba(255,255,255, 0.28);
  padding-top: 1.4rem;
  border-top: 1px solid rgba(255,255,255, 0.07);
}

.nav-footer a {
  color: rgba(255,255,255, 0.42);
  text-decoration: none;
  transition: color 140ms ease;
}

.nav-footer a:hover { color: var(--pegger-primary); }
.nav-footer__sep    { opacity: 0.4; }
</style>
