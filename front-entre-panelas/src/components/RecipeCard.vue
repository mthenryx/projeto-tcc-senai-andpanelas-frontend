<template>
    <div class="recipe-card" @click="irParaDetalhes">
        <div class="recipe-image-container" :style="{ backgroundImage: `url(${imagemUrl})` }">
            <span class="difficulty-badge" :class="dificuldadeClass">
                {{ dificuldade }}
            </span>

            <div class="recipe-author">
                <div class="author-avatar" :style="{ backgroundColor: getAuthorColor(autorNome) }">
                    {{ authorIniciais }}
                </div>
                <span class="author-name">{{ autorNome }}</span>
            </div>
        </div>

        <div class="recipe-content">
            <h3 class="recipe-title">{{ titulo }}</h3>

            <div class="recipe-metadata">
                <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{{ tempo }}</span>
                </div>

                <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{{ porcoes }}</span>
                </div>

                <div class="meta-item cost-item" :class="custoClass">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span>{{ custo }}</span>
                </div>
            </div>

            <div class="recipe-footer">
                <div class="social-stats">
                    <div class="stat-indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                            </path>
                        </svg>
                        <span>{{ curtidas }}</span>
                    </div>

                    <div class="stat-indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                            </path>
                        </svg>
                        <span>{{ comentarios }}</span>
                    </div>
                </div>

                <button class="save-btn" :class="{ 'saved': salvo }" @click.stop="toggleSalvo"
                    :aria-label="salvo ? 'Remover dos salvos' : 'Salvar receita'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        :fill="salvo ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();

const props = defineProps({
    id: { type: [Number, String], required: true },
    imagemUrl: { type: String, required: true },
    titulo: { type: String, required: true },
    tempo: { type: String, required: true },
    porcoes: { type: String, required: true },
    custo: { type: String, required: true },
    curtidas: { type: Number, default: 0 },
    comentarios: { type: Number, default: 0 },
    autorNome: { type: String, required: true },
    authorIniciais: { type: String, required: true },
    dificuldade: { type: String, required: true },
    salvo: { type: Boolean, default: false }
});

const emit = defineEmits(['update:salvo', 'toggle-save']);

const irParaDetalhes = () => {
    router.push(`/receita/${props.id}`);
};

const toggleSalvo = () => {
    const novoEstado = !props.salvo;
    emit('update:salvo', novoEstado);
    emit('toggle-save', { id: props.id, salvo: novoEstado });
};

const dificuldadeClass = computed(() => {
    const diff = props.dificuldade.toLowerCase().trim();
    if (diff.includes('fácil') || diff.includes('facil')) return 'badge-facil';
    if (diff.includes('médio') || diff.includes('medio')) return 'badge-medio';
    return 'badge-dificil';
});

const custoClass = computed(() => {
    const c = props.custo.toLowerCase().trim();
    if (c.includes('econômico') || c.includes('economico')) return 'cost-economico';
    if (c.includes('moderado')) return 'cost-moderado';
    return 'cost-alto';
});

const getAuthorColor = (name) => {
    const palette = ['#72bca5', '#f1ae2b', '#bc0b27', '#4a2512', '#6B1E2E', '#6aaafa', '#6366f1'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
};
</script>

<style scoped>
.recipe-card {
    background-color: #FFFFFF;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--bege);
    width: 100%;
    max-width: 1200px;
    margin: 16px auto;
    font-family: "Inter", sans-serif;
    cursor: pointer;
}

.recipe-image-container {
    height: 240px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    box-sizing: border-box;
}

.difficulty-badge {
    align-self: flex-end;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.badge-facil {
    background-color: var(--verde);
}

.badge-medio {
    background-color: var(--amarelo);
}

.badge-dificil {
    background-color: var(--vermelho);
}

.recipe-author {
    display: flex;
    align-items: center;
    gap: 10px;
}

.author-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    border: 2px solid #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.author-name {
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.recipe-content {
    padding: 20px;
    background-color: var(--cinza-claro);
}

.recipe-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--marrom);
    margin-bottom: 12px;
}

.recipe-metadata {
    display: flex;
    gap: 20px;
    margin-bottom: 18px;
    font-size: 14px;
    color: var(--cinza);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-item svg {
    color: var(--marrom);
}

.cost-economico {
    color: var(--verde);
}

.cost-economico svg {
    color: var(--verde);
}

.cost-moderado {
    color: var(--amarelo);
}

.cost-moderado svg {
    color: var(--amarelo);
}

.cost-alto {
    color: var(--vermelho);
}

.cost-alto svg {
    color: var(--vermelho);
}

.recipe-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--cinza-branco);
    padding-top: 14px;
}

.social-stats {
    display: flex;
    gap: 20px;
}

.stat-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--cinza);
    font-size: 14px;
    user-select: none;
}

.save-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cinza);
    transition: background-color 0.2s, color 0.2s;
}

.save-btn:hover {
    background-color: var(--bege);
    color: var(--marrom);
}

.save-btn.saved {
    color: var(--vermelho);
}
</style>