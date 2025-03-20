<template>
  <div class="register-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
        </div>
        <h2 class="auth-title">회원가입</h2>
        <p class="auth-subtitle">새 계정을 만들어 시작하세요</p>
      </div>
      
      <div v-if="error" class="alert alert-danger">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {{ error }}
      </div>
      
      <div v-if="success" class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        {{ success }}
      </div>
      
      <form @submit.prevent="register" class="auth-form">
        <div class="form-group">
          <label for="name">이름</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input 
              id="name"
              v-model="user.name" 
              type="text" 
              class="form-control" 
              placeholder="이름을 입력하세요"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">이메일</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input 
              id="email"
              v-model="user.email" 
              type="email" 
              class="form-control" 
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">비밀번호</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              id="password"
              v-model="user.password" 
              type="password" 
              class="form-control" 
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '등록 중...' : '계정 만들기' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>이미 계정이 있으신가요? <router-link to="/login" class="auth-link">로그인</router-link></p>
        <router-link to="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          메인으로 돌아가기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      },
      error: '',
      success: '',
      isLoading: false
    }
  },
  methods: {
    async register() {
      this.isLoading = true
      this.error = ''
      this.success = ''
      
      try {
        await axios.post('/api/users', this.user)
        
        this.success = '등록이 완료되었습니다. 메인 페이지로 이동합니다.'
        
        // 폼 초기화
        this.user = {
          name: '',
          email: '',
          password: ''
        }
        
        // 3초 후 메인 페이지로 이동
        setTimeout(() => {
          this.$router.push('/')
        }, 3000)
      } catch (error) {
        if (error.response && error.response.data) {
          this.error = error.response.data
        } else {
          this.error = '등록 중 오류가 발생했습니다.'
          console.error(error)
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.auth-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius);
  margin: 0 auto 1rem;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.input-with-icon {
  position: relative;
}

.input-with-icon svg {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.input-with-icon input {
  padding-left: 2.5rem;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}

.auth-footer p {
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.auth-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.back-link:hover {
  color: var(--primary);
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>