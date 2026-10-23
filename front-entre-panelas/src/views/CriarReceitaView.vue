<template>
    <div class="corpo">

        <BarraNavegacao />

        <div class="coluna">
            <header class="header-topo" v-if="etapaAtual <= 3">
                <div class="header-left">
                    <button class="back-btn" @click="voltarEtapa" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div class="header-titles">
                        <h2>Nova Receita</h2>
                        <p>Etapa {{ etapaAtual }} de 3</p>
                    </div>
                </div>
            </header>

            <div class="conteudo">
                <div class="form-container" v-if="!sucessoPublicacao">

                    <div class="progress-bar-container">
                        <div class="progress-segment" :class="{ active: etapaAtual >= 1 }"></div>
                        <div class="progress-segment" :class="{ active: etapaAtual >= 2 }"></div>
                        <div class="progress-segment" :class="{ active: etapaAtual >= 3 }"></div>
                    </div>

                    <div v-if="etapaAtual === 1" class="etapa-content">
                        <h3 class="section-title">Informações da receita</h3>

                        <div class="upload-box" @click="dispararInputFoto" :class="{ 'error-upload-box': erros.foto, 'has-file': previewFoto }">
                            <input type="file" ref="fileFotoRef" accept="image/*" @change="tratarUploadFoto"
                                style="display: none;" />
                            <div v-if="!previewFoto" class="upload-placeholder">
                                <img src="/icon_camera_receita.png" alt="Câmera" class="upload-icon-img" />
                                <span class="upload-title-text">Adicionar foto da receita</span>
                                <span class="upload-sub-text">Toque para escolher da galeria ou tirar foto</span>
                            </div>
                            <div v-else class="preview-container">
                                <img :src="previewFoto" alt="Pré-visualização da foto" class="preview-media" />
                                <span class="change-overlay">Alterar foto</span>
                            </div>
                        </div>

                        <div class="upload-box" @click="dispararInputVideo" :class="{ 'has-file': previewVideo }">
                            <input type="file" ref="fileVideoRef" accept="video/*" @change="tratarUploadVideo"
                                style="display: none;" />
                            <div v-if="!previewVideo" class="upload-placeholder">
                                <img src="/icon_play.png" alt="Vídeo" class="upload-icon-img" />
                                <span class="upload-title-text">Adicionar vídeo da receita</span>
                                <span class="upload-sub-text">Toque para escolher da galeria um vídeo</span>
                            </div>
                            <div v-else class="preview-container video-preview">
                                <video :src="previewVideo" class="preview-media" controls></video>
                                <span class="change-overlay">Alterar vídeo</span>
                            </div>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Nome da receita <span class="required">*</span></label>
                            <input type="text" v-model="form.titulo" class="text-input"
                                :class="{ 'error-input': erros.titulo }"
                                placeholder="Ex: Bolo de Cenoura com Brigadeiro" @input="erros.titulo = false" maxlength="50"/>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Descrição</label>
                            <textarea v-model="form.descricao" class="textarea-input" :class="{ 'error-input': erros.descricao }" rows="3"
                                placeholder="Conte um pouco sobre essa receita..." @input="erros.descricao = false" maxlength="200"></textarea>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Categoria <span class="required">*</span></label>
                            <div class="categories-chips-row">
                                <button type="button" v-for="cat in categoriasDisponiveis" :key="cat" class="cat-chip"
                                    :class="{ active: form.categoria === cat, 'error-border': erros.categoria && !form.categoria }"
                                    @click="selecionarCategoria(cat)">
                                    {{ cat }}
                                </button>
                            </div>
                        </div>

                        <div class="row-dupla">
                            <div class="input-group flex-1">
                                <label class="input-label">Dificuldade <span class="required">*</span></label>
                                <select v-model="form.dificuldade" class="select-input">
                                    <option v-for="dif in dificuldadesDisponiveis" :key="dif" :value="dif">{{ dif }}
                                    </option>
                                </select>
                            </div>

                            <div class="input-group flex-1">
                                <label class="input-label">Custo estimado <span class="required">*</span></label>
                                <select v-model="form.custo" class="select-input">
                                    <option v-for="custo in custosDisponiveis" :key="custo" :value="custo">{{ custo }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="row-dupla">
                            <div class="input-group flex-1">
                                <label class="input-label">Tempo (minutos) <span class="required">*</span></label>
                                <input type="number" v-model.number="form.tempo" min="1" max="1440" class="text-input"
                                    :class="{ 'error-input': erros.tempo }" @input="erros.tempo = false" />
                            </div>

                            <div class="input-group flex-1">
                                <label class="input-label">Porções <span class="required">*</span></label>
                                <select v-model="form.porcoes" class="select-input">
                                    <option v-for="porcao in porcoesDisponiveis" :key="porcao" :value="porcao">{{ porcao
                                        }}</option>
                                </select>
                            </div>
                        </div>

                        <button type="button" class="btn-primary-ingrediente" @click="avancarParaEtapa2">
                            Próximo: Ingredientes →
                        </button>
                    </div>

                    <div v-if="etapaAtual === 2" class="etapa-content">
                        <h3 class="section-title">Ingredientes</h3>

                        <div class="dynamic-list-container">
                            <div v-for="(ing, index) in form.ingredientes" :key="index" class="dynamic-row">
                                <input type="text" v-model="ing.nome" class="text-input flex-3"
                                    :class="{ 'error-input': erros.ingredientes && !ing.nome.trim() }"
                                    placeholder="Ingrediente" maxlength="35" />

                                <input type="text" v-model="ing.quantidade" class="text-input flex-1"
                                    :class="{ 'error-input': erros.ingredientes && !ing.quantidade.toString().trim() }"
                                    placeholder="Qtd." />

                                <button type="button" class="remove-row-btn" @click="removerIngrediente(index)"
                                    aria-label="Remover">
                                    ✕
                                </button>
                            </div>
                        </div>

                        <button type="button" class="btn-dashed-add" @click="adicionarIngrediente">
                            + Adicionar ingrediente
                        </button>

                        <div class="navigation-buttons-row">
                            <button type="button" class="btn-secondary" @click="etapaAtual = 1">
                                ← Voltar
                            </button>
                            <button type="button" class="btn-primary" @click="avancarParaEtapa3">
                                Próximo: Preparo →
                            </button>
                        </div>
                    </div>

                    <div v-if="etapaAtual === 3" class="etapa-content">
                        <h3 class="section-title">Modo de preparo</h3>

                        <div class="dynamic-list-container">
                            <div v-for="(passo, index) in form.passos" :key="index" class="dynamic-row passo-row">
                                <span class="step-badge-num">{{ index + 1 }}</span>
                                <textarea v-model="form.passos[index]" class="textarea-input flex-1" rows="2"
                                    :class="{ 'error-input': erros.passos && !passo.trim() }"
                                    :placeholder="`Passo ${index + 1}...`" maxlength="250"></textarea>
                                <button type="button" class="remove-row-btn" @click="removerPasso(index)"
                                    aria-label="Remover">
                                    ✕
                                </button>
                            </div>
                        </div>

                        <button type="button" class="btn-dashed-add" @click="adicionarPasso">
                            + Adicionar passo
                        </button>

                        <div class="input-group" style="margin-top: 24px;">
                            <label class="input-label">Tags (opcional)</label>
                            <div class="tag-input-row">
                                <input type="text" v-model="novaTagInput" maxlength="30" class="text-input"
                                    placeholder="Ex: vegano, rápido..." @keyup.enter="adicionarTag" />
                                <button type="button" class="btn-add-tag" @click="adicionarTag">+</button>
                            </div>
                            <div class="chips-tags-list" v-if="form.tags.length > 0">
                                <span v-for="(tag, idx) in form.tags" :key="idx" class="tag-chip-item">
                                    #{{ tag }} <button type="button" @click="removerTag(idx)">×</button>
                                </span>
                            </div>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Relacione a comunidade na qual participa</label>
                            <select v-model="form.comunidadeId" class="select-input">
                                <option :value="null">Não está relacionado a nenhuma comunidade</option>
                                <option v-for="com in comunidadesDisponiveis" :key="com.id" :value="com.id">{{ com.nome
                                    }}</option>
                            </select>
                        </div>

                        <div class="navigation-buttons-row">
                            <button type="button" class="btn-secondary" @click="etapaAtual = 2">
                                ← Voltar
                            </button>
                            <button type="button" class="btn-danger-primary" @click="publicarReceita">
                                Publicar receita
                            </button>
                        </div>
                    </div>

                </div>

                <div v-else class="success-screen-container">
                    <div class="success-icon-wrapper">
                        <img src="/icon_ok.png" alt="Sucesso" class="success-ok-icon" />
                    </div>

                    <h2 class="success-title">Receita publicada!</h2>
                    <p class="success-desc">
                        Sua receita foi compartilhada com a comunidade. Agora é esperar os elogios!
                    </p>

                    <div class="success-actions">
                        <button type="button" class="btn-primary-ingrediente" @click="verMinhaReceita">
                            Ver minha receita →
                        </button>
                        <button type="button" class="link-feed-btn" @click="irParaFeed">
                            Ir para o feed
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';

const router = useRouter();

const etapaAtual = ref(1);
const sucessoPublicacao = ref(false);

const fileFotoRef = ref(null);
const fileVideoRef = ref(null);
const previewFoto = ref(null);
const previewVideo = ref(null);

const categoriasDisponiveis = ref(['Café da manhã', 'Almoço', 'Jantar', 'Sobremesa', 'Lanche', 'Sopa', 'Salada', 'Bebida']);
const dificuldadesDisponiveis = ref(['Fácil', 'Médio', 'Difícil']);
const custosDisponiveis = ref(['Econômico', 'Moderado', 'Elevado']);
const porcoesDisponiveis = ref([1, 2, 4, 6, 8, 10, 12]);
const comunidadesDisponiveis = ref([
    { id: 1, nome: 'Cozinha Brasileira' },
    { id: 2, nome: 'Veganos Criativos' },
    { id: 3, nome: 'Bolos & Confeitaria' }
]);

const form = reactive({
    titulo: '',
    descricao: '',
    categoria: '',
    dificuldade: 'Fácil',
    custo: 'Econômico',
    tempo: 30,
    porcoes: 4,
    fotoUrl: '',
    videoUrl: '',
    ingredientes: [
        { nome: '', quantidade: '' },
        { nome: '', quantidade: '' }
    ],
    passos: [
        '',
        ''
    ],
    tags: [],
    comunidadeId: null
});

const erros = reactive({
    titulo: false,
    descricao: false,
    categoria: false,
    tempo: false,
    foto: false,
    ingredientes: false,
    passos: false,
});

const novaTagInput = ref('');

const dispararInputFoto = () => { fileFotoRef.value.click(); };
const dispararInputVideo = () => { fileVideoRef.value.click(); };

const enviarParaCloudinary = async (arquivo, tipo) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_PRESET;

    const formData = new FormData();
    formData.append('file', arquivo);
    formData.append('upload_preset', preset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${tipo}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.secure_url) {
            return data.secure_url;
        }
        throw new Error('Falha no upload para o Cloudinary');
    } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao carregar o arquivo para a nuvem. Tente novamente.');
        return null;
    }
};

