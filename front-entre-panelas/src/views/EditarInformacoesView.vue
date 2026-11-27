<template>
    <div class="perfil-layout">
        <BarraNavegacao />

        <main class="conteudo-principal">
            <div class="topo-pagina none">
                <button class="botao-icone-1" @click="voltarPerfil" aria-label="Voltar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div class="header-titles">
                    <h2>Editar informações</h2>
                    <p>Altere seus dados de acesso e informações pessoais</p>
                </div>
            </div>

            <div class="conteudo-container">
                <div class="cabecalho-sair">
                    <div class="cabecalho-titulo">
                        <h1>Editar informações</h1>
                        <p>Altere seus dados de acesso e informações pessoais.</p>
                    </div>
                    <button class="botao-sair" @click="sairDaConta" aria-label="Sair da conta">
                        <img src="../../public/icon_sair.png" alt="Sair" class="icone-sair" />
                    </button>
                </div>

                <div class="cartao-secao">
                    <h2 class="titulo-secao">Dados de acesso</h2>
                    
                    <div class="grupo-campo-info">
                        <label class="label-info">E-mail</label>
                        <div class="input-com-icone-container">
                            <img src="../../public/icon_email_perfil.png" alt="E-mail" class="icone-input-esquerdo" />
                            <input 
                                type="email" 
                                v-model="dadosAcesso.email" 
                                maxlength="256"
                                :disabled="!camposDesbloqueados.email" 
                                class="input-personalizado" 
                                :class="{ 'input-erro': errosCampos.email || erroEmailInvalido }"
                                @input="tratarMudancaEmail"
                            />
                            <button
                                type="button"
                                class="botao-alterar-item"
                                :disabled="enviandoCodigo || camposDesbloqueados.email"
                                @click="solicitarValidacao('email')"
                            >
                                Alterar
                            </button>
                        </div>
                        <div v-if="camposDesbloqueados.email && dadosAcesso.email.trim() !== emailOriginal" class="grupo-campo-info campo-senha-email">
                            <label class="label-info">Senha atual para confirmar o novo e-mail</label>
                            <input
                                type="password"
                                v-model="senhaAtualEmail"
                                maxlength="15"
                                autocomplete="current-password"
                                class="input-personalizado"
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        <span v-if="errosCampos.email || erroEmailInvalido" class="texto-erro-input">{{ erroEmailInvalido ? 'Informe um endereço de e-mail válido.' : 'Não foi possível validar a alteração do e-mail.' }}</span>
                    </div>

                    <div class="grupo-campo-info">
                        <label class="label-info">Senha</label>
                        <div class="input-com-icone-container">
                            <img src="../../public/icon_cadeado_perfil.png" alt="Senha" class="icone-input-esquerdo" />
                            <input 
                                :type="mostrarSenhaTexto ? 'text' : 'password'" 
                                v-model="dadosAcesso.senha" 
                                maxlength="30"
                                :placeholder="camposDesbloqueados.senha ? 'Digite a nova senha' : senhaOcultaPlaceholder"
                                :disabled="!camposDesbloqueados.senha" 
                                class="input-personalizado" 
                                :class="{ 'input-erro': errosCampos.senha }"
                                @input="errosCampos.senha = false"
                            />
                            <button
                                type="button"
                                class="botao-alterar-item"
                                :disabled="enviandoCodigo"
                                @click="solicitarValidacao('senha')"
                            >
                                Alterar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="cartao-secao">
                    <h2 class="titulo-secao">Informações pessoais</h2>
                    
                    <div class="grid-informacoes-pessoais">
                        <div class="grupo-campo-info">
                            <label class="label-info">Data de nascimento</label>
                            <div class="input-com-icone-container wrapper-calendario-interativo" @click="abrirSeletorData">
                                <img src="../../public/icon_calendario.png" alt="Calendário" class="icone-input-esquerdo" />
                                <input 
                                    type="date" 
                                    ref="inputDataRef"
                                    v-model="dadosAcesso.dataNascimento" 
                                    :min="dataMinimaPermitida"
                                    :max="dataMaximaPermitida"
                                    :disabled="!camposDesbloqueados.dataNascimento" 
                                    class="input-personalizado input-data-custom" 
                                    :class="{ 'input-erro': errosCampos.dataNascimento || erroIdadeInvalida }"
                                    @change="tratarMudancaData"
                                />
                                <button
                                    type="button"
                                    class="botao-alterar-item"
                                    :disabled="enviandoCodigo"
                                    @click.stop="solicitarValidacao('dataNascimento')"
                                >
                                    Alterar
                                </button>
                            </div>
                            <span v-if="erroIdadeInvalida" class="texto-erro-input">A idade deve estar entre 10 e 140 anos.</span>
                        </div>
                        <div class="card-privacidade-info">
                            <div class="privacidade-icone-titulo">
                                <img src="../../public/icon_escudo.png" alt="Escudo" class="icone-escudo" />
                                <span>Privacidade</span>
                            </div>
                            <p class="privacidade-texto">
                                Sua data de nascimento não aparece no seu perfil público. Usamos apenas para privacidade e verificação da conta.
                            </p>
                        </div>
                    </div>

                    <p class="aviso-rodape-info">
                        Para alterar a senha ou a data de nascimento, enviaremos um código de confirmação para o e-mail atual. Ao informar um novo e-mail, enviaremos outro código para confirmar o novo endereço antes de salvar as alterações.
                    </p>
                </div>

                <p v-if="mensagemErroGeral" class="texto-erro-geral">{{ mensagemErroGeral }}</p>

                <div v-if="passouValidacao" class="acoes-formulario">
                    <button type="button" class="btn-cancelar" @click="voltarPerfil">Cancelar</button>
                    <button type="button" class="btn-salvar" :disabled="salvando" @click="salvarInformacoes">
                        {{ salvando ? 'Salvando...' : 'Salvar' }}
                    </button>
                </div>
            </div>
        </main>

        <div v-if="modalValidacaoAberto" class="modal-overlay" @click.self="fecharModal">
            <div class="modal-card-validacao">
                <button class="close-btn" @click="fecharModal" aria-label="Fechar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="modal-conteudo-interno">
                    <div class="success-icon-circle">
                        <img src="../../public/icon_email_perfil.png" alt="E-mail" class="icone-modal-email" />
                    </div>

                    <span class="success-subtitle">
                        CONFIRMAR ALTERAÇÃO
                    </span>
                    <h2 class="success-title">Digite o código</h2>

                    <p class="success-desc">
                        Enviamos um código de 6 dígitos para <br />
                        <strong>{{ emailAlvoValidacao }}</strong>
                    </p>

                    <div class="codigo-inputs-container" @paste.prevent="tratarColarCodigo">
                        <input 
                            v-for="(digito, index) in codigoValidacao" 
                            :key="index" 
                            type="text" 
                            inputmode="numeric"
                            maxlength="1" 
                            v-model="codigoValidacao[index]" 
                            @input="tratarInputCodigo(index, $event)"
                            @keydown.backspace="tratarBackspaceCodigo(index, $event)"
                            class="input-digito-codigo"
                            :class="{ 'input-digito-erro': erroCodigoValidacao }"
                        />
                    </div>

                    <span v-if="erroCodigoValidacao" class="texto-erro-modal">{{ textoErroModal }}</span>

                    <span class="expiracao-texto">O código expira em 10 minutos.</span>

                    <div class="reenviar-container">
                        <span>Não recebeu o código? </span>
                        <button 
                            type="button" 
                            class="link-reenviar" 
                            :class="{ 'disabled-reenviar': tempoRestanteReenvio > 0 || enviandoCodigo }"
                            @click="reenviarCodigo"
                        >
                            {{ tempoRestanteReenvio > 0 ? `Reenviar código (${tempoRestanteReenvio}s)` : 'Reenviar código' }}
                        </button>
                    </div>

                    <button
                        type="button"
                        class="btn-confirmar-continuar"
                        :disabled="validandoCodigo"
                        @click="confirmarCodigoValidacao"
                    >
                        {{ validandoCodigo ? 'Verificando...' : 'Confirmar e continuar' }}
                    </button>
                    <span class="rodape-aviso-modal">O código será solicitado ao alterar dados de acesso ou nascimento.</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import { authService } from '@/services/authService'
