<template>
    <div class="user-avatar-component" :class="[bordaClass, { 'has-shadow': sombra }]"
        :style="[containerStyle, avatarStyle]" @click="$emit('click', $event)">
        <img v-if="fotoUrl && !erroCarregamentoImagem" :src="fotoUrl" :alt="nome || 'Avatar'" class="avatar-img"
            @error="tratarErroImagem" />
        <span v-else class="avatar-initials" :style="initialsStyle">
            {{ iniciais || gerarIniciais(nome) }}
        </span>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    fotoUrl: { type: String, default: '' },
    nome: { type: String, default: '' },
    iniciais: { type: String, default: '' },
    tamanho: { type: [Number, String], default: 40 },
    borda: { type: String, default: 'nenhuma' },
    sombra: { type: Boolean, default: false },
    corFundo: { type: String, default: '' },
    corTexto: { type: String, default: '#FFFFFF' },
    tamanhoFonte: { type: [Number, String], default: null },
    pesoFonte: { type: [Number, String], default: 600 }
});

defineEmits(['click']);

const erroCarregamentoImagem = ref(false);

watch(() => props.fotoUrl, () => {
    erroCarregamentoImagem.value = false;
});

const tratarErroImagem = () => {
    erroCarregamentoImagem.value = true;
};

const gerarIniciais = (nomeStr) => {
    if (!nomeStr) return '';
    const partes = nomeStr.trim().split(' ');
    if (partes.length >= 2) {
        return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nomeStr.substring(0, 2).toUpperCase();
};

const corCalculada = computed(() => {
    if (props.corFundo) return props.corFundo;
    const palette = ['#72bca5', '#f1ae2b', '#bc0b27', '#4a2512', '#6B1E2E', '#6aaafa', '#6366f1', '#71B89A', '#2A80B9', '#8E44AD'];
    const safeName = props.nome || props.iniciais || 'User';
    let hash = 0;
    for (let i = 0; i < safeName.length; i++) {
        hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
});

const containerStyle = computed(() => {
    const t = typeof props.tamanho === 'number' ? `${props.tamanho}px` : props.tamanho;
    return {
        width: t,
        height: t,
        minWidth: t,
        minHeight: t,
        maxWidth: t,
        maxHeight: t
    };
});

const avatarStyle = computed(() => {
    if (props.fotoUrl && !erroCarregamentoImagem.value) {
        return { backgroundColor: 'transparent' };
    }
    return { backgroundColor: corCalculada.value };
});

const initialsStyle = computed(() => {
    const t = typeof props.tamanho === 'number' ? props.tamanho : parseInt(props.tamanho);
    const fs = props.tamanhoFonte ? (typeof props.tamanhoFonte === 'number' ? `${props.tamanhoFonte}px` : props.tamanhoFonte) : `${Math.max(10, Math.round(t * 0.38))}px`;

    return {
        color: props.corTexto,
        fontSize: fs,
        fontWeight: props.pesoFonte
    };
});

const bordaClass = computed(() => {
    if (props.borda === 'white') return 'border-white';
    if (props.borda === 'verde') return 'border-verde';
    return '';
});
</script>

<style scoped>
.user-avatar-component {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    user-select: none;
    box-sizing: border-box;
    flex-shrink: 0;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
}

.border-white {
    border: 2px solid #FFFFFF;
}

.border-verde {
    border: 1.5px solid var(--verde);
}

.has-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials {
    letter-spacing: 0.5px;
    line-height: 1;
}
</style>