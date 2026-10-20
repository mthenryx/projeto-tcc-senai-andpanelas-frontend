# src/services — integração com a API Entre Panelas

Todas as 66 rotas do `swagger.yaml` já estão prontas. Nas views você só chama a função.

## Instalação (2 passos)

1. Copie esta pasta para `src/services`.
2. No `.env` (e no `.env.example`), defina o endereço do back-end **sem** `/v1/entrepanelas`:

```
VITE_API_URL=https://URL-DO-SEU-BACKEND
```

Opcional — no `main.js`, redirecione para o login quando o token vencer:

```js
import router from './router'
import { definirAoExpirarSessao } from '@/services'

definirAoExpirarSessao(() => router.push('/login')) // ajuste para o nome/caminho da sua rota
```

## Como usar

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { receitas, interacoes, ApiError } from '@/services'

const lista = ref([])
const erro = ref('')

onMounted(async () => {
  try {
    const { dados } = await receitas.listar({ limite: 12, ordenar_por: 'populares' })
    lista.value = dados
  } catch (e) {
    erro.value = e.message // já vem pronto para mostrar ao usuário
  }
})

async function curtir(id) {
  try {
    await interacoes.curtir(id)
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) { /* não logado */ }
  }
}
</script>
```

## Regras

- **Retorno:** sucesso devolve o conteúdo de `response` da API (listas vêm em `.dados`). Erro lança `ApiError` com `.message` (texto pronto) e `.status` (código HTTP; `0` = sem conexão).
- **Token:** `auth.login()` guarda o token sozinho e todas as rotas protegidas o enviam. `auth.logout()` limpa. Para mudar a chave do localStorage, edite `TOKEN_KEY` em `http.js`.
- **Parâmetros:** os campos de body/filtros usam exatamente os nomes do swagger (`id_custo`, `nome_tag`...). Ids vão como argumento (`receitas.obter(10)`).
- **Busca digitando:** `usuarios.buscarPorUsername(texto, { signal })`, `receitas.porNome(...)`, `receitas.listar(...)` e `comunidades.listar(...)` aceitam um `AbortSignal` para cancelar a requisição anterior.
- **Constantes** (`UNIDADES_MEDIDA`, `CUSTOS`, `DIFICULDADES`, `MOTIVOS_DENUNCIA`...) estão em `constantes.js`.

## Arquivos

| Import | Rotas |
|---|---|
| `auth` | registro, verificar e-mail, login, recuperar/redefinir senha |
| `usuarios` | listar, buscar por username, perfil, editar perfil, trocar e-mail/senha |
| `seguidores` | seguir, deixar de seguir, seguidores, seguindo |
| `receitas` | listar, criar, buscas, detalhes, editar, excluir, categorias, tags, em alta |
| `interacoes` | curtir, salvar, comentários |
| `geladeira` | ingredientes da geladeira + receitas compatíveis |
| `listaCompras` | lista de compras por receita |
| `comunidades` | CRUD, entrar/sair, receitas, categorias |
| `chefinho` | conversas e mensagens com a IA |
| `denuncias` | usuário, comunidade, receita |

## Pontos para confirmar com quem faz o back-end

O swagger não tem estas rotas, então não há função para elas:

- **Criar conversa do Chefinho** — só existe `POST /chefinho/conversas/{id}/mensagens`, que exige um id de conversa já existente.
- **Receitas de um usuário / receitas salvas / comunidades do usuário** — úteis para o `PerfilView`.
- **Upload de imagem** — `foto`, `foto_perfil`, `banner_url` e `foto_url` pedem uma URL; precisa existir um jeito de subir o arquivo.
- **Troca de senha logado** — `alterar-senha` recebe só a senha atual e `confirmar-alteracao` só o código; não há campo para a **nova** senha.
