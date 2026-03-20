import { createApp } from 'vue'
import AOS from 'aos'
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