import {
    getUsuarioLogado,
    putUsuarioLogado,
    postSolicitarAlteracaoEmail,
    postConfirmarAlteracaoEmail
} from '@/services/usuarios'
import { postRecuperarSenha, postVerificarCodigoReset, postRedefinirSenha } from '@/services/auth'

const router = useRouter()

const modalValidacaoAberto = ref(false)
const campoEmValidacao = ref(null)
const ultimoTempoValidacao = ref(null)
const ultimoCodigoValidado = ref('')
const tempoExpiracaoMinutos = 5

const passouValidacao = ref(false)
const erroCodigoValidacao = ref(false)
const textoErroModal = ref('Por favor, preencha todos os dígitos do código.')
const erroEmailInvalido = ref(false)
const erroIdadeInvalida = ref(false)
const mensagemErroGeral = ref('')

const enviandoCodigo = ref(false)
const validandoCodigo = ref(false)
const salvando = ref(false)

const emailOriginal = ref('')
const dataNascimentoOriginal = ref('')
const emailAlvoValidacao = ref('')
const senhaAtualEmail = ref('')
const emailNovoPendente = ref('')
const continuarSalvamentoAposEmail = ref(false)
const tempoRestanteReenvio = ref(40)
let timerReenvio = null

const inputDataRef = ref(null)
const dadosAcesso = reactive({ email: '', senha: '', dataNascimento: '' })
const errosCampos = reactive({ email: false, senha: false, dataNascimento: false })
const senhaOcultaPlaceholder = '••••••••••••'
const mostrarSenhaTexto = ref(false)
const camposDesbloqueados = reactive({ email: false, senha: false, dataNascimento: false })
const codigoValidacao = ref(['', '', '', '', '', ''])

