<template>
    <div class="corpo">
        <BarraNavegacao></BarraNavegacao>
        <div class="coluna">
            <HeaderAplicacao></HeaderAplicacao>
            <div class="conteudo">
                <nav>
                    <RouterLink to="/geladeira" class="fast-navegation">
                        <img src="../../public/floco_neve_icon.jpg" alt="Icon de um floco de neve">
                        <span>Geladeira</span>
                    </RouterLink>

                    <RouterLink to="/chefinho" class="fast-navegation">
                        <img src="../../public/iconPaginas/chefe_icon_cinza.png" alt="Icon do chefinho">
                        <span>Chefia</span>
                    </RouterLink>

                    <RouterLink to="/lista-compra" class="fast-navegation">
                        <img src="../../public/iconPaginas/lista_icon_cinza.png" alt="Icon de uma lista" class="lista">
                        <span>Lista</span>
                    </RouterLink>

                    <RouterLink to="/comunidade" class="fast-navegation">
                        <img src="../../public/iconPaginas/comunidade_icon_cinza.png"
                            alt="Icon que representa uma comunidade" id="comunidade">
                        <span>Comunidade</span>
                    </RouterLink>
                </nav>

                <UserCarousel :users="usuariosSeguidos" @search-click="abrirModal" />

                <UserSearchModal :is-open="isModalOpen" :users="listaDeUsuarios" @close="fecharModal" />

                <div class="tabs-container">
                    <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ 'active': abaAtiva === tab.id }"
                        @click="abaAtiva = tab.id">
                        {{ tab.label }}
                    </button>
                </div>

                <div class="container">
                    <div v-if="abaAtiva === 'para-voce'" class="tab-pane">
                        <RecipeBannerCard 
                            :id="destaqueParaVoce.id"
                            :imagemUrl="destaqueParaVoce.imagemUrl"
                            :titulo="destaqueParaVoce.titulo"
                            :tempo="destaqueParaVoce.tempo"
                            :porcoes="destaqueParaVoce.porcoes"
                            :custo="destaqueParaVoce.custo"
                            :autorNome="destaqueParaVoce.autorNome"
                            :authorIniciais="destaqueParaVoce.authorIniciais"
                            :dificuldade="destaqueParaVoce.dificuldade"
                            :badgeTexto="destaqueParaVoce.badgeTexto"
                            @click="abrirDetalhes(receitaAtual)"
                            style="cursor: pointer;"
                        />
                        
                        <div class="section-title-wrapper">
                            <h3 class="section-title">Rápidas e Gostosas</h3>
                            <span class="see-all">Ver todas</span>
                        </div>

                        <div class="grid-mini">
                            <RecipeCardMini 
                                v-for="receita in receitasMini"
                                :key="receita.id"
                                :id="receita.id"
                                :imagemUrl="receita.imagemUrl"
                                :titulo="receita.titulo"
                                :tempo="receita.tempo"
                                :porcoes="receita.porcoes"
                                :dificuldade="receita.dificuldade"
                                @click="abrirDetalhes(receita)"
                            />
                        </div>

                        <RecipeCard 
                            v-for="receita in listaDeReceitas" 
                            :key="receita.id" 
                            :id="receita.id"
                            :imagemUrl="receita.imagemUrl" 
                            :titulo="receita.titulo" 
                            :tempo="receita.tempo"
                            :porcoes="receita.porcoes" 
                            :custo="receita.custo" 
                            :curtidas="receita.curtidas"
                            :comentarios="receita.comentarios" 
                            :autorNome="receita.autorNome"
                            :authorIniciais="receita.authorIniciais" 
                            :dificuldade="receita.dificuldade"
                            v-model:salvo="receita.salvo" 
                            @toggle-save="tratarSalvarReceita" 
                            @click="abrirDetalhes(receitaAtual)"
                            style="cursor: pointer;"
                        />
                    </div>

                    <div v-else-if="abaAtiva === 'seguindo'" class="tab-pane">
                        <RecipeCard 
                            v-for="receita in receitasSeguindo" 
                            :key="receita.id" 
                            :id="receita.id"
                            :imagemUrl="receita.imagemUrl" 
                            :titulo="receita.titulo" 
                            :tempo="receita.tempo"
                            :porcoes="receita.porcoes" 
                            :custo="receita.custo" 
                            :curtidas="receita.curtidas"
                            :comentarios="receita.comentarios" 
                            :autorNome="receita.autorNome"
                            :authorIniciais="receita.authorIniciais" 
                            :dificuldade="receita.dificuldade"
                            v-model:salvo="receita.salvo" 
                            @toggle-save="tratarSalvarReceita" 
                            @click="abrirDetalhes(receitaAtual)"
                            style="cursor: pointer;"
                        />
                    </div>

                    <div v-else-if="abaAtiva === 'populares'" class="tab-pane">
                        <div class="category-row" v-for="categoria in categoriasPopulares" :key="categoria.titulo">
                            <div class="section-title-wrapper">
                                <h3 class="section-title">{{ categoria.titulo }}</h3>
                                <span class="see-all">Ver todas</span>
                            </div>
                            <div class="grid-mini">
                                <RecipeCardMini 
                                    v-for="receita in categoria.receitas"
                                    :key="receita.id"
                                    :id="receita.id"
                                    :imagemUrl="receita.imagemUrl"
                                    :titulo="receita.titulo"
                                    :tempo="receita.tempo"
                                    :porcoes="receita.porcoes"
                                    :dificuldade="receita.dificuldade"
                                    @click="abrirDetalhes(receitaAtual)"
                                    style="cursor: pointer;"
                                />
                            </div>
                        </div>
                    </div>

                    <div v-else-if="abaAtiva === 'receitas'" class="tab-pane">
                        <RecipePodiumRanking 
                            :ouro="receitaOuro"
                            :prata="receitaPrata"
                            :bronze="receitaBronze"
                            @ver-receita="() => abrirDetalhes(receitaAtual)" 
                        />
                    </div>

                    <ReportModal 
                        :is-open="isReportOpen" 
                        :tipo="tipoDenuncia" 
                        :target-id="targetIdDenuncia"
                        @close="isReportOpen = false"
                        @send="tratarEnvioDenuncia"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import HeaderAplicacao from '@/components/HeaderAplicacao.vue';
