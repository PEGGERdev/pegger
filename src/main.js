import { createApp } from 'vue'
import AOS from 'aos'
import '@fontsource/plus-jakarta-sans/latin-400.css'
import '@fontsource/plus-jakarta-sans/latin-500.css'
import '@fontsource/plus-jakarta-sans/latin-600.css'
import '@fontsource/plus-jakarta-sans/latin-700.css'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-600.css'
import 'bootswatch/dist/flatly/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'aos/dist/aos.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)

AOS.init({
  duration: 650,
  once: true,
  easing: 'ease-out-cubic',
  offset: 18,
})

app.mount('#app')
