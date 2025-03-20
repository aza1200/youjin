<template>
  <div class="todo-container">
    <div class="todo-header">
      <div class="user-welcome">
        <div class="user-avatar">
          {{ user ? user.name.charAt(0).toUpperCase() : 'U' }}
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ user ? user.name + '님' : '사용자' }}</h2>
          <p class="user-subtitle">오늘도 생산적인 하루 되세요!</p>
        </div>
      </div>
      
      <div class="header-actions">
        <button @click="openAddTodoModal" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          할일 추가
        </button>
        <router-link to="/ai-insights" class="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
          AI 인사이트
        </router-link>
        <router-link to="/dashboard" class="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          대시보드
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
    
    <div class="todo-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ getCompletedCount }}</h3>
          <p class="stat-label">완료된 할일</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ getPendingCount }}</h3>
          <p class="stat-label">진행중인 할일</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ getOverdueCount }}</h3>
          <p class="stat-label">기한 초과</p>
        </div>
      </div>
    </div>
    
    <div class="status-filters">
      <button 
        @click="filterByStatus(null)" 
        :class="{ active: currentFilter === null }"
        class="filter-btn"
      >
        전체
      </button>
      <button 
        @click="filterByStatus('TODO')" 
        :class="{ active: currentFilter === 'TODO' }"
        class="filter-btn"
      >
        시작 전
      </button>
      <button 
        @click="filterByStatus('IN_PROGRESS')" 
        :class="{ active: currentFilter === 'IN_PROGRESS' }"
        class="filter-btn"
      >
        진행중
      </button>
      <button 
        @click="filterByStatus('DONE')" 
        :class="{ active: currentFilter === 'DONE' }"
        class="filter-btn"
      >
        완료
      </button>
    </div>
    
    <div v-if="error" class="alert alert-danger">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner-large"></div>
      <p>할일 목록을 불러오는 중...</p>
    </div>
    
    <div v-else-if="todos.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="15"></line>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
      </div>
      <h3>할일이 없습니다</h3>
      <p>새로운 할일을 추가해보세요!</p>
      <button @click="openAddTodoModal" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        할일 추가하기
      </button>
    </div>
    
    <div v-else class="todo-grid">
      <div v-for="todo in todos" :key="todo.taskId" class="todo-card" :class="{ 'todo-completed': todo.status === 'DONE' }">
        <div class="todo-status" @click="toggleStatus(todo)">
          <div class="status-indicator" :class="getStatusClass(todo.status)">
            <svg v-if="todo.status === 'DONE'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        
        <div class="todo-content">
          <div class="todo-header">
            <h3 class="todo-title" :class="{ 'completed-text': todo.status === 'DONE' }">{{ todo.title }}</h3>
            <span class="badge" :class="getStatusBadgeClass(todo.status)">
              {{ getStatusText(todo.status) }}
            </span>
          </div>
          
          <p class="todo-description" :class="{ 'completed-text': todo.status === 'DONE' }">{{ todo.description }}</p>
          
          <div v-if="todo.dueDate" class="todo-due-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span :class="{ 'overdue': isOverdue(todo) && todo.status !== 'DONE' }">
              {{ $filters.formatDate(todo.dueDate) }}
              <span v-if="isOverdue(todo) && todo.status !== 'DONE'" class="overdue-badge">기한 초과</span>
            </span>
          </div>
          
          <div class="todo-actions">
            <button @click="openEditTodoModal(todo)" class="btn-icon" title="수정">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button @click="deleteTodo(todo)" class="btn-icon btn-icon-danger" title="삭제">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 할일 추가 모달 -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeAddTodoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>새 할일 추가</h3>
          <button @click="closeAddTodoModal" class="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="addTodo">
            <div class="form-group">
              <label for="title">제목</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <input 
                  id="title"
                  v-model="newTodo.title" 
                  type="text" 
                  class="form-control" 
                  placeholder="할일 제목을 입력하세요"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">설명</label>
              <div class="input-wrapper">
                <svg class="input-icon textarea-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="21" y1="18" x2="3" y2="18"></line>
                </svg>
                <textarea 
                  id="description"
                  v-model="newTodo.description" 
                  class="form-control" 
                  rows="3"
                  placeholder="상세 내용을 입력하세요 (선택사항)"
                ></textarea>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group form-group-half">
                <label for="status">상태</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <select id="status" v-model="newTodo.status" class="form-control">
                    <option value="TODO">시작 전</option>
                    <option value="IN_PROGRESS">진행중</option>
                    <option value="DONE">완료</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group form-group-half">
                <label for="dueDate">마감일</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <input 
                    id="dueDate"
                    v-model="newTodo.dueDate" 
                    type="datetime-local" 
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" @click="closeAddTodoModal" class="btn btn-outline">
                취소
              </button>
              <button type="submit" class="btn btn-primary" :disabled="addLoading">
                <span v-if="addLoading" class="loading-spinner"></span>
                {{ addLoading ? '추가 중...' : '추가하기' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 할일 수정 모달 -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeEditTodoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>할일 수정</h3>
          <button @click="closeEditTodoModal" class="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="updateTodo">
            <div class="form-group">
              <label for="edit-title">제목</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <input 
                  id="edit-title"
                  v-model="editTodo.title" 
                  type="text" 
                  class="form-control" 
                  placeholder="할일 제목을 입력하세요"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="edit-description">설명</label>
              <div class="input-wrapper">
                <svg class="input-icon textarea-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="21" y1="18" x2="3" y2="18"></line>
                </svg>
                <textarea 
                  id="edit-description"
                  v-model="editTodo.description" 
                  class="form-control" 
                  rows="3"
                  placeholder="상세 내용을 입력하세요 (선택사항)"
                ></textarea>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group form-group-half">
                <label for="edit-status">상태</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <select id="edit-status" v-model="editTodo.status" class="form-control">
                    <option value="TODO">시작 전</option>
                    <option value="IN_PROGRESS">진행중</option>
                    <option value="DONE">완료</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group form-group-half">
                <label for="edit-dueDate">마감일</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <input 
                    id="edit-dueDate"
                    v-model="editTodo.dueDate" 
                    type="datetime-local" 
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" @click="closeEditTodoModal" class="btn btn-outline">
                취소
              </button>
              <button type="submit" class="btn btn-primary" :disabled="editLoading">
                <span v-if="editLoading" class="loading-spinner"></span>
                {{ editLoading ? '저장 중...' : '저장하기' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 할일 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-backdrop" @click="closeDeleteModal">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>할일 삭제</h3>
          <button @click="closeDeleteModal" class="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>정말로 이 할일을 삭제하시겠습니까?</p>
          <div class="delete-task-title">{{ todoToDelete?.title }}</div>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-outline">취소</button>
          <button @click="confirmDelete" class="btn btn-danger" :disabled="deleteLoading">
            <span v-if="deleteLoading" class="loading-spinner"></span>
            {{ deleteLoading ? '삭제 중...' : '삭제' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TodoList',
  data() {
    return {
      user: null,
      todos: [],
      loading: true,
      error: '',
      
      // 할일 추가 관련
      showAddModal: false,
      newTodo: {
        title: '',
        description: '',
        status: 'TODO',
        dueDate: ''
      },
      addLoading: false,
      
      // 할일 수정 관련
      showEditModal: false,
      editTodo: {
        taskId: null,
        title: '',
        description: '',
        status: '',
        dueDate: ''
      },
      editLoading: false,
      
      // 할일 삭제 관련
      showDeleteModal: false,
      todoToDelete: null,
      deleteLoading: false,
      
      currentFilter: null
    }
  },
  created() {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userJson = localStorage.getItem('user')
    if (userJson) {
      this.user = JSON.parse(userJson)
      this.fetchTodos()
    } else {
      this.$router.push('/login')
    }
  },
  computed: {
    getCompletedCount() {
      return this.todos.filter(todo => todo.status === 'DONE').length
    },
    getPendingCount() {
      return this.todos.filter(todo => todo.status !== 'DONE').length
    },
    getOverdueCount() {
      return this.todos.filter(todo => 
        todo.status !== 'DONE' && 
        todo.dueDate && 
        new Date(todo.dueDate) < new Date()
      ).length
    }
  },
  methods: {
    async fetchTodos() {
      this.loading = true
      this.error = ''
      
      try {
        const response = await axios.get('/api/tasks', {
          params: {
            userId: this.user.userId,
            status: this.currentFilter
          }
        })
        
        this.todos = response.data
      } catch (error) {
        this.error = '할일 목록을 불러오는 중 오류가 발생했습니다.'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    // 할일 상태 토글
    async toggleStatus(todo) {
      const statusMap = {
        'TODO': 'IN_PROGRESS',
        'IN_PROGRESS': 'DONE',
        'DONE': 'TODO'
      }
      
      const updatedTodo = { ...todo, status: statusMap[todo.status] }
      
      try {
        await axios.put(`/api/tasks/${todo.taskId}`, updatedTodo)
        
        // 로컬 상태 업데이트
        const index = this.todos.findIndex(t => t.taskId === todo.taskId)
        if (index !== -1) {
          this.todos[index].status = statusMap[todo.status]
        }
      } catch (error) {
        this.error = '할일 상태 변경 중 오류가 발생했습니다.'
        console.error(error)
      }
    },
    
    // 할일 삭제
    deleteTodo(todo) {
      this.todoToDelete = todo;
      this.showDeleteModal = true;
    },
    
    // 삭제 모달 닫기
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.todoToDelete = null;
    },
    
    // 삭제 확인
    async confirmDelete() {
      if (!this.todoToDelete) return;
      
      this.deleteLoading = true;
      try {
        await axios.delete(`/api/tasks/${this.todoToDelete.taskId}`);
        this.todos = this.todos.filter(t => t.taskId !== this.todoToDelete.taskId);
        this.closeDeleteModal();
      } catch (error) {
        this.error = '할일 삭제 중 오류가 발생했습니다.';
        console.error(error);
      } finally {
        this.deleteLoading = false;
      }
    },
    
    // 할일 추가 모달
    openAddTodoModal() {
      this.showAddModal = true
      this.newTodo = {
        title: '',
        description: '',
        status: 'TODO',
        dueDate: this.formatDateForInput(new Date())
      }
    },
    
    closeAddTodoModal() {
      this.showAddModal = false
    },
    
    // 할일 추가
    async addTodo() {
      this.addLoading = true
      
      try {
        const todoData = {
          userId: this.user.userId,
          title: this.newTodo.title,
          description: this.newTodo.description,
          status: this.newTodo.status,
          dueDate: this.newTodo.dueDate ? new Date(this.newTodo.dueDate).toISOString() : null
        }
        
        const response = await axios.post('/api/tasks', todoData)
        
        // 로컬 상태 업데이트
        this.todos.unshift(response.data)
        
        // 모달 닫기
        this.closeAddTodoModal()
      } catch (error) {
        this.error = '할일 추가 중 오류가 발생했습니다.'
        console.error(error)
      } finally {
        this.addLoading = false
      }
    },
    
    // 할일 수정 모달
    openEditTodoModal(todo) {
      this.editTodo = {
        taskId: todo.taskId,
        title: todo.title,
        description: todo.description,
        status: todo.status,
        dueDate: todo.dueDate ? this.formatDateForInput(new Date(todo.dueDate)) : ''
      }
      
      this.showEditModal = true
    },
    
    closeEditTodoModal() {
      this.showEditModal = false
    },
    
    // 할일 수정
    async updateTodo() {
      this.editLoading = true
      
      try {
        const todoData = {
          userId: this.user.userId,
          title: this.editTodo.title,
          description: this.editTodo.description,
          status: this.editTodo.status,
          dueDate: this.editTodo.dueDate ? new Date(this.editTodo.dueDate).toISOString() : null
        }
        
        const response = await axios.put(`/api/tasks/${this.editTodo.taskId}`, todoData)
        
        // 로컬 상태 업데이트
        const index = this.todos.findIndex(t => t.taskId === this.editTodo.taskId)
        if (index !== -1) {
          this.todos[index] = response.data
        }
        
        // 모달 닫기
        this.closeEditTodoModal()
      } catch (error) {
        this.error = '할일 수정 중 오류가 발생했습니다.'
        console.error(error)
      } finally {
        this.editLoading = false
      }
    },
    
    // 유틸리티 함수
    getStatusBadgeClass(status) {
      switch (status) {
        case 'DONE':
          return 'badge-success'
        case 'IN_PROGRESS':
          return 'badge-info'
        case 'TODO':
          return 'badge-secondary'
        default:
          return 'badge-secondary'
      }
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'DONE':
          return 'status-done'
        case 'IN_PROGRESS':
          return 'status-progress'
        case 'TODO':
          return 'status-todo'
        default:
          return 'status-todo'
      }
    },
    
    getStatusText(status) {
      switch (status) {
        case 'DONE':
          return '완료'
        case 'IN_PROGRESS':
          return '진행중'
        case 'TODO':
          return '시작 전'
        default:
          return '시작 전'
      }
    },
    
    isOverdue(todo) {
      if (!todo.dueDate) return false
      
      const dueDate = new Date(todo.dueDate)
      const now = new Date()
      
      return dueDate < now
    },
    
    formatDateForInput(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${year}-${month}-${day}T${hours}:${minutes}`
    },
    
    // 상태별 필터링
    async filterByStatus(status) {
      this.currentFilter = status
      this.loading = true
      
      try {
        const response = await axios.get('/api/tasks', {
          params: {
            userId: this.user.userId,
            status: status  // status가 null이면 전체 조회
          }
        })
        this.todos = response.data
      } catch (error) {
        this.error = '할일 목록을 불러오는 중 오류가 발생했습니다.'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* CSS 변수 */
.todo-container {
  --primary: #7c3aed;
  --primary-dark: #6d28d9;
  --primary-light: #ede9fe;
  --danger: #ef4444;
  --danger-dark: #dc2626;
  --success: #22c55e;
  --info: #3b82f6;
  --warning: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border-color: #e5e7eb;
  --radius: 0.5rem;
  --radius-full: 9999px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --transition: all 0.2s ease;
}

/* 기존 스타일 */
.todo-container {
  max-width: 100%;
  width: 100%;
  padding: 1.5rem;
  margin: 0;
  box-sizing: border-box;
}

.todo-header {
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

.todo-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--white);
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.status-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.empty-icon {
  margin: 0 auto 1rem;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty-state p {
  margin-bottom: 1.5rem;
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

.todo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.todo-card {
  background-color: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  display: flex;
  overflow: hidden;
  transition: var(--transition);
}

.todo-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.todo-completed {
  background-color: #f8fafc;
}

.todo-status {
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.status-indicator {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.status-todo {
  border-color: var(--gray);
}

.status-progress {
  border-color: var(--info);
  background-color: var(--info);
}

.status-done {
  border-color: var(--success);
  background-color: var(--success);
  color: white;
}

.todo-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.todo-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  word-break: break-word;
}

.completed-text {
  text-decoration: line-through;
  color: var(--text-secondary);
  opacity: 0.8;
}

.todo-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.875rem;
  word-break: break-word;
  flex: 1;
}

.todo-due-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.overdue {
  color: var(--danger);
}

.overdue-badge {
  display: inline-block;
  background-color: #fee2e2;
  color: var(--danger);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  font-size: 0.625rem;
  margin-left: 0.375rem;
  font-weight: 500;
}

.todo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--white);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.btn-icon:hover {
  background-color: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}

.btn-icon-danger:hover {
  background-color: #fee2e2;
  color: var(--danger);
  border-color: var(--danger);
}

/* 모달 스타일 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  width: 500px;
  max-width: 90%;
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delete-modal {
  width: 400px;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-secondary);
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.25rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.modal-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.delete-task-title {
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  color: var(--text-primary);
  border-left: 3px solid var(--danger);
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

/* 폼 요소 스타일 개선 */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.textarea-icon {
  top: 1.25rem;
  transform: none;
}

.form-control {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--text-primary);
  background-color: white;
  transition: var(--transition);
}

textarea.form-control {
  padding-top: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.form-group-half {
  flex: 1;
  margin-bottom: 0;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  padding-right: 2.5rem;
}

/* 버튼 스타일 개선 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
  transition: var(--transition);
  gap: 0.5rem;
  border: none;
}

.btn-outline {
  background-color: white;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-outline:hover {
  background-color: var(--bg-secondary);
  border-color: var(--text-secondary);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-danger {
  background-color: var(--danger);
  color: white;
}

.btn-danger:hover {
  background-color: var(--danger-dark);
}

.btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1.25rem;
  }
}

/* 폼 요소 스타일 개선 */
.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.form-control::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
  padding-top: 1.25rem;
}
</style>

