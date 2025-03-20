<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="user-welcome">
        <div class="user-avatar">
          {{ user ? user.name.charAt(0).toUpperCase() : 'U' }}
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ user ? user.name + '님의 생산성 대시보드' : '생산성 대시보드' }}</h2>
          <p class="user-subtitle">지난 4주간의 생산성 데이터를 확인하세요</p>
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
        <router-link to="/ai-insights" class="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
          AI 인사이트
        </router-link>
        <router-link to="/" class="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          홈으로
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner-large"></div>
      <p>대시보드 데이터를 불러오는 중...</p>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </div>
    
    <div v-else>
      <!-- 주요 지표 카드 -->
      <div class="metric-cards">
        <div class="metric-card">
          <div class="metric-icon completed-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.completedTasks }}</h3>
            <p class="metric-label">완료된 작업</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon in-progress-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.inProgressTasks }}</h3>
            <p class="metric-label">진행중인 작업</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon productivity-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.productivityScore }}%</h3>
            <p class="metric-label">생산성 점수</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon deadline-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="metric-content">
            <h3 class="metric-value">{{ metrics.deadlineComplianceRate }}%</h3>
            <p class="metric-label">마감일 준수율</p>
          </div>
        </div>
      </div>
      
      <!-- 생산성 추이 그래프 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>생산성 추이</h3>
        </div>
        
        <div class="productivity-charts-grid">
          <!-- 왼쪽 차트: 생산성 점수 -->
          <div class="chart-panel">
            <h4 class="chart-panel-title">생산성 점수 추이</h4>
            <p class="chart-description">4주간의 작업 처리 효율성과 생산성 변화를 보여줍니다.</p>
            <div class="productivity-chart">
              <div class="chart-y-axis">
                <div v-for="n in 5" :key="n" class="y-axis-label">{{ (6-n) * 20 }}%</div>
              </div>
              <div class="chart-content">
                <svg class="trend-line" :viewBox="`0 0 ${getSvgWidth()} 200`">
                  <!-- 배경 그리드 -->
                  <line
                    v-for="n in 5"
                    :key="'h'+n"
                    x1="0"
                    :y1="(n-1)*50"
                    :x2="getSvgWidth()"
                    :y2="(n-1)*50"
                    stroke="#e5e7eb"
                    stroke-width="1"
                  />
                  
                  <!-- 생산성 점수 선 -->
                  <path
                    :d="getProductivityPath()"
                    fill="none"
                    stroke="#7c3aed"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  
                  <!-- 데이터 포인트 -->
                  <g v-for="(point, index) in getDataPoints()" :key="index">
                    <circle
                      :cx="point.x"
                      :cy="point.y"
                      r="5"
                      fill="white"
                      stroke="#7c3aed"
                      stroke-width="2.5"
                    />
                    <text
                      :x="point.x"
                      :y="point.y - 12"
                      text-anchor="middle"
                      fill="#6b7280"
                      font-size="12"
                      font-weight="500"
                    >{{ productivityTrend[index].score }}%</text>
                  </g>

                  <!-- X축 라벨 -->
                  <g v-for="(week, index) in productivityTrend" :key="'label-'+index">
                    <text
                      :x="getDataPoints()[index]?.x || 0"
                      y="190"
                      text-anchor="middle"
                      fill="#6b7280"
                      font-size="12"
                      font-weight="500"
                    >{{ week.label }}</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 오른쪽 차트: 완료율 -->
          <div class="chart-panel">
            <h4 class="chart-panel-title">완료율 추이</h4>
            <p class="chart-description">4주간의 작업 완료 비율 변화를 나타냅니다.</p>
            <div class="completion-chart">
              <svg class="modern-chart" viewBox="0 0 400 280">
                <!-- 배경 그라데이션 -->
                
                
                <!-- 배경 그리드 -->
                <g class="grid-lines">
                  <line v-for="n in 5" :key="'h'+n" x1="50" :y1="(n-1)*50 + 40" x2="370" :y2="(n-1)*50 + 40" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4" />
                </g>
                
                <!-- Y축 라벨 -->
                <g class="y-axis-labels">
                  <text v-for="n in 6" :key="'y'+n" x="40" :y="(5-n)*40 + 45" text-anchor="end" fill="#6b7280" font-size="12">{{ n * 20 }}%</text>
                </g>
                
                <!-- 완료율 영역 -->
                
                
                <!-- 완료율 선 -->
                <path
                  :d="getCompletionRateCurvePath()"
                  fill="none"
                  stroke="#22c55e"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                
                <!-- 완료율 데이터 포인트 -->
                <g v-for="(point, index) in getCompletionRatePoints()" :key="'comp-'+index">
                  <circle
                    :cx="point.x"
                    :cy="point.y"
                    r="6"
                    fill="white"
                    stroke="#22c55e"
                    stroke-width="2.5"
                  />
                  <text
                    :x="point.x"
                    :y="point.y - 15"
                    text-anchor="middle"
                    fill="#6b7280"
                    font-size="12"
                    font-weight="500"
                  >{{ weeklyCompletionRate[index].rate }}%</text>
                </g>

                <!-- X축 라벨 -->
                <g v-for="(week, index) in weeklyCompletionRate" :key="'label-'+index">
                  <text
                    :x="getCompletionRatePoints()[index]?.x || 0"
                    y="260"
                    text-anchor="middle"
                    fill="#6b7280"
                    font-size="12"
                    font-weight="500"
                  >{{ week.label }}</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 하단 차트 섹션 -->
      <div class="bottom-charts">
        <!-- 상태별 작업 수 -->
        <div class="status-chart-container">
          <h3>상태별 작업 수</h3>
          <p class="chart-description">현재 진행 중인 작업들의 상태별 분포를 보여줍니다.</p>
          <div class="status-chart">
            <div class="status-bar-container">
              <div v-for="(status, index) in tasksByStatus" :key="index" class="status-bar" :class="status.class" :style="{ width: `${status.percentage}%` }">
                <span class="status-label">{{ status.label }}</span>
                <span class="status-value">{{ status.count }}</span>
              </div>
            </div>
            <div class="status-legend">
              <div v-for="(status, index) in tasksByStatus" :key="index" class="status-legend-item">
                <div class="status-legend-color" :class="status.class"></div>
                <span>{{ status.label }} ({{ status.count }})</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 주간 작업 완료율 -->
        <div class="weekly-chart-container">
          <h3>주간 작업 완료율</h3>
          <p class="chart-description">지난 4주간의 주별 작업 완료율을 나타냅니다.</p>
          <div class="weekly-chart">
            <div v-for="(week, index) in weeklyCompletionRate" :key="index" class="weekly-bar-container">
              <div class="weekly-label">{{ week.label }}</div>
              <div class="weekly-bar-wrapper">
                <div class="weekly-bar" :style="{ width: `${week.rate}%` }">
                  <span class="weekly-value">{{ week.rate }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      user: null,
      loading: true,
      error: '',
      tasks: [], // 사용자의 전체 작업 데이터
      metrics: {
        completedTasks: 0,
        inProgressTasks: 0,
        productivityScore: 0,
        deadlineComplianceRate: 0
      },
      productivityTrend: [],
      tasksByStatus: [],
      weeklyCompletionRate: []
    }
  },
  created() {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      this.user = JSON.parse(userJson)
      this.fetchDashboardData()
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      this.error = ''
      
      try {
        // 지난 4주간의 작업 데이터 가져오기
        const fourWeeksAgo = new Date()
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
        
        const response = await axios.get('/api/tasks', {
          params: {
            userId: this.user.userId,
            startDate: fourWeeksAgo.toISOString(),
            endDate: new Date().toISOString()
          }
        })
        
        this.tasks = response.data
        this.calculateMetrics()
        this.calculateProductivityTrend()
        this.calculateTasksByStatus()
        this.calculateWeeklyCompletionRate()
        
      } catch (error) {
        this.error = '대시보드 데이터를 불러오는 중 오류가 발생했습니다.'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    calculateMetrics() {
      // 완료된 작업 수
      this.metrics.completedTasks = this.tasks.filter(task => task.status === 'DONE').length
      
      // 진행중인 작업 수
      this.metrics.inProgressTasks = this.tasks.filter(task => task.status === 'IN_PROGRESS').length
      
      // 생산성 점수 계산
      let totalScore = 0
      let maxPossibleScore = this.tasks.length * 10 // 모든 작업이 기한 내 완료되었을 경우의 최고 점수
      
      console.log('전체 작업 목록:', this.tasks)
      
      this.tasks.forEach(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate.split('.')[0]) : null
        const updatedAt = new Date(task.updatedAt.split('.')[0])
        
        // 각 작업의 상태 판단 시점을 updatedAt으로 설정
        const isOverdue = dueDate ? updatedAt.getTime() > dueDate.getTime() : false
        
        let score = 0
        // 상태와 기한 초과 여부에 따른 점수 부여
        if (task.status === 'DONE') {
          score = !isOverdue ? 10 : 8  // 기한 내 완료(10점) 또는 기한 초과 완료(8점)
        } else if (task.status === 'IN_PROGRESS') {
          score = !isOverdue ? 6 : 4  // 기한 내 진행 중(6점) 또는 기한 초과 진행 중(4점)
        } else if (task.status === 'TODO') {
          score = !isOverdue ? 3 : 1  // 기한 내 대기 중(3점) 또는 기한 초과 대기 중(1점)
        }
        
        totalScore += score
        console.log(`작업 [${task.title}]`)
        console.log(`- 상태: ${task.status}`)
        console.log(`- 마감일: ${dueDate ? dueDate.toISOString() : 'none'}`)
        console.log(`- 수정일: ${updatedAt.toISOString()}`)
        console.log(`- 기한초과: ${isOverdue}`)
        console.log(`- 점수: ${score}`)
        console.log('---')
      })
      
      console.log('총 점수:', totalScore)
      console.log('최대 가능 점수:', maxPossibleScore)
      
      // 최종 생산성 점수 계산
      this.metrics.productivityScore = Math.round((totalScore / maxPossibleScore) * 100)
      
      console.log('최종 생산성 점수:', this.metrics.productivityScore)
      
      // 마감일 준수율 계산 (기존 로직 유지)
      const tasksWithDueDate = this.tasks.filter(task => task.dueDate)
      const tasksMetDeadline = tasksWithDueDate.filter(task => {
        if (task.status === 'DONE') {
          return new Date(task.updatedAt) <= new Date(task.dueDate)
        }
        return new Date() <= new Date(task.dueDate)
      })
      
      this.metrics.deadlineComplianceRate = tasksWithDueDate.length > 0
        ? Math.round((tasksMetDeadline.length / tasksWithDueDate.length) * 100)
        : 0
    },
    
    calculateProductivityTrend() {
      // 주별 데이터 초기화
      const weeks = [
        { label: '4주 전', score: 0, tasks: [] },
        { label: '3주 전', score: 0, tasks: [] },
        { label: '2주 전', score: 0, tasks: [] },
        { label: '지난주', score: 0, tasks: [] }
      ]
      
      // 현재 날짜
      const now = new Date()
      
      // 각 작업을 해당하는 주차에 분류
      this.tasks.forEach(task => {
        const taskDate = new Date(task.createdAt)
        const weeksDiff = Math.floor((now - taskDate) / (7 * 24 * 60 * 60 * 1000))
        
        if (weeksDiff >= 0 && weeksDiff < 4) {
          const weekIndex = 3 - weeksDiff
          weeks[weekIndex].tasks.push(task)
        }
      })
      
      // 각 주차별 생산성 점수 계산
      weeks.forEach(week => {
        if (week.tasks.length > 0) {
          let totalScore = 0
          let maxPossibleScore = week.tasks.length * 10
          
          week.tasks.forEach(task => {
            const dueDate = task.dueDate ? new Date(task.dueDate.split('.')[0]) : null
            const updatedAt = new Date(task.updatedAt.split('.')[0])
            const isOverdue = dueDate ? updatedAt.getTime() > dueDate.getTime() : false
            
            let score = 0
            if (task.status === 'DONE') {
              score = !isOverdue ? 10 : 8
            } else if (task.status === 'IN_PROGRESS') {
              score = !isOverdue ? 6 : 4
            } else if (task.status === 'TODO') {
              score = !isOverdue ? 3 : 1
            }
            totalScore += score
          })
          
          week.score = Math.round((totalScore / maxPossibleScore) * 100)
        }
      })
      
      this.productivityTrend = weeks
    },
    
    calculateTasksByStatus() {
      const done = this.tasks.filter(task => task.status === 'DONE').length
      const inProgress = this.tasks.filter(task => task.status === 'IN_PROGRESS').length
      const todo = this.tasks.filter(task => task.status === 'TODO').length
      const total = done + inProgress + todo
      
      // count가 0인 상태는 제외하고 배열에 추가
      this.tasksByStatus = [
        ...(done > 0 ? [{
          label: '완료',
          count: done,
          percentage: total > 0 ? Math.round((done / total) * 100) : 0,
          class: 'status-completed'
        }] : []),
        ...(inProgress > 0 ? [{
          label: '진행중',
          count: inProgress,
          percentage: total > 0 ? Math.round((inProgress / total) * 100) : 0,
          class: 'status-in-progress'
        }] : []),
        ...(todo > 0 ? [{
          label: '시작 전',
          count: todo,
          percentage: total > 0 ? Math.round((todo / total) * 100) : 0,
          class: 'status-todo'
        }] : [])
      ]
    },
    
    calculateWeeklyCompletionRate() {
      // 주별 완료율 계산
      const weeks = [
        { label: '4주 전', total: 0, completed: 0 },
        { label: '3주 전', total: 0, completed: 0 },
        { label: '2주 전', total: 0, completed: 0 },
        { label: '지난주', total: 0, completed: 0 }
      ]
      
      const now = new Date()
      
      // 각 작업을 해당하는 주차에 분류하고 완료율 계산
      this.tasks.forEach(task => {
        const taskDate = new Date(task.createdAt)
        const weeksDiff = Math.floor((now - taskDate) / (7 * 24 * 60 * 60 * 1000))
        
        if (weeksDiff >= 0 && weeksDiff < 4) {
          const weekIndex = 3 - weeksDiff
          weeks[weekIndex].total++
          if (task.status === 'DONE') {
            weeks[weekIndex].completed++
          }
        }
      })
      
      // 완료율 계산
      this.weeklyCompletionRate = weeks.map(week => ({
        label: week.label,
        rate: week.total > 0 ? Math.round((week.completed / week.total) * 100) : 0
      }))
    },
    
    getProductivityPath() {
      const points = this.getDataPoints()
      if (points.length === 0) return ''
      
      return points.reduce((path, point, index) => {
        return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
      }, '')
    },
    
    getDataPoints() {
      // SVG 요소의 실제 너비를 가져오기 위해 DOM 요소 참조
      const svgElement = this.$el.querySelector('.trend-line');
      const width = svgElement ? svgElement.clientWidth : 360; // 실제 너비 또는 기본값
      const height = 160; // 실제 그래프가 그려질 높이
      
      // 고정된 위치에 데이터 포인트 배치 (화면 전체에 고르게 분포)
      const positions = [
        { x: width * 0.15, y: 20 + (height - (height * (this.productivityTrend[0].score / 100))) },
        { x: width * 0.38, y: 20 + (height - (height * (this.productivityTrend[1].score / 100))) },
        { x: width * 0.62, y: 20 + (height - (height * (this.productivityTrend[2].score / 100))) },
        { x: width * 0.85, y: 20 + (height - (height * (this.productivityTrend[3].score / 100))) }
      ];
      
      return positions;
    },
    
    getSvgWidth() {
      const svgElement = this.$el.querySelector('.trend-line');
      return svgElement ? svgElement.clientWidth : 360;
    },
    
    getCompletionRateCurvePath() {
      const points = this.getCompletionRatePoints();
      if (points.length === 0) return '';
  
      return points.reduce((path, point, index) => {
        if (index === 0) return `M ${point.x},${point.y}`;
    
        const prev = points[index - 1];
        const cpx1 = prev.x + (point.x - prev.x) / 2;
        const cpx2 = point.x - (point.x - prev.x) / 2;
    
        return `${path} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`;
      }, '');
    },

    

    getCompletionRatePoints() {
      const width = 400;
      const height = 200;
      const startX = 50;
      const endX = width - 30;
      const usableWidth = endX - startX;
      const maxValue = 100; // Y축 최대값을 100으로 제한

      return this.weeklyCompletionRate.map((week, index) => ({
        x: startX + (usableWidth * (index / (this.weeklyCompletionRate.length - 1))),
        y: 40 + (height - (height * (Math.min(week.rate, maxValue) / maxValue)))
      }));
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 100%;
  width: 100%;
  padding: 2rem;
  margin: 0;
  box-sizing: border-box;
}

