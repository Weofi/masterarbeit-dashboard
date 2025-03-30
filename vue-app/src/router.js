import {createMemoryHistory, createRouter} from 'vue-router'
import Dashboard from "@/components/Dashboard.vue";


const routes = [
  { path: '/', redirect: '/1k' },
  { path: '/1k', component: Dashboard, props: { dataSet: 1000 } },
  { path: '/10k', component: Dashboard, props: { dataSet: 10000 } },
  { path: '/100k', component: Dashboard, props: { dataSet: 100000 } },
  { path: '/1M', component: Dashboard, props: { dataSet: 1000000 } }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
