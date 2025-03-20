<template>
  <div class="ai-insights-container">
    <div class="insights-header">
      <div class="user-welcome">
        <div class="user-avatar">
          {{ user ? user.name.charAt(0).toUpperCase() : 'U' }}
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ user ? user.name + '님의 AI 인사이트' : 'AI 인사이트' }}</h2>
          <p class="user-subtitle">AI가 분석한 작업 최적화 및 생산성 향상 방안</p>
        </div>
      </div>
      
      <div class="header-actions">
        <router-link to="/todos" class="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          할일 목록
        </router-link>
        <router-link to="/dashboard" class="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          대시보드
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner-large"></div>
      <p>AI 인사이트를 생성하는 중입니다...</p>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </div>
    
    <div v-else class="insights-grid">
      <!-- 상단 행: 마감일 위험 예측 + 작업 최적화 제안 -->
      <div class="insights-row">
        <!-- 마감일 위험 예측 -->
        <div class="insight-card">
          <div class="insight-header">
            <div class="insight-icon deadline-risk-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>마감일 위험 예측</h3>
          </div>
          
          <div v-if="deadlineRiskLoading" class="insight-loading">
            <div class="loading-spinner"></div>
            <p>분석 중...</p>
          </div>
          <div v-else-if="deadlineRiskError" class="insight-error">
            {{ deadlineRiskError }}
            <button @click="generateDeadlineRiskInsight" class="btn btn-sm btn-outline">다시 시도</button>
          </div>
          <div v-else-if="deadlineRiskInsight" class="insight-content">
            <div v-if="!deadlineRiskInsight.riskTasks || deadlineRiskInsight.riskTasks.length === 0" class="no-risk-tasks">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p>현재 마감일 위험이 있는 작업이 없습니다.</p>
            </div>
            <div v-else>
              <div v-for="(task, index) in deadlineRiskInsight.riskTasks" :key="index" class="risk-task">
                <div class="risk-task-header">
                  <h4>{{ task.title }}</h4>
                  <span class="risk-badge" :class="getRiskBadgeClass(task.riskLevel)">
                    {{ getRiskLevelText(task.riskLevel) }}
                  </span>
                </div>
                <p class="risk-task-due">마감일: {{ $filters.formatDate(task.dueDate) }}</p>
                <p class="risk-task-reason">{{ task.riskReason }}</p>
                <div class="risk-task-suggestion">
                  <strong>제안:</strong> {{ task.suggestion }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="insight-empty">
            <button @click="generateDeadlineRiskInsight" class="btn btn-primary">
              마감일 위험 분석하기
            </button>
          </div>
        </div>
        
        <!-- 작업 최적화 제안 -->
        <div class="insight-card">
          <div class="insight-header">
            <div class="insight-icon task-optimization-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3>작업 최적화 제안</h3>
          </div>
          
          <div v-if="taskOptimizationLoading" class="insight-loading">
            <div class="loading-spinner"></div>
            <p>분석 중...</p>
          </div>
          <div v-else-if="taskOptimizationError" class="insight-error">
            {{ taskOptimizationError }}
            <button @click="generateTaskOptimizationInsight" class="btn btn-sm btn-outline">다시 시도</button>
          </div>
          <div v-else-if="taskOptimizationInsight" class="insight-content">
            <div class="optimization-section">
              <h4>작업 분석</h4>
              <ul class="optimization-list">
                <li v-for="(point, index) in taskOptimizationInsight.analysis || []" :key="'analysis-'+index">
                  {{ point }}
                </li>
              </ul>
            </div>
            
            <div class="optimization-section">
              <h4>최적화 방안</h4>
              <ul class="optimization-list">
                <li v-for="(suggestion, index) in taskOptimizationInsight.suggestions || []" :key="'suggestion-'+index">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
            
            <div class="optimization-section">
              <h4>자동화 가능성</h4>
              <p>{{ taskOptimizationInsight.automation }}</p>
            </div>
          </div>
          <div v-else class="insight-empty">
            <button @click="generateTaskOptimizationInsight" class="btn btn-primary">
              작업 최적화 분석하기
            </button>
          </div>
        </div>
      </div>
      
      <!-- 하단 행: 최적 일정 제안 + 생산성 향상 기회 -->
      <div class="insights-row">
        <!-- 최적 일정 제안 -->
        <div class="insight-card">
          <div class="insight-header">
            <div class="insight-icon optimal-schedule-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3>최적 일정 제안</h3>
          </div>
          
          <div v-if="optimalScheduleLoading" class="insight-loading">
            <div class="loading-spinner"></div>
            <p>분석 중...</p>
          </div>
          <div v-else-if="optimalScheduleError" class="insight-error">
            {{ optimalScheduleError }}
            <button @click="generateOptimalScheduleInsight" class="btn btn-sm btn-outline">다시 시도</button>
          </div>
          <div v-else-if="optimalScheduleInsight" class="insight-content">
            <div class="schedule-section">
              <h4>생산성 피크 시간</h4>
              <div class="peak-times">
                <div v-for="(time, index) in optimalScheduleInsight.peakTimes || []" :key="'peak-'+index" class="peak-time-item">
                  <div class="peak-time-badge">{{ time.hour }}</div>
                  <div class="peak-time-score">생산성 점수: {{ time.score }}</div>
                </div>
              </div>
            </div>
            
            <div class="schedule-section">
              <h4>최적 작업일</h4>
              <div class="optimal-days">
                <div v-for="(day, index) in optimalScheduleInsight.optimalDays || []" :key="'day-'+index" class="optimal-day-item">
                  <div class="optimal-day-badge">{{ day.day }}</div>
                  <div class="optimal-day-score">완료율: {{ day.completionRate }}%</div>
                </div>
              </div>
            </div>
            
            <div class="schedule-section">
              <h4>추천 일정</h4>
              <div class="recommended-schedule">
                <div v-for="(schedule, index) in optimalScheduleInsight.recommendedSchedule || []" :key="'schedule-'+index" class="schedule-item">
                  <div class="schedule-time">{{ schedule.time }}</div>
                  <div class="schedule-task">{{ schedule.task }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="insight-empty">
            <button @click="generateOptimalScheduleInsight" class="btn btn-primary">
              최적 일정 분석하기
            </button>
          </div>
        </div>
        
        <!-- 생산성 향상 기회 -->
        <div class="insight-card">
          <div class="insight-header">
            <div class="insight-icon productivity-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <h3>생산성 향상 기회</h3>
          </div>
          
          <div v-if="productivityOpportunityLoading" class="insight-loading">
            <div class="loading-spinner"></div>
            <p>분석 중...</p>
          </div>
          <div v-else-if="productivityOpportunityError" class="insight-error">
            {{ productivityOpportunityError }}
            <button @click="generateProductivityOpportunityInsight" class="btn btn-sm btn-outline">다시 시도</button>
          </div>
          <div v-else-if="productivityOpportunityInsight" class="insight-content">
            <div class="productivity-section">
              <h4>현재 생산성 패턴</h4>
              <p>{{ productivityOpportunityInsight.currentPattern }}</p>
            </div>
            
            <div class="productivity-section">
              <h4>개선 기회</h4>
              <ul class="productivity-list">
                <li v-for="(opportunity, index) in productivityOpportunityInsight.opportunities || []" :key="'opportunity-'+index">
                  {{ opportunity }}
                </li>
              </ul>
            </div>
            
            <div class="productivity-section">
              <h4>예상 효과</h4>
              <div class="expected-impact">
                <div class="impact-item">
                  <div class="impact-label">생산성 향상</div>
                  <div class="impact-value">{{ productivityOpportunityInsight.expectedImpact?.productivityIncrease || '정보 없음' }}</div>
                </div>
                <div class="impact-item">
                  <div class="impact-label">시간 절약</div>
                  <div class="impact-value">{{ productivityOpportunityInsight.expectedImpact?.timeSaved || '정보 없음' }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="insight-empty">
            <button @click="generateProductivityOpportunityInsight" class="btn btn-primary">
              생산성 향상 기회 분석하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AIInsights',
  data() {
    return {
      user: null,
      tasks: [],
      loading: true,
      error: null,
      
      // 마감일 위험 예측
      deadlineRiskInsight: null,
      deadlineRiskLoading: false,
      deadlineRiskError: null,
      
      // 작업 최적화 제안
      taskOptimizationInsight: null,
      taskOptimizationLoading: false,
      taskOptimizationError: null,
      
      // 최적 일정 제안
      optimalScheduleInsight: null,
      optimalScheduleLoading: false,
      optimalScheduleError: null,
      
      // 생산성 향상 기회
      productivityOpportunityInsight: null,
      productivityOpportunityLoading: false,
      productivityOpportunityError: null
    }
  },
  created() {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      this.user = JSON.parse(userJson)
      this.fetchTasks()
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      
      try {
        console.log('작업 데이터 로드 시작...');
        
        const response = await axios.get('/api/tasks', {
          params: {
            userId: this.user.userId
          }
        })
        
        console.log('작업 데이터 로드 완료:', response.data);
        console.log('작업 개수:', response.data.length);
        
        this.tasks = response.data
        this.loading = false
        
        // 작업 데이터를 불러온 후 모든 AI 인사이트 생성
        console.log('모든 AI 인사이트 생성 시작...');
        this.generateAllInsights();
      } catch (error) {
        this.error = '작업 데이터를 불러오는 중 오류가 발생했습니다.'
        console.error('작업 데이터 로드 오류:', error);
        console.error('오류 상세 정보:', error.response ? error.response.data : '응답 없음');
        this.loading = false
      }
    },
    
    // 모든 AI 인사이트 생성
    async generateAllInsights() {
      console.log('모든 AI 인사이트 생성 함수 시작...');
      
      try {
        // 모든 인사이트 생성 함수 병렬 실행
        await Promise.all([
          this.generateDeadlineRiskInsight(),
          this.generateTaskOptimizationInsight(),
          this.generateOptimalScheduleInsight(),
          this.generateProductivityOpportunityInsight()
        ]);
        
        console.log('모든 AI 인사이트 생성 완료!');
        console.log('마감일 위험 예측:', this.deadlineRiskInsight);
        console.log('작업 최적화 제안:', this.taskOptimizationInsight);
        console.log('최적 일정 제안:', this.optimalScheduleInsight);
        console.log('생산성 향상 기회:', this.productivityOpportunityInsight);
      } catch (error) {
        console.error('AI 인사이트 생성 중 오류 발생:', error);
      }
    },
    
    // 마감일 위험 예측
    async generateDeadlineRiskInsight() {
      this.deadlineRiskLoading = true;
      this.deadlineRiskError = null;
      
      try {
        console.log('마감일 위험 예측 API 호출 시작...');
        console.log('요청 데이터:', { tasks: this.tasks, userId: this.user.userId });
        
        const response = await axios.post('/api/ai/deadline-risk', {
          tasks: this.tasks,
          userId: this.user.userId
        });
        
        console.log('마감일 위험 예측 응답 데이터:', response.data);
        this.deadlineRiskInsight = response.data;
      } catch (error) {
        this.deadlineRiskError = 'AI 인사이트를 생성하는 중 오류가 발생했습니다.';
        console.error('마감일 위험 예측 오류:', error);
        console.error('오류 상세 정보:', error.response ? error.response.data : '응답 없음');
      } finally {
        this.deadlineRiskLoading = false;
      }
    },
    
    // 작업 최적화 제안
    async generateTaskOptimizationInsight() {
      this.taskOptimizationLoading = true;
      this.taskOptimizationError = null;
      
      try {
        console.log('작업 최적화 제안 API 호출 시작...');
        console.log('요청 데이터:', { tasks: this.tasks, userId: this.user.userId });
        
        const response = await axios.post('/api/ai/task-optimization', {
          tasks: this.tasks,
          userId: this.user.userId
        });
        
        console.log('작업 최적화 제안 응답 데이터:', response.data);
        this.taskOptimizationInsight = response.data;
      } catch (error) {
        this.taskOptimizationError = 'AI 인사이트를 생성하는 중 오류가 발생했습니다.';
        console.error('작업 최적화 제안 오류:', error);
        console.error('오류 상세 정보:', error.response ? error.response.data : '응답 없음');
      } finally {
        this.taskOptimizationLoading = false;
      }
    },
    
    // 최적 일정 제안
    async generateOptimalScheduleInsight() {
      this.optimalScheduleLoading = true;
      this.optimalScheduleError = null;
      
      try {
        console.log('최적 일정 제안 API 호출 시작...');
        console.log('요청 데이터:', { tasks: this.tasks, userId: this.user.userId });
        
        const response = await axios.post('/api/ai/optimal-schedule', {
          tasks: this.tasks,
          userId: this.user.userId
        });
        
        console.log('최적 일정 제안 응답 데이터:', response.data);
        this.optimalScheduleInsight = response.data;
      } catch (error) {
        this.optimalScheduleError = 'AI 인사이트를 생성하는 중 오류가 발생했습니다.';
        console.error('최적 일정 제안 오류:', error);
        console.error('오류 상세 정보:', error.response ? error.response.data : '응답 없음');
      } finally {
        this.optimalScheduleLoading = false;
      }
    },
    
    // 생산성 향상 기회
    async generateProductivityOpportunityInsight() {
      this.productivityOpportunityLoading = true;
      this.productivityOpportunityError = null;
      
      try {
        console.log('생산성 향상 기회 API 호출 시작...');
        console.log('요청 데이터:', { tasks: this.tasks, userId: this.user.userId });
        
        const response = await axios.post('/api/ai/productivity-opportunity', {
          tasks: this.tasks,
          userId: this.user.userId
        });
        
        console.log('생산성 향상 기회 응답 데이터:', response.data);
        this.productivityOpportunityInsight = response.data;
      } catch (error) {
        this.productivityOpportunityError = 'AI 인사이트를 생성하는 중 오류가 발생했습니다.';
        console.error('생산성 향상 기회 오류:', error);
        console.error('오류 상세 정보:', error.response ? error.response.data : '응답 없음');
      } finally {
        this.productivityOpportunityLoading = false;
      }
    },
    
    // 위험 수준에 따른 배지 클래스
    getRiskBadgeClass(riskLevel) {
      switch (riskLevel) {
        case 'high':
          return 'risk-high'
        case 'medium':
          return 'risk-medium'
        case 'low':
          return 'risk-low'
        default:
          return 'risk-low'
      }
    },
    
    // 위험 수준 텍스트
    getRiskLevelText(riskLevel) {
      switch (riskLevel) {
        case 'high':
          return '높은 위험'
        case 'medium':
          return '중간 위험'
        case 'low':
          return '낮은 위험'
        default:
          return '위험 없음'
      }
    }
  }
}
</script>

<style scoped>
.ai-insights-container {
  max-width: 100%;
  width: 100%;
  padding: 1.5rem;
  margin: 0;
  box-sizing: border-box;
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.user-welcome {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.user-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.loading-container {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.loading-spinner-large {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.insights-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.insights-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
}

.insight-card {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 350px;
  height: 100%;
}

.insight-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.deadline-risk-icon {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.task-optimization-icon {
  background-color: rgba(168, 85, 247, 0.1);
  color: var(--primary);
}

.optimal-schedule-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.productivity-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.insight-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.insight-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.insight-loading {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.insight-error {
  padding: 1.25rem;
  color: var(--danger);
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.insight-empty {
  padding: 2rem;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 마감일 위험 예측 스타일 */
.no-risk-tasks {
  text-align: center;
  color: var(--success);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.risk-task {
  background-color: #f8fafc;
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 1rem;
}

.risk-task:last-child {
  margin-bottom: 0;
}

.risk-task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.risk-task-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.risk-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.risk-high {
  background-color: #fee2e2;
  color: var(--danger);
}

.risk-medium {
  background-color: #fef3c7;
  color: var(--warning);
}

.risk-low {
  background-color: #ecfdf5;
  color: var(--success);
}

.risk-task-due {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.risk-task-reason {
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.risk-task-suggestion {
  font-size: 0.875rem;
  background-color: #e0e7ff;
  padding: 0.75rem;
  border-radius: var(--radius);
  color: var(--primary);
}

/* 작업 최적화 제안 스타일 */
.optimization-section {
  margin-bottom: 1.25rem;
}

.optimization-section:last-child {
  margin-bottom: 0;
}

.optimization-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
}

.optimization-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.optimization-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.optimization-list li:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary);
  transform: translateY(-50%);
}

/* 최적 일정 제안 스타일 */
.peak-times {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.peak-time-item {
  background-color: #f1f5f9;
  border-radius: var(--radius);
  padding: 0.75rem;
  flex: 1;
  min-width: 100px;
}

.peak-time-badge {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--info);
}

.peak-time-score {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.optimal-days {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.optimal-day-item {
  background-color: #f1f5f9;
  border-radius: var(--radius);
  padding: 0.75rem;
  flex: 1;
  min-width: 100px;
}

.optimal-day-badge {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--info);
}

.optimal-day-score {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.recommended-schedule {
  background-color: #f8fafc;
  border-radius: var(--radius);
  padding: 0.75rem;
}

.schedule-item {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.schedule-item:last-child {
  border-bottom: none;
}

.schedule-time {
  width: 100px;
  font-weight: 500;
  color: var(--info);
  font-size: 0.875rem;
}

.schedule-task {
  flex: 1;
  font-size: 0.875rem;
}

/* 생산성 향상 기회 스타일 */
.productivity-section {
  margin-bottom: 1.25rem;
}

.productivity-section:last-child {
  margin-bottom: 0;
}

.productivity-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
}

.productivity-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.productivity-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.productivity-list li:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--success);
  transform: translateY(-50%);
}

.expected-impact {
  display: flex;
  gap: 1rem;
}

.impact-item {
  background-color: #ecfdf5;
  border-radius: var(--radius);
  padding: 0.75rem;
  flex: 1;
}

.impact-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.impact-value {
  font-weight: 600;
  color: var(--success);
}

@media (max-width: 768px) {
  .insights-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .insights-row {
    grid-template-columns: 1fr;
  }
}
</style>