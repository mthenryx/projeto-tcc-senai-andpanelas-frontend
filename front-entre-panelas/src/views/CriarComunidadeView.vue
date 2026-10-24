<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <header class="header-topo">
                <div class="header-left">
                    <button class="back-btn" @click="voltarParaComunidades" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div class="header-titles">
                        <h2>Criar Nova Comunidade</h2>
                        <p>Reúna pessoas apaixonadas pelas mesmas receitas, dietas ou tradições culinárias.</p>
                    </div>
                </div>
            </header>

            <div class="conteudo">

                <div class="form-container" v-if="!sucessoCriacao">

                    <div class="secao-form-bloco">
                        <h3 class="section-title-sm">Identidade Visual</h3>
                        <p class="section-subtitle">Personalize o visual da sua comunidade para torná-la reconhecível e
                            atraente.</p>

                        <div class="identidade-visual-wrapper">

                            <div class="upload-capa-box" @click="dispararInputCapa"
                                :class="{ 'has-file': previewCapa, 'error-border': erros.capa }">
                                <input type="file" ref="fileCapaRef" accept="image/*" @change="tratarUploadCapa"
                                    style="display: none;" />
                                <div v-if="!previewCapa" class="upload-placeholder-capa">
                                    <img src="/icon_img.png" alt="Ícone de imagem" class="icon-upload-img-png" />
                                    <span class="upload-title-text">Adicionar foto de capa da comunidade</span>
                                    <span class="upload-sub-text">Recomendado: 1200 x 400px (JPG ou PNG até 5MB)</span>
                                    <button type="button" class="btn-escolher-img">Escolher imagem</button>
                                </div>
                                <div v-else class="preview-container-capa">
                                    <img :src="previewCapa" alt="Capa" class="preview-media-capa" />
                                    <span class="change-overlay">Alterar capa</span>
                                </div>
                            </div>

                            <div class="avatar-floating-box ">
                                <div class="avatar-floating" @click="dispararInputAvatar"
                                    :class="{ 'has-file': previewAvatar, 'error-border': erros.avatar }">
                                    <input type="file" ref="fileAvatarRef" accept="image/*" @change="tratarUploadAvatar"
                                        style="display: none;" />
                                    <div v-if="!previewAvatar" class="avatar-placeholder">
                                        <img src="/public/icon_camera_comunidade.png" alt="Câmera"
                                            class="camera-icon-img" />
                                        <span class="plus-badge">+</span>
                                    </div>
                                    <img v-else :src="previewAvatar" alt="Avatar" class="preview-avatar-img" />
                                </div>
                            </div>
                        </div>

                        <div class="avatar-label-container">
                            <strong>Ícone / Foto de Perfil</strong>
                            <p>Quadrado mín. 400 x 400px</p>
                        </div>
                    </div>

                    <div class="secao-form-bloco">
                        <h3 class="section-title-sm">Informações Básicas</h3>
                        <p class="section-subtitle">Defina o nome, propósito e categoria da sua comunidade.</p>

                        <div class="input-group">
                            <div class="label-with-counter">
                                <label class="input-label">Nome da comunidade <span class="required">*</span></label>
                                <span class="counter">{{ form.nome.length }}/80</span>
                            </div>
                            <input type="text" v-model="form.nome" class="text-input"
                                :class="{ 'error-input': erros.nome }" maxlength="80"
                                placeholder="Ex: Panificação Artesanal, Massas & Risotos, Cozinha Mineira..."
                                @input="erros.nome = false" />
                        </div>

                        <div class="input-group">
                            <div class="label-with-counter">
                                <label class="input-label">Descrição da comunidade <span
                                        class="required">*</span></label>
                                <span class="counter">{{ form.descricao.length }}/300</span>
                            </div>
                            <textarea v-model="form.descricao" class="textarea-input"
                                :class="{ 'error-input': erros.descricao }" maxlength="300" rows="4"
                                placeholder="Conte sobre o que é essa comunidade, que tipo de receitas os membros vão compartilhar e quem é bem-vindo..."
                                @input="erros.descricao = false"></textarea>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Categoria principal <span class="required">*</span></label>
                            <div class="categories-chips-row">
                                <button type="button" v-for="cat in categoriasDisponiveis" :key="cat" class="cat-chip"
                                    :class="{ active: form.categoria === cat }" @click="form.categoria = cat">
                                    {{ cat }}
                                </button>
                            </div>
                            <div class="outra-categoria-row">
                                <input type="text" v-model="novaCategoriaInput" class="text-input flex-1" maxlength="50"
                                    placeholder="Outra categoria..." @keyup.enter="adicionarCategoriaPersonalizada" />
                                <button type="button" class="btn-add-cat-btn" @click="adicionarCategoriaPersonalizada">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="secao-form-bloco">
                        <h3 class="section-title-sm">Privacidade e Acesso</h3>
                        <div class="privacy-box selected">
                            <img src="/icon_globo.png" alt="Globo" class="privacy-icon-png" />
                            <div class="privacy-text">
                                <strong>Pública</strong>
                                <p>Qualquer utilizador do Panelas pode ver as receitas, participar e postar livremente.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="navigation-buttons-row">
                        <button type="button" class="btn-secondary" @click="voltarParaComunidades">
                            Cancelar
                        </button>
                        <button type="button" class="btn-primary" @click="validarECriarComunidade">
                            Criar Comunidade →
                        </button>
                    </div>

                </div>

                <div v-else class="success-screen-container">
                    <div class="success-icon-wrapper">
                        <img src="/icon_ok.png" alt="Sucesso" class="success-ok-icon" />
                    </div>

                    <h2 class="success-title">Comunidade criada!</h2>
                    <p class="success-desc">
                        A sua comunidade foi criada com sucesso e já está aberta para receber membros e receitas
                        culinárias! 🎉
                    </p>

                    <div class="success-actions">
                        <button type="button" class="btn-primary" @click="validarECriarComunidade">
                            {{ modoEdicao ? 'Salvar alterações' : 'Criar Comunidade →' }}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';