import UserCarousel from '@/components/UserCarousel.vue';
import UserSearchModal from '@/components/UserSearchModal.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import RecipeCardMini from '@/components/RecipeCardMini.vue';
import RecipeBannerCard from '@/components/RecipeBannerCard.vue';
import RecipePodiumRanking from '@/components/RecipePodiumRanking.vue';
import ReportModal from '@/components/ReportModal.vue';

const router = useRouter();

const usuarioLogado = ref({
    id: 101,
    nome: 'Ana Costa',
    username: 'anacosta',
    iniciais: 'AC'
});

const receitaAtual = ref({
    id: 1,
    titulo: 'Frango ao Limão Siciliano',
    descricao: 'Uma receita deliciosa e perfumada de frango marinado em suco de limão siciliano com ervas frescas. Pronto em menos de 1 hora!',
    categoria: 'Almoço',
    imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tempo: '40min',
    dificuldade: 'Fácil',
    custo: 'Moderado',
    porcoes: '4 porções',
    autorId: 202,
    autorNome: 'Ana Costa',
    autorUsername: 'anacosta',
    authorIniciais: 'AC',
    seguindo: true,
    curtido: true,
    curtidas: 342,
    salvo: false,
    tags: ['Frango', 'Limão', 'Rápido', 'Saudável'],
    ingredientes: [
        { nome: 'Filé de frango', quantidade: '600g' },
        { nome: 'Limão siciliano', quantidade: '2 unidades' },
        { nome: 'Alho', quantidade: '4 dentes' },
        { nome: 'Azeite extra virgem', quantidade: '2 col. de sopa' },
        { nome: 'Tomilho fresco', quantidade: '2 ramos' },
        { nome: 'Sal e pimenta-do-reino', quantidade: 'a gosto' },
        { nome: 'Manteiga', quantidade: '2 col. de sopa' }
    ],
    passos: [
        'Aqueça uma frigideira em fogo alto. Sele os filés por 4 minutos cada lado.',
        'Adicione a manteiga, o tomilho e o suco de limão restante. Regue os filés por 2 minutos.',
        'Sirva com o molho da frigideira por cima e rodelas de limão.'
    ]
});

