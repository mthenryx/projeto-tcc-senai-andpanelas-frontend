<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="fechar">
        <div class="modal-card" :class="{ 'modal-success-card': enviado }">
            <button class="close-btn" @click="fechar" aria-label="Fechar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div v-if="!enviado" class="report-container">
                <div class="left-col">
                    <div class="header-section">
                        <div class="icon-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="#D32F2F" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                        </div>
                        <div class="header-text">
                            <h2>Denunciar {{ tipoTexto }}</h2>
                            <p>Ajude a manter a comunidade acolhedora e segura</p>
                        </div>
                    </div>

                    <div class="options-section">
                        <span class="section-label">QUAL O MOTIVO DA DENÚNCIA?</span>

                        <div class="motivos-list">
                            <label v-for="motivo in listaMotivos" :key="motivo" class="motivo-item"
                                :class="{ 'selected': motivoSelecionado === motivo }">
                                <span>{{ motivo }}</span>
                                <input type="radio" name="motivo" :value="motivo" v-model="motivoSelecionado"
                                    @change="erroMotivo = false" />
                                <span class="custom-radio"></span>
                            </label>
                        </div>

                        <span v-if="erroMotivo" class="error-msg">Por favor, selecione um motivo para a denúncia.</span>
                    </div>
                </div>

                <div class="right-col">
                    <div class="textarea-section">
                        <div class="textarea-header">
                            <label>Detalhes adicionais <span>(opcional)</span></label>
                            <span class="char-count">{{ detalhes.length }}/200</span>
                        </div>
                        <textarea v-model="detalhes" maxlength="200"
                            placeholder="Conte brevemente o que aconteceu..."></textarea>
                    </div>

                    <div class="info-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <p>Sua denúncia é anônima. A moderação analisará este conteúdo em até 24 horas mantendo a
                            privacidade de todos os envolvidos.</p>
                    </div>

                    <div class="actions-footer">
                        <button class="btn-cancelar" @click="fechar">Cancelar</button>
                        <button class="btn-enviar" @click="enviarDenuncia">Enviar denúncia</button>
                    </div>
                </div>
            </div>

            <div v-else class="success-container">
                <div class="success-icon-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="#52AB8B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                <span class="success-subtitle">RECEBEMOS SEU RELATO</span>
                <h2 class="success-title">Denúncia enviada!</h2>

                <p class="success-desc">
                    Obrigado por nos avisar. Nossa moderação irá analisar a publicação para manter nossa comunidade
                    segura e acolhedora.
                </p>

                <button class="btn-entendi" @click="fechar">Entendi</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    tipo: {
        type: String,
        default: 'usuario',
        validator: (value) => ['usuario', 'comunidade', 'receita'].includes(value)
    },
    targetId: { type: [Number, String], default: null }
});

const emit = defineEmits(['close', 'send']);

const motivoSelecionado = ref('');
const detalhes = ref('');
const erroMotivo = ref(false);
const enviado = ref(false);

const tipoTexto = computed(() => {
    switch (props.tipo) {
        case 'comunidade':
            return 'comunidade';
        case 'receita':
            return 'receita';
        default:
            return 'perfil de usuário';
    }
});

const listaMotivos = [
    'Conteúdo impróprio ou ofensivo',
    'Spam ou propaganda',
    'Não tem relação com culinária',
    'Violação de direitos autorais',
    'Outro motivo'
];

const enviarDenuncia = () => {
    if (!motivoSelecionado.value) {
        erroMotivo.value = true;
        return;
    }

    const payload = {
        tipo: props.tipo,
        targetId: props.targetId,
        motivo: motivoSelecionado.value,
        detalhes: detalhes.value
    };

    emit('send', payload);
    enviado.value = true;
};

const fechar = () => {
    emit('close');
    setTimeout(() => {
        motivoSelecionado.value = '';
        detalhes.value = '';
        erroMotivo.value = false;
        enviado.value = false;
    }, 200);
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
    box-sizing: border-box;
}

.modal-card {
    background-color: #FFFFFF;
    border-radius: 20px;
    width: 100%;
    max-width: 820px;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    font-family: "Inter", sans-serif;
}

.modal-success-card {
    max-width: 460px;
    padding: 40px 32px;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: #8C827A;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    z-index: 10;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: #F7F4EC;
}

.report-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.left-col {
    padding: 28px;
    border-right: 1px solid #EFEAE1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.header-section {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.icon-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: #FDE8E8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.header-text h2 {
    font-family: "Playfair Display", serif;
    font-size: 22px;
    color: #2D241E;
    margin: 0 0 4px 0;
    font-weight: 700;
}

.header-text p {
    font-size: 13px;
    color: #6E655F;
    margin: 0;
}

.options-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-label {
    font-size: 11px;
    font-weight: 700;
    color: #8C827A;
    letter-spacing: 0.5px;
}

.motivos-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.motivo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid #EFEAE1;
    cursor: pointer;
    font-size: 14px;
    color: #2D241E;
    transition: all 0.2s;
    user-select: none;
}

.motivo-item:hover {
    background-color: #FAF8F5;
}

.motivo-item.selected {
    border-color: #EFEAE1;
    background-color: #FFFFFF;
}

.motivo-item input[type="radio"] {
    display: none;
}

.custom-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #C0B7B1;
    box-sizing: border-box;
    position: relative;
}

.motivo-item input[type="radio"]:checked+.custom-radio {
    border-color: #0066FF;
    background-color: #0066FF;
}

.motivo-item input[type="radio"]:checked+.custom-radio::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #FFFFFF;
}

.error-msg {
    font-size: 12px;
    color: #D32F2F;
    font-weight: 500;
}

.right-col {
    padding: 28px;
    background-color: #FAF8F5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.textarea-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.textarea-header {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #2D241E;
    font-weight: 600;
}

.textarea-header span {
    color: #8C827A;
    font-weight: 400;
}

.char-count {
    font-size: 12px;
    color: #8C827A;
}

textarea {
    width: 100%;
    height: 120px;
    border-radius: 12px;
    border: 1px solid #EFEAE1;
    padding: 12px;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    color: #2D241E;
    resize: none;
    outline: none;
    background-color: #FFFFFF;
}

textarea::placeholder {
    color: #C0B7B1;
}

textarea:focus {
    border-color: #C0B7B1;
}

.info-box {
    background-color: #F7F4EC;
    border: 1px solid #EFEAE1;
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    color: #6E655F;
}

.info-box svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #8C827A;
}

.info-box p {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
}

.actions-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
}

.btn-cancelar {
    background: none;
    border: none;
    font-size: 14px;
    font-weight: 600;
    color: #6E655F;
    cursor: pointer;
}

.btn-cancelar:hover {
    color: #2D241E;
}

.btn-enviar {
    background-color: #E52E2E;
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-enviar:hover {
    opacity: 0.9;
}

.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.success-icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #E3F4ED;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.success-subtitle {
    font-size: 11px;
    font-weight: 700;
    color: #52AB8B;
    letter-spacing: 0.6px;
    margin-bottom: 6px;
}

.success-title {
    font-family: "Playfair Display", serif;
    font-size: 26px;
    color: #2D241E;
    margin: 0 0 12px 0;
    font-weight: 700;
}

.success-desc {
    font-size: 14px;
    color: #6E655F;
    line-height: 1.5;
    margin: 0 0 24px 0;
}

.btn-entendi {
    width: 100%;
    background-color: #52AB8B;
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-entendi:hover {
    opacity: 0.9;
}
</style>