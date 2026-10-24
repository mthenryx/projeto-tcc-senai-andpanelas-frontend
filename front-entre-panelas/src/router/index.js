import { createRouter, createWebHistory } from 'vue-router'
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
import PerfilView from '@/views/PerfilView.vue'
import ReceitaView from '@/views/ReceitaView.vue'
import BuscarView from '@/views/BuscarView.vue'
import TesteView from '@/views/TesteView.vue'
import CriarComunidadeView from '@/views/CriarComunidadeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: CadastroView
    },
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: RecuperarSenha
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chefinho',
      name: 'chefinho',
      component: ChefeView
    },
    {
      path: '/comunidade',
      name: 'comunidade',
      component: ComunidadeView
    },
    {
      path: '/criar-comunidade',
      name: '/comunidade',
      component: CriarComunidadeView
    },
    {
      path: '/comunidade/:id',
      name: 'ComunidadeDetalhes',
      component: () => import('@/views/ComunidadeDetalhesView.vue')
    },
    {
      path: '/criar-receita',
      name: 'criar-receita',
      component: CriarReceitaView
    },
    {
      path: '/editar-informacoes',
      name: 'editar-informacoes',
      component: EditarInformacoesView
    },
    {
      path: '/editar-perfil',
      name: 'editar-perfil',
      component: EditarPerfilView
    },
    {
      path: '/geladeira',
      name: 'geladeira',
      component: GeladeiraView
    },
    {
      path: '/lista-compra',
      name: 'lista-compra',
      component: ListaView
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView
    },
    {
      path: '/receita/:id',
      name: 'receita',
      component: ReceitaView
    },
    {
      path: '/buscar-receita',
      name: 'buscar-receita',
      component: BuscarView
    },
    {
      path: '/teste',
      name: 'teste',
      component: TesteView
    }
  ]
})

export default router