const route = useRoute();
const router = useRouter();

const modoEdicao = ref(false);
const comunidadeId = ref(null);

onMounted(() => {
    if (route.query.id) {
        modoEdicao.value = true;
        comunidadeId.value = route.query.id;
        carregarDadosComunidadeEdicao(route.query.id);
    }
});

const carregarDadosComunidadeEdicao = (id) => {
    form.nome = 'Veganos Criativos';
    form.descricao = 'Receitas plant-based deliciosas para mostrar que vegano não come só salada! 🌱';
    form.categoria = 'Vegano & Vegetariano';
    previewCapa.value = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200';
    previewAvatar.value = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150';
    form.banner_url = previewCapa.value;
    form.foto_url = previewAvatar.value;
};

const sucessoCriacao = ref(false);

const fileCapaRef = ref(null);
const fileAvatarRef = ref(null);
const previewCapa = ref(null);
const previewAvatar = ref(null);

const categoriasDisponiveis = ref([
    'Confeitaria & Doces',
    'Culinária Brasileira',
    'Vegano & Vegetariano',
    'Fitness & Saudável',
    'Massas & Risotos',
    'Bebidas & Drinks',
    'Churrasco'
]);

const novaCategoriaInput = ref('');

const form = reactive({
    nome: '',
    descricao: '',
    categoria: 'Confeitaria & Doces',
    banner_url: '',
    foto_url: ''
});

const erros = reactive({
    nome: false,
    descricao: false,
    capa: false,
    avatar: false
});

const dispararInputCapa = () => { fileCapaRef.value.click(); };
const dispararInputAvatar = () => { fileAvatarRef.value.click(); };

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
        throw new Error('Falha no upload');
    } catch (error) {
        console.error('Erro no upload:', error);
        return null;
    }
};

const tratarUploadCapa = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    previewCapa.value = URL.createObjectURL(arquivo);
    erros.capa = false;

    const urlServidor = await enviarParaCloudinary(arquivo, 'image');
    if (urlServidor) {
        form.banner_url = urlServidor;
    }
};

const tratarUploadAvatar = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    previewAvatar.value = URL.createObjectURL(arquivo);
    erros.avatar = false;

    const urlServidor = await enviarParaCloudinary(arquivo, 'image');
    if (urlServidor) {
        form.foto_url = urlServidor;
    }
};

const adicionarCategoriaPersonalizada = () => {
    const catNome = novaCategoriaInput.value.trim();
    if (!catNome) return;
    if (catNome.length > 50) return;

    const jaExiste = categoriasDisponiveis.value.some(
        c => c.toLowerCase() === catNome.toLowerCase()
    );

    if (!jaExiste) {
        categoriasDisponiveis.value.push(catNome);
    }

    form.categoria = catNome;
    novaCategoriaInput.value = '';
};