const listaComentarios = ref([
    {
        id: 1,
        autorId: 301,
        nome: 'Mariana Lima',
        username: 'marilima',
        iniciais: 'ML',
        texto: 'Fiz essa receita ontem e ficou incrível! O frango ficou super suculento 🤌',
        tempo: 'ontem'
    },
    {
        id: 2,
        autorId: 302,
        nome: 'Carlos Eduardo',
        username: 'cadu.cozinha',
        iniciais: 'CE',
        texto: 'Perfeito! Substituí o azeite por óleo de coco e ficou ainda mais saboroso. Recomendo!',
        tempo: '2h'
    },
    {
        id: 3,
        autorId: 101,
        nome: 'Ana Costa',
        username: 'anacosta',
        iniciais: 'AC',
        texto: 'Qual o tempo máximo de marinada? Estava com pressa e deixei só 10 minutos...',
        tempo: '10m'
    }
]);

const abrirDetalhes = (idReceita) => {
    router.push({
        name: 'receita',
        params: { id: idReceita }
    });
};

const isReportOpen = ref(false);
const tipoDenuncia = ref('usuario');
const targetIdDenuncia = ref(null);

const abrirDenuncia = (tipo, id) => {
    tipoDenuncia.value = tipo;
    targetIdDenuncia.value = id;
    isReportOpen.value = true;
};

const tratarEnvioDenuncia = (dados) => {
    console.log('Dados da denúncia enviados:', dados);
};

const isModalOpen = ref(false);

const listaDeUsuarios = ref([
    { id: 1, nome: 'Ana Beatriz', username: 'anabeatriz', iniciais: 'AB', seguindo: true },
    { id: 2, nome: 'Carlos Eduardo', username: 'cadu.cozinha', iniciais: 'CE', seguindo: false },
    { id: 3, nome: 'Mariana Lopes', username: 'marilopes', iniciais: 'ML', seguindo: false },
    { id: 4, nome: 'Rafael Souza', username: 'rafa.souza', iniciais: 'RS', seguindo: true },
    { id: 5, nome: 'Daniel', username: 'daniel.silva', iniciais: 'DS', seguindo: false },
    { id: 6, nome: 'Eduardo', username: 'edu.ramos', iniciais: 'ER', seguindo: true },
    { id: 7, nome: 'Fernanda', username: 'fe.alves', iniciais: 'FA', seguindo: false },
    { id: 8, nome: 'Gabriel', username: 'gabs.souza', iniciais: 'GS', seguindo: false }
]);

const usuariosSeguidos = computed(() => {
    return listaDeUsuarios.value.filter(user => user.seguindo === true);
});

const abrirModal = () => {
    isModalOpen.value = true;
};

const fecharModal = () => {
    isModalOpen.value = false;
};

const abaAtiva = ref('para-voce');

const tabs = [
    { id: 'para-voce', label: 'Para você' },
    { id: 'seguindo', label: 'Seguindo' },
    { id: 'populares', label: 'Populares' },
    { id: 'receitas', label: 'Receitas da semana' }
];

const destaqueParaVoce = ref({
    id: 10,
    imagemUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    titulo: 'Feijoada Completa Tradicional',
    tempo: '180min',
    porcoes: '6 porções',
    custo: 'Alto',
    autorNome: 'Carlos Ferreira',
    authorIniciais: 'CF',
    dificuldade: 'Difícil',
    badgeTexto: 'Receita do Dia'
});