const dataMinimaPermitida = computed(() => {
    const hoje = new Date()
    return `${hoje.getFullYear() - 140}-01-01`
})

const dataMaximaPermitida = computed(() => {
    const hoje = new Date()
    const ano = hoje.getFullYear() - 10
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
})

const obterIdUsuarioLogado = () => {
    const idAutenticado = authService.getUserId?.()
    if (idAutenticado) return Number(idAutenticado)
    const user = authService.getUser?.()
    return user?.id ?? user?.id_usuario ?? user?.usuario?.id ?? null
}

const formatarDataParaInput = (valor) => {
    if (!valor) return ''
    const texto = String(valor)
    if (/^\d{4}-\d{2}-\d{2}/.test(texto)) return texto.slice(0, 10)
    const parsed = new Date(texto)
    if (Number.isNaN(parsed.getTime())) return ''
    const ano = parsed.getFullYear()
    const mes = String(parsed.getMonth() + 1).padStart(2, '0')
    const dia = String(parsed.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

const carregarDadosUsuario = async () => {
    if (!obterIdUsuarioLogado()) {
        router.push('/')
        return
    }

    try {
        const resposta = await getUsuarioLogado()
        const raw = resposta?.response?.usuario ?? resposta?.usuario ?? resposta?.data ?? resposta ?? {}
        emailOriginal.value = raw.email ?? ''
        dataNascimentoOriginal.value = formatarDataParaInput(raw.data_nascimento ?? raw.dataNascimento)
        dadosAcesso.email = emailOriginal.value
        dadosAcesso.dataNascimento = dataNascimentoOriginal.value
        emailAlvoValidacao.value = emailOriginal.value
    } catch (error) {
        mensagemErroGeral.value = error.message || 'Erro ao carregar suas informações.'
    }
}

onMounted(carregarDadosUsuario)

const iniciarTimerReenvio = () => {
    tempoRestanteReenvio.value = 40
    if (timerReenvio) clearInterval(timerReenvio)
    timerReenvio = setInterval(() => {
        if (tempoRestanteReenvio.value > 0) tempoRestanteReenvio.value--
        else clearInterval(timerReenvio)
    }, 1000)
}

onUnmounted(() => {
    if (timerReenvio) clearInterval(timerReenvio)
})

const voltarPerfil = () => router.push('/perfil')
const sairDaConta = () => {
    authService.logout()
    router.push('/')
}

const abrirSeletorData = () => {
    if (!camposDesbloqueados.dataNascimento || !inputDataRef.value) return
    if (typeof inputDataRef.value.showPicker === 'function') inputDataRef.value.showPicker()
    else inputDataRef.value.focus()
}

const validarIdade = (dataStr) => {
    if (!dataStr) return false
    const nascimento = new Date(`${dataStr}T00:00:00`)
    if (Number.isNaN(nascimento.getTime()) || nascimento > new Date()) return false
    const hoje = new Date()
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--
    return idade >= 10 && idade <= 140
}

const tratarMudancaEmail = () => {
    errosCampos.email = false
    erroEmailInvalido.value = false
    mensagemErroGeral.value = ''
}

const tratarMudancaData = () => {
    errosCampos.dataNascimento = false
    erroIdadeInvalida.value = !validarIdade(dadosAcesso.dataNascimento)
    if (erroIdadeInvalida.value) errosCampos.dataNascimento = true
    mensagemErroGeral.value = ''
}

const verificarSePrecisaValidar = () => {
    if (!ultimoTempoValidacao.value) return true
    const minutos = (Date.now() - ultimoTempoValidacao.value) / 60000
    return minutos > tempoExpiracaoMinutos
}

const enviarCodigoParaEmailAtual = async () => {
    if (!emailOriginal.value) throw new Error('E-mail atual não encontrado para enviar o código.')
    await postRecuperarSenha({ email: emailOriginal.value })
}

const solicitarValidacao = async (campo) => {
    mensagemErroGeral.value = ''
    campoEmValidacao.value = campo
    if (!verificarSePrecisaValidar()) {
        desbloquearCampo(campo)
        return
    }

    enviandoCodigo.value = true
    try {
        await enviarCodigoParaEmailAtual()
        emailAlvoValidacao.value = emailOriginal.value
        erroCodigoValidacao.value = false
        codigoValidacao.value = ['', '', '', '', '', '']
        modalValidacaoAberto.value = true
        iniciarTimerReenvio()
    } catch (error) {
        mensagemErroGeral.value = error.message || 'Erro ao enviar o código de verificação para seu e-mail.'
    } finally {
        enviandoCodigo.value = false
    }
}

const desbloquearCampo = (campo) => {
    camposDesbloqueados[campo] = true
    passouValidacao.value = true
    if (campo === 'senha') {
        dadosAcesso.senha = ''
        mostrarSenhaTexto.value = true
    }
}

const fecharModal = () => {
    modalValidacaoAberto.value = false
    erroCodigoValidacao.value = false
    codigoValidacao.value = ['', '', '', '', '', '']
    if (timerReenvio) clearInterval(timerReenvio)
}

const tratarInputCodigo = (index, event) => {
    erroCodigoValidacao.value = false
    const valor = event.target.value.replace(/\D/g, '')
    codigoValidacao.value[index] = valor.slice(-1)
    if (codigoValidacao.value[index] && index < 5) event.target.nextElementSibling?.focus()
}

const tratarBackspaceCodigo = (index, event) => {
    if (!codigoValidacao.value[index] && index > 0) event.target.previousElementSibling?.focus()
}

const tratarColarCodigo = (event) => {
    const texto = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || ''
    if (!texto) return
    erroCodigoValidacao.value = false
    for (let i = 0; i < 6; i++) codigoValidacao.value[i] = texto[i] || ''
}

const reenviarCodigo = async () => {
    if (tempoRestanteReenvio.value > 0 || enviandoCodigo.value) return
    enviandoCodigo.value = true
    erroCodigoValidacao.value = false
    try {
        if (campoEmValidacao.value === 'emailNovo') {
            const resposta = await postSolicitarAlteracaoEmail({
                email: emailNovoPendente.value,
                senha: senhaAtualEmail.value
            })
            if (resposta?.response?.email_enviado === false) {
                throw new Error('Não foi possível enviar o código para o novo e-mail.')
            }
        } else {
            await enviarCodigoParaEmailAtual()
        }
        iniciarTimerReenvio()
    } catch (error) {
        textoErroModal.value = error.message || 'Erro ao reenviar o código.'
        erroCodigoValidacao.value = true
    } finally {
        enviandoCodigo.value = false
    }
}

const confirmarCodigoValidacao = async () => {
    const codigo = codigoValidacao.value.join('')
    if (!/^\d{6}$/.test(codigo)) {
        textoErroModal.value = 'Por favor, preencha todos os dígitos do código.'
        erroCodigoValidacao.value = true
        return
    }

    validandoCodigo.value = true
    erroCodigoValidacao.value = false
    try {
        if (campoEmValidacao.value === 'emailNovo') {
            const resposta = await postConfirmarAlteracaoEmail({ codigo })
            const emailConfirmado = resposta?.response?.email || emailNovoPendente.value
            emailOriginal.value = emailConfirmado
            dadosAcesso.email = emailConfirmado
            emailAlvoValidacao.value = emailConfirmado
            const usuarioAtual = authService.getUser() || {}
            authService.setUser({ ...usuarioAtual, email: emailConfirmado })
            ultimoTempoValidacao.value = Date.now()
            emailNovoPendente.value = ''
            senhaAtualEmail.value = ''
            errosCampos.email = false
            erroEmailInvalido.value = false
            modalValidacaoAberto.value = false
            codigoValidacao.value = ['', '', '', '', '', '']
            if (timerReenvio) clearInterval(timerReenvio)
            const continuar = continuarSalvamentoAposEmail.value
            continuarSalvamentoAposEmail.value = false
            if (continuar) await concluirSalvamento()
        } else {
            await postVerificarCodigoReset({ email: emailOriginal.value, codigo })
            ultimoCodigoValidado.value = codigo
            ultimoTempoValidacao.value = Date.now()
            modalValidacaoAberto.value = false
            desbloquearCampo(campoEmValidacao.value)
            codigoValidacao.value = ['', '', '', '', '', '']
            if (timerReenvio) clearInterval(timerReenvio)
        }
    } catch (error) {
        textoErroModal.value = error.message || 'Código inválido ou expirado.'
        erroCodigoValidacao.value = true
    } finally {
        validandoCodigo.value = false
    }
}

const concluirSalvamento = async () => {
    salvando.value = true
    try {
        const senhaAlterada = camposDesbloqueados.senha
        const dataAlterada = camposDesbloqueados.dataNascimento && dadosAcesso.dataNascimento !== dataNascimentoOriginal.value

        if (senhaAlterada) {
            await postRedefinirSenha({
                email: emailOriginal.value,
                nova_senha: dadosAcesso.senha,
                confirmar_senha: dadosAcesso.senha,
                codigo: ultimoCodigoValidado.value
            })
            ultimoCodigoValidado.value = ''
            ultimoTempoValidacao.value = null
        }
        if (dataAlterada) {
            await putUsuarioLogado({ data_nascimento: dadosAcesso.dataNascimento })
        }
        router.push('/perfil')
    } catch (error) {
        mensagemErroGeral.value = error.message || 'Erro ao salvar as informações.'
    } finally {
        salvando.value = false
    }
}

const salvarInformacoes = async () => {
    mensagemErroGeral.value = ''
    const senhaAlterada = camposDesbloqueados.senha
    const dataAlterada = camposDesbloqueados.dataNascimento && dadosAcesso.dataNascimento !== dataNascimentoOriginal.value
    const emailAlterado = camposDesbloqueados.email && dadosAcesso.email.trim() !== emailOriginal.value
    const emailNovo = dadosAcesso.email.trim()

    if (emailAlterado && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNovo)) {
        errosCampos.email = true
        erroEmailInvalido.value = true
        return
    }
    if (emailAlterado && !senhaAtualEmail.value.trim()) {
        errosCampos.email = true
        mensagemErroGeral.value = 'Informe sua senha atual para solicitar a troca de e-mail.'
        return
    }
    if (senhaAlterada && (!dadosAcesso.senha.trim() || dadosAcesso.senha.trim().length < 6)) {
        errosCampos.senha = true
        mensagemErroGeral.value = 'A nova senha deve ter pelo menos 6 caracteres.'
        return
    }
    if (senhaAlterada && dadosAcesso.senha.length > 15) {
        errosCampos.senha = true
        mensagemErroGeral.value = 'A nova senha deve ter no máximo 15 caracteres.'
        return
    }
    if (dataAlterada && (!dadosAcesso.dataNascimento.trim() || !validarIdade(dadosAcesso.dataNascimento))) {
        errosCampos.dataNascimento = true
        erroIdadeInvalida.value = true
        mensagemErroGeral.value = 'Informe uma data de nascimento válida.'
        return
    }
    if (!emailAlterado && !senhaAlterada && !dataAlterada) {
        router.push('/perfil')
        return
    }

    if (verificarSePrecisaValidar()) {
        campoEmValidacao.value = emailAlterado ? 'email' : (senhaAlterada ? 'senha' : 'dataNascimento')
        salvando.value = true
        try {
            await enviarCodigoParaEmailAtual()
            emailAlvoValidacao.value = emailOriginal.value
            erroCodigoValidacao.value = false
            codigoValidacao.value = ['', '', '', '', '', '']
            modalValidacaoAberto.value = true
            iniciarTimerReenvio()
        } catch (error) {
            mensagemErroGeral.value = error.message || 'Erro ao enviar o código de verificação para seu e-mail.'
        } finally {
            salvando.value = false
        }
        return
    }

    if (emailAlterado) {
        salvando.value = true
        try {
            const resposta = await postSolicitarAlteracaoEmail({
                email: emailNovo,
                senha: senhaAtualEmail.value
            })
            if (resposta?.response?.email_enviado === false) {
                throw new Error('Não foi possível enviar o código para o novo e-mail.')
            }
            emailNovoPendente.value = emailNovo
            continuarSalvamentoAposEmail.value = true
            campoEmValidacao.value = 'emailNovo'
            emailAlvoValidacao.value = emailNovo
            erroCodigoValidacao.value = false
            codigoValidacao.value = ['', '', '', '', '', '']
            modalValidacaoAberto.value = true
            iniciarTimerReenvio()
        } catch (error) {
            mensagemErroGeral.value = error.message || 'Não foi possível enviar o código para o novo e-mail.'
        } finally {
            salvando.value = false
        }
        return
    }

    await concluirSalvamento()
}

</script>

<style scoped>
.perfil-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--cinza-claro);
}