const validarECriarComunidade = () => {
    erros.nome = !form.nome.trim();
    erros.descricao = !form.descricao.trim();

    erros.capa = !form.banner_url;
    erros.avatar = !form.foto_url;

    if (erros.nome || erros.descricao || erros.capa || erros.avatar) {
        return;
    }

    sucessoCriacao.value = true;
};

const voltarParaComunidades = () => {
    router.push('/comunidade');
};

const irParaComunidades = () => {
    router.push('/comunidade');
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
    font-weight: 700;
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
    gap: 28px;
}

.secao-form-bloco {
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-bottom: 1px solid #F5F2EC;
    padding-bottom: 24px;
}

.secao-form-bloco:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
}

.section-title-sm {
    font-family: "Playfair Display", serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.section-subtitle {
    font-size: 12px;
    color: var(--cinza);
    margin: -10px 0 0 0;
}

.identidade-visual-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
}

.upload-capa-box {
    width: 100%;
    height: 160px;
    border: 2px dashed #EFEAE1;
    border-radius: 16px;
    background-color: #FAF8F5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: visible;
    transition: border-color 0.2s;
}

.upload-capa-box:hover {
    border-color: var(--verde);
}

.upload-placeholder-capa {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    padding: 12px;
}

.icon-upload-img-png {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 15px;
    border: 1px solid var(--bege);
}

.upload-title-text {
    font-size: 13px;
    font-weight: 700;
    color: var(--marrom);
}

.upload-sub-text {
    font-size: 11px;
    color: var(--cinza);
}

.btn-escolher-img {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    color: var(--marrom);
    padding: 6px 16px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 4px;
}

.preview-container-capa {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
}

.preview-media-capa {
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

.avatar-floating {
    background-color: #faf7f2;
    border-radius: 16px;
    width: 90%;
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ECE2D5;
}

.avatar-floating-box {
    position: absolute;
    bottom: -28px;
    left: 20px;
    width: 80px;
    height: 80px;
    border: 2px solid #EFEAE1;
    border-radius: 16px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    z-index: 10;
    overflow: hidden;
}

.avatar-placeholder {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.camera-icon-img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    border-radius: 10px;
}

.plus-badge {
    position: absolute;
    bottom: -20px;
    right: -25px;
    background-color: var(--verde);
    color: #FFFFFF;
    font-size: 12px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.preview-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    object-fit: cover;
}

.avatar-label-container {
    margin-top: 20px;
    padding-left: 4px;
}

.avatar-label-container strong {
    font-size: 13px;
    color: var(--marrom);
    display: block;
}

.avatar-label-container p {
    font-size: 11px;
    color: var(--cinza);
    margin: 2px 0 0 0;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.label-with-counter {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.input-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.required {
    color: var(--vermelho);
}

.counter {
    font-size: 11px;
    color: var(--cinza);
}

.text-input,
.textarea-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #EFEAE1;
    border-radius: 12px;
    background-color: #FAF8F5;
    font-size: 13px;
    color: var(--marrom);
    outline: none;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
}

.text-input:focus,
.textarea-input:focus {
    border-color: var(--verde);
    background-color: #FFFFFF;
}

.error-input,
.error-border {
    border-color: var(--vermelho) !important;
    background-color: #FFFDFD !important;
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
    background-color: #E3F4ED;
    color: var(--verde-escuro);
    border-color: var(--verde);
}

.outra-categoria-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    width: 60%;
}

.flex-1 {
    flex: 1;
}

.btn-add-cat-btn {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    width: 48px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.btn-add-cat-btn:hover {
    background-color: var(--verde-escuro);
}

.privacy-box {
    border: 1px solid var(--verde);
    background-color: #e3f4ed3b;
    border-radius: 14px;
    padding: 10px;
    display: flex;
    gap: 12px;
    flex-direction: column;
}

.privacy-icon-png {
    width: 24px;
    height: 24px;
    object-fit: contain;
    border-radius: 5px;
}

.privacy-text strong {
    font-size: 14px;
    color: var(--verde-escuro);
    display: block;
    margin-bottom: 2px;
}

.privacy-text p {
    font-size: 12px;
    color: var(--marrom);
    margin: 0;
}

.navigation-buttons-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 8px;
}

.btn-primary {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: var(--verde-escuro);
}

.btn-secondary {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    color: var(--marrom);
    border-radius: 14px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
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
</style>