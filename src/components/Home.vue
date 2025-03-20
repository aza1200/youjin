<template>
  <div class="home-container">
    <div class="welcome-section">
      <div class="welcome-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      </div>
      <h2 class="welcome-title">TaskFlow에 오신 것을 환영합니다</h2>
      <p class="welcome-subtitle">효율적인 할일 관리를 시작해보세요</p>
    </div>
    
    <div class="auth-options">
      <router-link to="/login" class="auth-option">
        <div class="auth-option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        </div>
        <div class="auth-option-content">
          <h3>로그인</h3>
          <p>기존 계정으로 접속하기</p>
        </div>
        <div class="auth-option-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </router-link>
      
      <router-link to="/register" class="auth-option">
        <div class="auth-option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
        </div>
        <div class="auth-option-content">
          <h3>회원가입</h3>
          <p>새 계정 만들기</p>
        </div>
        <div class="auth-option-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  min-height: 100vh;
  justify-content: center;
  margin-top: -2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 1rem;
  padding-top: 4rem;
}

.welcome-illustration {
  margin: 0 auto 1.5rem;
  color: var(--primary);
  opacity: 0.9;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

.auth-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 2rem;
}

.auth-option {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.auth-option:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.auth-option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius);
  margin-right: 1rem;
}

.auth-option-content {
  flex: 1;
}

.auth-option-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.auth-option-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.auth-option-arrow {
  color: var(--text-secondary);
}
</style>