.cabecalho-sair {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.conteudo-principal {
    flex: 1;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 40px;
}

.topo-pagina {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background-color: var(--verde);
}

.botao-icone-1 {
    background-color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    color: var(--marrom);
    transition: background-color 0.2s, transform 0.2s;
}

.botao-sair {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.header-titles {
    display: none;
}

.icone-sair {
    width: 35px;
    height: auto;
    object-fit: contain;
}

.conteudo-container {
    padding: 40px;
    max-width: 1000px;
    width: 100%;
    box-sizing: border-box;
    align-self: center;
}

.cabecalho-titulo {
    margin-bottom: 24px;
}

.cabecalho-titulo h1 {
    font-family: "Inter", sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--marrom);
    margin-bottom: 4px;
}

.cabecalho-titulo p {
    font-size: 14px;
    color: var(--cinza);
}

.cartao-secao {
    background-color: #FFFFFF;
    border-radius: 20px;
    border: 1px solid var(--bege);
    padding: 32px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 24px;
}

.titulo-secao {
    font-size: 18px;
    font-weight: 700;
    color: var(--marrom);
    font-family: "Inter", sans-serif;
}

.grupo-campo-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.label-info {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.input-com-icone-container {
    position: relative;
    display: flex;
    align-items: center;
}

.wrapper-calendario-interativo {
    cursor: pointer;
}

.icone-input-esquerdo {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    object-fit: contain;
    pointer-events: none;
}

.input-personalizado {
    width: 100%;
    padding: 12px 74px 12px 46px;
    border: 1px solid var(--cinza-branco);
    border-radius: 12px;
    font-size: 14px;
    font-family: "Inter", sans-serif;
    outline: none;
    background-color: #FFFFFF;
    color: var(--marrom);
    transition: border-color 0.2s;
}

.input-data-custom::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
}

.input-personalizado:focus {
    border-color: var(--verde-escuro);
}

.input-personalizado:disabled {
    background-color: #FAF8F5;
    color: var(--marrom);
    cursor: default;
}

.input-erro {
    border-color: var(--vermelho) !important;
}

.campo-senha-email {
    margin-top: 12px;
}

.texto-erro-input,
.texto-erro-geral {
    font-size: 12px;
    color: var(--vermelho);
    font-weight: 500;
}

.texto-erro-geral {
    font-size: 13px;
    margin-bottom: 12px;
}

.botao-alterar-item {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    color: var(--verde-escuro);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    z-index: 2;
}

.botao-alterar-item:hover:not(:disabled) {
    text-decoration: underline;
}

.botao-alterar-item:disabled {
    opacity: 0.6;
    cursor: wait;
}

.grid-informacoes-pessoais {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: center;
}

.card-privacidade-info {
    background-color: #FAF8F5;
    border: 1px solid var(--bege);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 20px;
}

.privacidade-icone-titulo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: var(--marrom);
}

