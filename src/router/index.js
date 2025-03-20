import { createRouter, createWebHistory } from "vue-router"
import Home from "../components/Home.vue"
import Login from "../components/Login.vue"
import Register from "../components/Register.vue"
import TodoList from "../components/TodoList.vue"
import Dashboard from "../components/Dashboard.vue"
import AIInsights from "../components/AIInsights.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/todos",
    name: "TodoList",
    component: TodoList,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/ai-insights",
    name: "AIInsights",
    component: AIInsights,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 로그인 필요한 페이지에 대한 네비게이션 가드
router.beforeEach((to, from, next) => {
  const publicPages = ["/", "/login", "/register"]
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem("user")

  if (authRequired && !loggedIn) {
    return next("/login")
  }

  next()
})

export default router