const tratarUploadFoto = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    previewFoto.value = URL.createObjectURL(arquivo);
    erros.foto = false;

    const urlServidor = await enviarParaCloudinary(arquivo, 'image');
    if (urlServidor) {
        form.fotoUrl = urlServidor;
    }
};

const tratarUploadVideo = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    previewVideo.value = URL.createObjectURL(arquivo);

    const urlServidor = await enviarParaCloudinary(arquivo, 'video');
    if (urlServidor) {
        form.videoUrl = urlServidor;
    }
};

const selecionarCategoria = (cat) => {
    form.categoria = cat;
    erros.categoria = false;
};

const avancarParaEtapa2 = () => {
    erros.titulo = !form.titulo.trim();
    erros.descricao = !form.descricao.trim();
    erros.categoria = !form.categoria;
    erros.tempo = !form.tempo || form.tempo <= 0;
    erros.foto = !form.fotoUrl;

    if (erros.titulo || erros.descricao || erros.categoria || erros.tempo || erros.foto) {
        return;
    }
    etapaAtual.value = 2;
};

const avancarParaEtapa3 = () => {
    const temIngredientesInvalidos = form.ingredientes.some(i => !i.nome.trim() || !i.quantidade.toString().trim());
    erros.ingredientes = temIngredientesInvalidos || form.ingredientes.length === 0;

    if (erros.ingredientes) {
        return;
    }
    etapaAtual.value = 3;
};