const receitasMini = ref([
    { id: 1, imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', titulo: 'Frango ao Limão Siciliano', tempo: '40min', porcoes: '4 porções', dificuldade: 'Fácil' },
    { id: 2, imagemUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999', titulo: 'Sopa de Abóbora com Coco', tempo: '30min', porcoes: '4 porções', dificuldade: 'Fácil' },
    { id: 3, imagemUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', titulo: 'Macarrão ao Pesto Caseiro', tempo: '25min', porcoes: '2 porções', dificuldade: 'Fácil' },
    { id: 4, imagemUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', titulo: 'Pão de Queijo Mineiro', tempo: '35min', porcoes: '20 porções', dificuldade: 'Fácil' }
]);

const listaDeReceitas = ref([
    {
        id: 1,
        imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        titulo: 'Frango ao Limão Siciliano',
        tempo: '40min',
        porcoes: '4 porções',
        custo: 'Econômico',
        curtidas: 342,
        comentarios: 28,
        autorNome: 'Ana Costa',
        authorIniciais: 'AC',
        dificuldade: 'Fácil',
        salvo: true
    }
]);

const receitasSeguindo = ref([
    {
        id: 2,
        imagemUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
        titulo: 'Pão de Queijo Mineiro',
        tempo: '35min',
        porcoes: '6 porções',
        custo: 'Econômico',
        curtidas: 156,
        comentarios: 14,
        autorNome: 'Carlos Ferreira',
        authorIniciais: 'CF',
        dificuldade: 'Fácil',
        salvo: false
    }
]);

const categoriasPopulares = ref([
    {
        titulo: 'Rápidas e Gostosas',
        receitas: [
            { id: 1, imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', titulo: 'Frango ao Limão Siciliano', tempo: '40min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 2, imagemUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999', titulo: 'Sopa de Abóbora com Coco', tempo: '30min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 3, imagemUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', titulo: 'Macarrão ao Pesto Caseiro', tempo: '25min', porcoes: '2 porções', dificuldade: 'Fácil' },
            { id: 4, imagemUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', titulo: 'Pão de Queijo Mineiro', tempo: '35min', porcoes: '20 porções', dificuldade: 'Fácil' }
        ]
    },
    {
        titulo: 'Almoço e Jantar',
        receitas: [
            { id: 5, imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', titulo: 'Frango ao Limão Siciliano', tempo: '40min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 6, imagemUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999', titulo: 'Sopa de Abóbora com Coco', tempo: '30min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 7, imagemUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', titulo: 'Macarrão ao Pesto Caseiro', tempo: '25min', porcoes: '2 porções', dificuldade: 'Fácil' },
            { id: 8, imagemUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', titulo: 'Pão de Queijo Mineiro', tempo: '35min', porcoes: '20 porções', dificuldade: 'Fácil' }
        ]
    },
    {
        titulo: 'Café da manhã',
        receitas: [
            { id: 9, imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', titulo: 'Frango ao Limão Siciliano', tempo: '40min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 10, imagemUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999', titulo: 'Sopa de Abóbora com Coco', tempo: '30min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 11, imagemUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', titulo: 'Macarrão ao Pesto Caseiro', tempo: '25min', porcoes: '2 porções', dificuldade: 'Fácil' },
            { id: 12, imagemUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', titulo: 'Pão de Queijo Mineiro', tempo: '35min', porcoes: '20 porções', dificuldade: 'Fácil' }
        ]
    },
    {
        titulo: 'Doces veganos',
        receitas: [
            { id: 13, imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', titulo: 'Frango ao Limão Siciliano', tempo: '40min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 14, imagemUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999', titulo: 'Sopa de Abóbora com Coco', tempo: '30min', porcoes: '4 porções', dificuldade: 'Fácil' },
            { id: 15, imagemUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', titulo: 'Macarrão ao Pesto Caseiro', tempo: '25min', porcoes: '2 porções', dificuldade: 'Fácil' },
            { id: 16, imagemUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', titulo: 'Pão de Queijo Mineiro', tempo: '35min', porcoes: '20 porções', dificuldade: 'Fácil' }
        ]
    }
]);

const tratarSalvarReceita = (dados) => {
    console.log('Receita salva:', dados);
};

const receitaOuro = ref({
  id: 1,
  imagemUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
  titulo: 'Feijoada Completa Tradicional',
  descricao: 'Autêntica feijoada brasileira com carnes nobres selecionadas, farofinha crocante, couve refogada no alho e gomos frescos de laranja.',
  tempo: '180 min',
  porcoes: '6 porções',
  dificuldade: 'Médio',
  autorNome: 'Carlos Ferreira',
  authorIniciais: 'CF'
});

const receitaPrata = ref({
  id: 2,
  imagemUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
  titulo: 'Moqueca Baiana & Bobó de Camarão',
  descricao: 'Cremoso purê de aipim com leite de coco fresco, azeite de dendê perfumado e camarões suculentos servidos na cumbuca de barro.',
  tempo: '50 min',
  porcoes: '4 porções',
  dificuldade: 'Fácil',
  autorNome: 'Mariana Lima',
  authorIniciais: 'ML'
});

const receitaBronze = ref({
  id: 3,
  imagemUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
  titulo: 'Picanha na Brasa ao Alho Confitado',
  descricao: 'Picanha no ponto perfeito com crosta de sal grosso e chimichurri rústico, guarnecida com cabeças de alho assadas e macias.',
  tempo: '40 min',
  porcoes: '6 porções',
  dificuldade: 'Médio',
  autorNome: 'Pedro Souza',
  authorIniciais: 'PS'
});

const navegarParaReceita = (id) => {
  console.log(`Navegando para a receita ID: ${id}`);
};
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
}

.coluna {
    width: calc(100% - 200px);
    min-width: 0;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #fdfbf7;
}

.conteudo {
    background-color: #fdfbf7;
    flex: 1;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
}

nav {
    padding: 10px 15px;
    width: 300px;
    display: flex;
    gap: 8px;
}

.fast-navegation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    border: 1px solid var(--bege);
    border-radius: 25px;
    background-color: white;
    gap: 10px;
    color: var(--marrom);
    font-family: "Inter", sans-serif;
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
}

.fast-navegation:hover {
    background-color: #eceae5;
    border: 1px solid #e6dcca;
    transition: 0.5s;
}

.fast-navegation img {
    width: 12px;
    height: auto;
}

.lista {
    filter: grayscale(100%) brightness(35%) contrast(120%);
}

#comunidade {
    height: 15px;
    width: auto;
    filter: brightness(0) saturate(100%) invert(42%) sepia(71%) saturate(2572%) hue-rotate(221deg) brightness(99%) contrast(93%);
}

.tabs-container {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
    display: none;
}

.tab-btn {
    background-color: #FFFFFF;
    border: 1.5px solid var(--bege);
    color: var(--marrom);
    padding: 10px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    outline: none;
    user-select: none;
}

.tab-btn:hover {
    background-color: #e4ded2;
    border-color: var(--bege);
}

.tab-btn.active {
    background-color: var(--verde);
    border-color: var(--verde);
    color: #FFFFFF;
    font-weight: 600;
}

.container {
    padding: 15px;
    padding-bottom: 40px;
    width: 100%;
    max-width: 1200px;
    align-self: center;
    box-sizing: border-box;
}

.tab-pane {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.category-row {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.section-title {
    font-family: "Playfair Display", serif;
    font-size: 20px;
    color: var(--marrom);
    font-weight: 700;
    margin: 0;
}

.see-all {
    font-size: 13px;
    color: var(--verde-escuro);
    font-weight: 600;
    cursor: pointer;
}

.grid-mini {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}
</style>