.icone-escudo {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.privacidade-texto {
    font-size: 13px;
    color: var(--cinza);
    margin: 0;
}

.aviso-rodape-info {
    font-size: 12px;
    color: var(--cinza);
    margin-top: 8px;
}

.acoes-formulario {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.btn-cancelar {
    background: #FFFFFF;
    border: 1px solid var(--cinza-branco);
    color: var(--marrom);
    padding: 10px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-cancelar:hover {
    background-color: var(--bege);
}

.btn-salvar {
    background-color: var(--verde);
    border: none;
    color: #FFFFFF;
    padding: 10px 28px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-salvar:hover:not(:disabled) {
    background-color: var(--verde-escuro);
}

.btn-salvar:disabled {
    opacity: 0.7;
    cursor: wait;
}

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

.modal-card-validacao {
    background-color: #FFFFFF;
    border-radius: 20px;
    width: 100%;
    max-width: 480px;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    padding: 40px 32px;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--cinza);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: var(--cinza-claro);
}

.modal-conteudo-interno {
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

.icone-modal-email {
    width: 28px;
    height: 28px;
    object-fit: contain;
}

.success-subtitle {
    font-size: 11px;
    font-weight: 700;
    color: var(--verde-escuro);
    letter-spacing: 0.6px;
    margin-bottom: 6px;
}

.success-title {
    font-family: "Playfair Display", serif;
    font-size: 26px;
    color: var(--marrom);
    margin: 0 0 12px 0;
    font-weight: 700;
}

.success-desc {
    font-size: 14px;
    color: var(--cinza);
    line-height: 1.5;
    margin: 0 0 24px 0;
}

.codigo-inputs-container {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
}

.input-digito-codigo {
    width: 45px;
    height: 50px;
    border: 1px solid var(--cinza-branco);
    border-radius: 10px;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: var(--marrom);
    outline: none;
    transition: border-color 0.2s;
}

.input-digito-codigo:focus {
    border-color: var(--verde-escuro);
}

.input-digito-erro {
    border-color: var(--vermelho) !important;
}

.texto-erro-modal {
    font-size: 12px;
    color: var(--vermelho);
    margin-bottom: 8px;
    font-weight: 500;
}

.expiracao-texto {
    font-size: 12px;
    color: var(--cinza);
    margin-bottom: 16px;
}

.reenviar-container {
    font-size: 13px;
    color: var(--cinza);
    margin-bottom: 24px;
}

.link-reenviar {
    background: none;
    border: none;
    color: var(--verde-escuro);
    font-weight: 600;
    cursor: pointer;
    padding: 0;
}

.link-reenviar.disabled-reenviar {
    color: var(--cinza);
    cursor: not-allowed;
    text-decoration: none !important;
}

.link-reenviar:hover:not(.disabled-reenviar) {
    text-decoration: underline;
}

.btn-confirmar-continuar {
    width: 100%;
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-bottom: 12px;
}

.btn-confirmar-continuar:hover:not(:disabled) {
    background-color: var(--verde-escuro);
}

.btn-confirmar-continuar:disabled {
    opacity: 0.7;
    cursor: wait;
}

.rodape-aviso-modal {
    font-size: 11px;
    color: var(--cinza);
}

@media (max-width: 768px) {
    .perfil-layout {
        flex-direction: column;
    }

    .conteudo-principal {
        margin-left: 0;
        padding-bottom: 24px;
    }

    .topo-pagina {
        padding: 16px;
    }

    .conteudo-container {
        padding: 16px;
        margin-top: 20px;
    }

    .cartao-secao {
        padding: 20px 16px;
    }

    .grid-informacoes-pessoais {
        grid-template-columns: 1fr;
        gap: 0;
    }

    .card-privacidade-info {
        margin-top: 16px;
    }

    .modal-card-validacao {
        padding: 24px 16px;
    }

    .codigo-inputs-container {
        gap: 6px;
    }

    .input-digito-codigo {
        width: 38px;
        height: 44px;
        font-size: 18px;
    }

    .none {
        display: none;
    }
}

@media (max-width: 480px) {
    .perfil-layout,
    .conteudo-principal,
    .conteudo-container {
        background-color: #fcfaf6;
    }

    .conteudo-principal {
        margin-left: 0;
        padding-bottom: 80px;
    }

    .topo-pagina.none {
        display: flex !important;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background-color: #ffffff;
        border-bottom: 1px solid var(--bege);
        justify-content: start;
        margin-bottom: 15px;
    }

    .botao-icone-1 {
        background: transparent;
        box-shadow: none;
        width: 32px;
        height: 32px;
        color: #4a2512;
    }

    .header-titles h2 {
        font-size: 18px;
        font-weight: 700;
        color: #3b2219;
        margin: 0;
    }

    .header-titles p {
        font-size: 11px;
        color: #8c827a;
        margin: 1px 0 0 0;
    }

    .cabecalho-sair {
        display: none;
    }

    .conteudo-container {
        padding: 16px 16px 40px 16px;
        margin-top: 0;
    }

    .cartao-secao {
        background: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        margin-bottom: 24px;
        gap: 16px;
    }

    .titulo-secao {
        font-size: 15px;
        font-weight: 700;
        color: #3b2219;
    }

    .grupo-campo-info {
        gap: 6px;
    }

    .label-info {
        font-size: 13px;
        color: #4a2512;
    }

    .icone-input-esquerdo {
        display: none;
    }

    .input-personalizado {
        padding: 12px 70px 12px 14px;
        background-color: #ffffff;
        border: 1px solid #efeae1;
        border-radius: 12px;
        font-size: 13px;
        color: #4a2512;
    }

    .botao-alterar-item {
        right: 14px;
        color: #72bca5;
        font-size: 13px;
        font-weight: 600;
    }

    .grid-informacoes-pessoais {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .card-privacidade-info {
        background-color: #f7f3ed;
        border: 1px solid #efeae1;
        border-radius: 14px;
        padding: 14px;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        margin-top: 0;
    }

    .privacidade-icone-titulo {
        display: flex;
        align-items: center;
    }

    .privacidade-icone-titulo span {
        display: none;
    }

    .icone-escudo {
        width: 20px;
        height: 20px;
    }

    .privacidade-texto {
        font-size: 12px;
        color: #6e655f;
        line-height: 1.4;
    }

    .header-titles {
        display: block;
    }

    .aviso-rodape-info {
        font-size: 11px;
        color: #8c827a;
        line-height: 1.4;
        margin-top: 12px;
    }
}
</style>