.dashboard-header {
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert {
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-danger {
  background-color: #fee2e2;
  color: var(--danger);
}

/* 주요 지표 카드 스타일 */
.metric-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--border-color);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.completed-icon {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.in-progress-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.productivity-icon {
  background-color: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.deadline-icon {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 생산성 추이 그래프 스타일 */
.chart-container {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #7c3aed !important;
}

.completed-color {
  background-color: #22c55e;
}

.pending-color {
  background-color: #3b82f6;
}

.productivity-chart {
  height: 260px;
  display: flex;
  margin-top: 0.5rem;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 0.75rem;
  width: 40px;
}

.y-axis-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: right;
  height: 20px;
  line-height: 20px;
}

.chart-content {
  flex: 1;
  position: relative;
  padding: 1rem;
  margin-left: 2rem;
  border-left: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  height: 240px;
  max-width: 100%;
  box-sizing: border-box;
}

.trend-line {
  width: 100%;
  height: 200px;
  display: block;
  margin-left: -1px; /* 왼쪽 테두리와의 겹침 방지 */
}

.x-axis-labels,
.x-label-container,
.x-label {
  display: none;
}

/* 하단 차트 섹션 스타일 */
.bottom-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.status-chart-container, .weekly-chart-container {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.status-chart-container h3, .weekly-chart-container h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

/* 상태별 작업 수 차트 스타일 */
.status-bar-container {
  height: 40px;
  display: flex;
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.status-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  position: relative;
  min-width: 40px;
}

.status-completed {
  background-color: #22c55e;
}

.status-in-progress {
  background-color: #3b82f6;
}

.status-todo {
  background-color: #94a3b8;
}

.status-label {
  margin-right: 0.5rem;
}

.status-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.status-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* 주간 작업 완료율 차트 스타일 */
.weekly-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.weekly-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weekly-label {
  width: 60px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.weekly-bar-wrapper {
  flex: 1;
  height: 24px;
  background-color: #f1f5f9;
  border-radius: var(--radius);
  overflow: hidden;
}

.weekly-bar {
  height: 100%;
  background-color: #a855f7;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
}

.weekly-value {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .metric-cards {
    grid-template-columns: 1fr;
  }
  
  .bottom-charts {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .weekly-bar-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .weekly-label {
    width: 100%;
  }
}

.productivity-charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 두 개의 컬럼으로 분할 */
  gap: 2rem; /* 컬럼 사이의 간격 */
}

.chart-panel {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.chart-panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.completion-chart {
  height: 280px;  /* 높이 증가 */
  position: relative;
  margin-top: 0.5rem;
}

.modern-chart {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.chart-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.5rem 0 1.5rem 0;
}

.completion-chart .modern-chart path {
  stroke: #22c55e !important;  /* 완료율 선 색상을 초록색으로 변경 */
}

#completionGradient stop {
  stop-color: #22c55e !important;  /* 그라데이션 색상도 초록색으로 변경 */
}
</style>

