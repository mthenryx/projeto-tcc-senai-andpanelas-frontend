import { http } from './http.js'

/**
 * GET /receitas — lista paginada com filtros. Retorna { dados, total, pagina }.
 * @param {{ pagina?: number, limite?: number, busca?: string, id_categoria?: number,
 *           id_dificuldade?: 1|2|3, id_custo?: 1|2|3, tempo_max?: string,
 *           id_comunidade?: number, ordenar_por?: 'recente'|'populares'|'curtidas' }} [filtros]
 *        tempo_max no formato HH:MM:SS
 */
export const listar = (filtros = {}, options) =>
  http.get('/receitas', { query: filtros, ...options })

/**
 * POST /receitas — cria uma receita.
 * @param {{ titulo: string, descricao: string, foto: string, video?: string,
 *           tempo: string, id_custo: 1|2|3, id_dificuldade: 1|2|3, id_porcao: number,
 *           ingredientes: {nome: string, quantidade: string, id_unidade_medida: number}[],
 *           modo_preparo: {metodo_preparo: string, ordem_preparo: number}[],
 *           categorias?: number[], tags?: number[] }} dados
 *        tempo = HH:MM:SS · porção de 1 a 15 · NÃO envie "id" nos ingredientes/passos ao criar
 *        categorias e tags são listas de IDs (veja categorias() e tags())
 */
export const criar = (dados) => http.post('/receitas', dados, { auth: true })

/** GET /receitas/semana — top 3 da semana: { top_1, top_2, top_3 }. */
export const daSemana = () => http.get('/receitas/semana', { auth: 'opcional' })

/** GET /receitas/busca/categoria — receitas de uma categoria. Retorna { dados }. */
export const porCategoria = (id_categoria, { pagina, limite } = {}) =>
  http.get('/receitas/busca/categoria', { query: { id_categoria, pagina, limite } })

/** GET /receitas/busca/nome — busca pelo nome. Retorna { dados }. */
export const porNome = (nome, { pagina, limite } = {}, options) =>
  http.get('/receitas/busca/nome', { query: { nome, pagina, limite }, ...options })

/**
 * POST /receitas/busca/ingredientes — receitas a partir de ingredientes informados.
 * Retorna { receitas_base, sugestoes_chefinho }.
 * @param {{nome: string, quantidade: string, id_unidade_medida: number}[]} ingredientes
 */
export const porIngredientes = (ingredientes) =>
  http.post('/receitas/busca/ingredientes', { ingredientes })

/** GET /receitas/{id} — detalhes completos { dados } (ingredientes, modo de preparo, comentários,
 *  curtida/salva pelo usuário logado — o token é enviado automaticamente se existir). */
export const obter = (id) => http.get(`/receitas/${id}`, { auth: 'opcional' })

/**
 * PUT /receitas/{id} — atualiza (só o autor). Envie a receita COMPLETA.
 * Ingredientes/passos com "id" são atualizados; sem "id" são criados;
 * os que não vierem na lista são removidos pelo back-end.
 */
export const atualizar = (id, dados) => http.put(`/receitas/${id}`, dados, { auth: true })

/** DELETE /receitas/{id} */
export const deletar = (id) => http.delete(`/receitas/${id}`, { auth: true })

/** GET /categorias — categorias de receitas. Retorna { dados }. */
export const categorias = () => http.get('/categorias')

/** GET /tags — tags disponíveis. Retorna { dados }. */
export const tags = ({ pagina, limite } = {}) => http.get('/tags', { query: { pagina, limite } })

/** POST /tags — cria a tag se não existir. Retorna só uma mensagem (sem o id),
 *  então chame tags() de novo para pegar o ID. Máx. 30 caracteres. */
export const adicionarTag = (nome_tag) => http.post('/tags', { nome_tag }, { auth: true })

/** GET /em-alta — buscas em alta: { dados: [{ nome, quantidade_pesquisas, data_dia }] }. */
export const emAlta = () => http.get('/em-alta')
