// Valores fixos da API (IDs e textos aceitos). Use em selects, filtros e formulários.

export const UNIDADES_MEDIDA = [
  { id: 1, sigla: 'g', nome: 'Gramas' },
  { id: 2, sigla: 'kg', nome: 'Quilos' },
  { id: 3, sigla: 'ml', nome: 'Mililitros' },
  { id: 4, sigla: 'L', nome: 'Litros' },
  { id: 5, sigla: 'un', nome: 'Unidades' },
]

export const CUSTOS = [
  { id: 1, nome: 'Econômico' },
  { id: 2, nome: 'Moderado' },
  { id: 3, nome: 'Alto' },
]

export const DIFICULDADES = [
  { id: 1, nome: 'Fácil' },
  { id: 2, nome: 'Médio' },
  { id: 3, nome: 'Difícil' },
]

export const PORCOES = { MIN: 1, MAX: 15 }

export const ORDENAR_RECEITAS = {
  RECENTE: 'recente',
  POPULARES: 'populares',
  CURTIDAS: 'curtidas',
}

// PUT /usuarios/me/lista-compras/{id}
export const STATUS_ITEM_LISTA = { COMPRADO: 1, PENDENTE: 2 }

// GET /usuarios/me/lista-compras/receita/{id}?status=
export const FILTRO_LISTA = { TODOS: 'Todos', PENDENTES: 'Pendentes', COMPRADOS: 'Comprados' }

export const MOTIVOS_DENUNCIA = [
  'Conteúdo impróprio ou ofensivo',
  'Spam ou propaganda',
  'Não tem relação com culinária',
  'Violação de direitos autorais',
  'Outro motivo',
]

// Papéis aceitos no histórico enviado ao Chefinho
export const PAPEL_CHEFINHO = { USUARIO: 'user', AGENTE: 'agente' }
