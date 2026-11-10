import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'

import LoginView from '../views/LoginView.vue'
import CadastroView from '@/views/CadastroView.vue'
import RecuperarSenha from '@/views/RecuperarSenha.vue'
import HomeView from '@/views/HomeView.vue'
import ChefeView from '@/views/ChefeView.vue'
import ComunidadeView from '@/views/ComunidadeView.vue'
import CriarReceitaView from '@/views/CriarReceitaView.vue'
import EditarInformacoesView from '@/views/EditarInformacoesView.vue'
import EditarPerfilView from '@/views/EditarPerfilView.vue'
import GeladeiraView from '@/views/GeladeiraView.vue'
import ListaView from '@/views/ListaView.vue'
import ReceitaView from '@/views/ReceitaView.vue'
import BuscarView from '@/views/BuscarView.vue'
import TesteView from '@/views/TesteView.vue'
import CriarComunidadeView from '@/views/CriarComunidadeView.vue'
import ComunidadeDetalhesView from '@/views/ComunidadeDetalhesView.vue'
import PerfilView from '@/views/PerfilView.vue'
import OthersPerfilView from '@/views/OthersPerfilView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: CadastroView,
      meta: { requiresAuth: false }
    },
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: RecuperarSenha,
      meta: { requiresAuth: false }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chefinho',
      name: 'chefinho',
      component: ChefeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/comunidade',
      name: 'comunidade',
      component: ComunidadeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/criar-comunidade',
      name: 'criar-comunidade',
      component: CriarComunidadeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/comunidade/:id',
      name: 'comunidade-detalhes',
      component: ComunidadeDetalhesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/criar-receita',
      name: 'criar-receita',
      component: CriarReceitaView,
      meta: { requiresAuth: true }
    },
    {
      path: '/editar-informacoes',
      name: 'editar-informacoes',
      component: EditarInformacoesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/editar-perfil',
      name: 'editar-perfil',
      component: EditarPerfilView,
      meta: { requiresAuth: true }
    },
    {
      path: '/geladeira',
      name: 'geladeira',
      component: GeladeiraView,
      meta: { requiresAuth: true }
    },
    {
      path: '/lista-compra',
      name: 'lista-compra',
      component: ListaView,
      meta: { requiresAuth: true }
    },
    {
      path: '/receita/:id',
      name: 'receita',
      component: ReceitaView,
      meta: { requiresAuth: true }
    },
    {
      path: '/buscar-receita',
      name: 'buscar-receita',
      component: BuscarView,
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView,
      meta: { requiresAuth: true }
    },
    {
      path: '/others-perfil',
      name: 'others-perfil',
      component: OthersPerfilView,
      meta: { requiresAuth: true }
    },
    {
      path: '/teste',
      name: 'teste',
      component: TesteView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLogged = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isLogged) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isLogged) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router