// ================= Variáveis Globais =================
let questoes = [];
let perguntaAtual = 0;
let pontuacao = 0;
let respostasUsuario = [];
let tempoInicio = 0;
let usuarioAtual = window.armazenamentoQuiz.obterUsuarioAtual();
let niveisQuiz = [];
let totalPerguntas = 0;
let perguntaRespondida = false; // NOVA VARIÁVEL

const ordemNiveis = ['Fácil', 'Médio', 'Difícil', 'Extremo'];

// ================= Carregar questões =================
// Busca as perguntas do arquivo JSON e inicia o quiz.
async function carregarQuestoes() {
    try {
        const resposta = await fetch('./src/data/dados.json');
        const dados = await resposta.json();
        questoes = dados.questoes.slice().sort((a, b) => a.id - b.id);
        inicializarQuiz();
    } catch (erro) {
        console.error('Erro ao carregar questões:', erro);
    }
}

// ================= Inicializar Quiz =================
// Reinicia o estado do jogo e prepara a primeira pergunta.
function inicializarQuiz() {
    tempoInicio = Date.now();
    perguntaAtual = 0;
    pontuacao = 0;
    respostasUsuario = [];
    totalPerguntas = questoes.length;
    niveisQuiz = ordemNiveis
        .map(nome => ({
            nome,
            quantidade: questoes.filter(questao => questao.categoria === nome).length
        }))
        .filter(nivel => nivel.quantidade > 0);

    document.getElementById('totalPerguntas').textContent = totalPerguntas;
    const btnProxima = document.getElementById('btnProxima');

btnProxima.addEventListener('click', () => {
    if (!btnProxima.disabled) {
        proximaPergunta();
    }
});
    criarBarraProgresso();
    exibirPergunta();
}

// ================= Exibir Pergunta =================
// Renderiza a pergunta atual e suas opções na tela.
function exibirPergunta() {
    if (perguntaAtual >= questoes.length) {
        finalizarQuiz();
        return;
    }

    perguntaRespondida = false; // Reset da trava de clique

    const pergunta = questoes[perguntaAtual];

    // Atualizar texto da pergunta
    document.getElementById('perguntaAtual').textContent = perguntaAtual + 1;
    document.getElementById('categoriaPergunta').textContent = pergunta.categoria;
    document.getElementById('perguntaTitulo').textContent = pergunta.pergunta;

    // Atualizar opções
    const opcoesContainer = document.getElementById('opcoesContainer');
    opcoesContainer.innerHTML = '';
    pergunta.opcoes.forEach((opcao, indice) => {
        const botaoOpcao = document.createElement('button');
        botaoOpcao.className = 'opcao-botao';
        botaoOpcao.textContent = opcao;
        botaoOpcao.onclick = () => selecionarOpcao(indice, botaoOpcao);
        opcoesContainer.appendChild(botaoOpcao);
    });

    document.getElementById('btnProxima').disabled = true;
    atualizarBarraProgresso();

  // ✅ Atualizar imagem de fundo
const fundoQuiz = document.getElementById('fundoQuiz');

if (pergunta.imagemFundo) {
    fundoQuiz.style.backgroundImage = `url('${pergunta.imagemFundo}')`;
} else {
    fundoQuiz.style.backgroundImage = '';
}
}

// ================= Selecionar Opção =================
// Marca a opção escolhida, atualiza a pontuação e salva as respostas.
function selecionarOpcao(indice, elemento) {
    if (perguntaRespondida) return; // Bloqueia múltiplos cliques
    perguntaRespondida = true;

    const pergunta = questoes[perguntaAtual];
    const botoes = document.querySelectorAll('.opcao-botao');

    const estaCorreto = indice === pergunta.respostaCorreta;
    elemento.classList.add('selecionado');

    if (estaCorreto) {
        elemento.classList.add('correto');
        pontuacao += 10;
    } else {
        elemento.classList.add('incorreto');
        botoes[pergunta.respostaCorreta].classList.add('correto');
    }

    respostasUsuario[perguntaAtual] = {
        resposta: indice,
        correta: estaCorreto
    };

    window.armazenamentoQuiz.registrarRespostas(respostasUsuario);

    botoes.forEach(botao => {
        botao.disabled = true;
        botao.style.cursor = 'not-allowed';
    });

    document.getElementById('btnProxima').disabled = false;
}

// ================= Próxima Pergunta =================
// Avança para a próxima pergunta do quiz.
function proximaPergunta() {
    perguntaAtual++;
    exibirPergunta();
}

// ================= Voltar para início =================
// Confirma a saída do quiz e retorna para a página inicial.
function voltarParaInicio() {
    if (confirm('Deseja sair do quiz? Seu progresso será perdido.')) {
        window.location.href = 'index.html';
    }
}