const adicionarIngrediente = () => {
    form.ingredientes.push({ nome: '', quantidade: '' });
};

const removerIngrediente = (index) => {
    if (form.ingredientes.length > 1) {
        form.ingredientes.splice(index, 1);
    }
};

const adicionarPasso = () => {
    form.passos.push('');
};

const removerPasso = (index) => {
    if (form.passos.length > 1) {
        form.passos.splice(index, 1);
    }
};

const adicionarTag = () => {
    const t = novaTagInput.value.trim().replace(/^#/, '');
    if (t && !form.tags.includes(t)) {
        form.tags.push(t);
    }
    novaTagInput.value = '';
};

const removerTag = (index) => {
    form.tags.splice(index, 1);
};

const publicarReceita = () => {
    const temPassosInvalidos = form.passos.some(p => !p.trim());
    erros.passos = temPassosInvalidos || form.passos.length === 0;

    if (erros.passos) {
        return;
    }

    sucessoPublicacao.value = true;
};

const verMinhaReceita = () => {
    router.push('/home'); 
};

const irParaFeed = () => {
    router.push('/home');
};

const voltarEtapa = () => {
    if (etapaAtual.value > 1) {
        etapaAtual.value--;
    } else {
        router.push('/home');
    }
};
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: var(--cinza-claro);
    font-family: "Inter", sans-serif;
}

.error-upload-box {
    border-color: var(--vermelho) !important;
    background-color: #FFFDFD;
}

