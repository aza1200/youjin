import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// axios 기본 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8081';

const app = createApp(App)

// 날짜 포맷 필터 추가
app.config.globalProperties.$filters = {
  formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

app.use(router)
app.mount('#app')