// ================= Finalizar Quiz =================
// Monta o resultado final e salva tudo na sessão.
function finalizarQuiz() {
    const tempoFim = Date.now();
    const tempoTotal = Math.floor((tempoFim - tempoInicio) / 1000);

    const resultado = {
        usuario: usuarioAtual,
        data: new Date().toLocaleDateString('pt-BR'),
        pontuacao: pontuacao,
        tempo: tempoTotal,
        respostas: respostasUsuario
    };

    window.armazenamentoQuiz.registrarResultado(resultado);
    window.location.href = 'resultado.html';
}

// ================= Barra de Progresso =================
// Cria a barra visual de progresso por níveis.
function criarBarraProgresso() {
    const container = document.getElementById('barraProgresso');
    container.innerHTML = '';

    const trilho = document.createElement('div');
    trilho.className = 'trilho-progresso';

    niveisQuiz.forEach((nivel, indice) => {
        const segmento = document.createElement('div');
        segmento.className = 'segmento-progresso';
        segmento.style.flexGrow = nivel.quantidade;
        segmento.dataset.indice = indice;

        const preenchimento = document.createElement('div');
        preenchimento.className = 'segmento-preenchimento';
        segmento.appendChild(preenchimento);

        trilho.appendChild(segmento);
    });

    const marcadores = document.createElement('div');
    marcadores.className = 'marcadores-progresso';
    const totalEtapas = niveisQuiz.length;

    for (let indice = 0; indice < totalEtapas; indice++) {
        const marcador = document.createElement('div');
        marcador.className = 'marcador-fase';
        marcador.id = `marcador-fase-${indice}`;
        const posicao = totalEtapas === 1 ? 0 : (indice / (totalEtapas - 1)) * 100;
        marcador.style.left = `${posicao}%`;
        marcador.textContent = String(indice + 1);
        marcadores.appendChild(marcador);
    }

    const marcadorAtivo = document.createElement('div');
    marcadorAtivo.className = 'marcador-ativo';
    marcadorAtivo.id = 'marcadorAtivo';
    marcadores.appendChild(marcadorAtivo);

    const rastroConcluido = document.createElement('div');
    rastroConcluido.className = 'rastro-concluido';
    rastroConcluido.id = 'rastroConcluido';
    container.appendChild(rastroConcluido);

    container.appendChild(trilho);
    container.appendChild(marcadores);
}

// Descobre em qual nível a pergunta atual está localizada.
function obterNivelAtual(indicePergunta) {
    let acumulado = 0;

    for (let indice = 0; indice < niveisQuiz.length; indice++) {
        const nivel = niveisQuiz[indice];
        const limite = acumulado + nivel.quantidade;

        if (indicePergunta < limite) {
            return {
                indice,
                nivel,
                indiceNoNivel: indicePergunta - acumulado,
                limiteInicial: acumulado,
                limiteFinal: limite
            };
        }

        acumulado = limite;
    }

    const ultimoIndice = niveisQuiz.length - 1;
    return {
        indice: ultimoIndice,
        nivel: niveisQuiz[ultimoIndice],
        indiceNoNivel: niveisQuiz[ultimoIndice].quantidade - 1,
        limiteInicial: totalPerguntas - niveisQuiz[ultimoIndice].quantidade,
        limiteFinal: totalPerguntas
    };
}

// Atualiza os segmentos e o marcador da barra de progresso.
function atualizarBarraProgresso() {
    const nivelAtual = obterNivelAtual(perguntaAtual);
    const nivelAtivo = nivelAtual.indice;
    const totalNiveis = niveisQuiz.length;

    const rastroConcluido = document.getElementById('rastroConcluido');
    const larguraConcluida = totalNiveis > 1 ? (nivelAtivo / (totalNiveis - 1)) * 100 : 0;
    rastroConcluido.style.width = `${larguraConcluida}%`;

    document.querySelectorAll('.segmento-progresso').forEach((segmento, indice) => {
        const preenchimento = segmento.querySelector('.segmento-preenchimento');
        preenchimento.style.width = indice < nivelAtivo ? '100%' : '0%';
    });

    const marcadorAtivo = document.getElementById('marcadorAtivo');
    const posicaoMarcador = totalNiveis > 1 ? (nivelAtivo / (totalNiveis - 1)) * 100 : 0;
    marcadorAtivo.style.left = `${posicaoMarcador}%`;
    marcadorAtivo.textContent = String(nivelAtivo + 1);
}



// ================= Inicializar ao carregar a página =================
// Dispara o carregamento inicial do quiz quando a página abre.
window.addEventListener('load', carregarQuestoes);