.coluna {
    width: calc(100% - 200px);
    min-width: 0;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header-topo {
    width: 100%;
    height: 60px;
    background-color: white;
    border-bottom: 1px solid var(--bege);
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--marrom);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.header-titles h2 {
    font-family: "Inter", sans-serif;
    font-size: 18px;
    color: var(--marrom);
    margin: 0;
    font-weight: 500;
}

.header-titles p {
    font-size: 11px;
    color: var(--cinza);
    margin: 1px 0 0 0;
}

.conteudo {
    background-color: var(--cinza-claro);
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 30px 16px 60px 16px;
    box-sizing: border-box;
}

.form-container {
    width: 100%;
    max-width: 820px;
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    border-radius: 20px;
    padding: 32px;
    box-sizing: border-box;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.progress-bar-container {
    display: flex;
    gap: 12px;
    width: 100%;
    margin-bottom: 10px;
}

.progress-segment {
    flex: 1;
    height: 6px;
    background-color: #EFEAE1;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.progress-segment.active {
    background-color: var(--verde);
}

.etapa-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.section-title {
    font-family: "Playfair Display", serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.upload-box {
    width: 100%;
    height: 140px;
    border: 2px dashed #EFEAE1;
    border-radius: 16px;
    background-color: #FAF8F5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
}

.upload-box:hover {
    border-color: var(--verde);
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    padding: 12px;
}

.upload-icon-img {
    border-radius: 10px;
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.upload-title-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.upload-sub-text {
    font-size: 11px;
    color: var(--cinza);
}

.preview-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.preview-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.change-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #FFFFFF;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.required {
    color: var(--vermelho);
}

.text-input,
.textarea-input,
.select-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #EFEAE1;
    border-radius: 12px;
    background-color: #FFFFFF;
    font-size: 13px;
    color: var(--marrom);
    outline: none;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
}

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238C827A' stroke-width='2.5'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 18px center;
}

.text-input:focus,
.textarea-input:focus,
.select-input:focus {
    border-color: var(--verde);
}

.error-input,
.error-border {
    border-color: var(--vermelho) !important;
    background-color: #FFFDFD;
}

.row-dupla {
    display: flex;
    gap: 16px;
}

.flex-1 {
    flex: 1;
}

.flex-2 {
    flex: 2;
}

.flex-3 {
    flex: 3;
}

.categories-chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.cat-chip {
    background-color: #FAF8F5;
    border: 1px solid #EFEAE1;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: var(--cinza);
    cursor: pointer;
    transition: all 0.2s;
}

.cat-chip.active {
    background-color: var(--amarelo);
    color: var(--marrom);
    border-color: var(--amarelo);
}

.dynamic-list-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.dynamic-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.passo-row {
    padding: 8px;
    border-radius: 12px;
}

.step-badge-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: var(--bege);
    color: var(--marrom);
    font-weight: 700;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.remove-row-btn {
    background: none;
    border: none;
    color: var(--vermelho);
    font-size: 16px;
    cursor: pointer;
    padding: 6px;
}

.btn-dashed-add {
    width: 100%;
    padding: 12px;
    border: 1px dashed var(--verde);
    border-radius: 12px;
    background-color: #E3F4ED;
    color: var(--verde-escuro);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    margin-top: 4px;
}

.tag-input-row {
    display: flex;
    gap: 8px;
}

.btn-add-tag {
    background-color: var(--marrom);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    width: 46px;
    font-size: 18px;
    cursor: pointer;
}

.chips-tags-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.tag-chip-item {
    background-color: #FAF8F5;
    border: 1px solid #EFEAE1;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    color: var(--cinza);
    display: flex;
    align-items: center;
    gap: 6px;
}

.tag-chip-item button {
    background: none;
    border: none;
    color: var(--vermelho);
    cursor: pointer;
    font-weight: bold;
}

.navigation-buttons-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 16px;
}

.btn-primary {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 50%;
    text-align: center;
}

.btn-primary-ingrediente {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    text-align: center;
}

.btn-secondary {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    color: var(--marrom);
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 50%;
}

.btn-danger-primary {
    background-color: #bc0b27;
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 50%;
}

.success-screen-container {
    align-self: center;
    width: 100%;
    max-width: 600px;
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    border-radius: 20px;
    padding: 40px;
    box-sizing: border-box;
}

.success-icon-wrapper {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-ok-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.success-title {
    font-family: "Playfair Display", serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.success-desc {
    font-size: 13px;
    color: var(--cinza);
    max-width: 380px;
    margin: 0;
    line-height: 1.5;
}

.success-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    margin-top: 10px;
}

.link-feed-btn {
    background: none;
    border: none;
    color: var(--cinza);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}
</style>