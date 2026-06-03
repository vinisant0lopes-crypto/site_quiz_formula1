let questoes = [];
let perguntaAtual = 0;
let pontuacao = 0;
let respostasUsuario = [];
let tempoInicio = 0;
let usuarioAtual = localStorage.getItem('usuarioAtual') || 'Anônimo';
let niveisQuiz = [];
let totalPerguntas = 0;

const ordemNiveis = ['Fácil', 'Médio', 'Difícil', 'Extremo'];

// Carregar questões do arquivo JSON
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
    criarBarraProgresso();
    exibirPergunta();
}

function exibirPergunta() {
    if (perguntaAtual >= questoes.length) {
        finalizarQuiz();
        return;
    }

    const pergunta = questoes[perguntaAtual];
    
    // Atualizar número da pergunta
    document.getElementById('perguntaAtual').textContent = perguntaAtual + 1;
    
    // Atualizar categoria
    document.getElementById('categoriaPergunta').textContent = pergunta.categoria;
    
    // Atualizar título da pergunta
    document.getElementById('perguntaTitulo').textContent = pergunta.pergunta;
    
    // Limpar opções anteriores
    const opcoesContainer = document.getElementById('opcoesContainer');
    opcoesContainer.innerHTML = '';
    
    // Criar botões para as opções
    pergunta.opcoes.forEach((opcao, indice) => {
        const botaoOpcao = document.createElement('button');
        botaoOpcao.className = 'opcao-botao';
        botaoOpcao.textContent = opcao;
        botaoOpcao.onclick = () => selecionarOpcao(indice, botaoOpcao);
        opcoesContainer.appendChild(botaoOpcao);
    });
    
    // Desabilitar botão de próxima
    document.getElementById('btnProxima').disabled = true;
    
    // Atualizar barra de progresso
    atualizarBarraProgresso();
}

function selecionarOpcao(indice, elemento) {
    // Remover seleção anterior
    document.querySelectorAll('.opcao-botao').forEach(btn => {
        btn.classList.remove('selecionado', 'correto', 'incorreto');
    });
    
    // Marcar opção selecionada
    elemento.classList.add('selecionado');
    
    // Verificar se a resposta está correta
    const pergunta = questoes[perguntaAtual];
    const estaCorreto = indice === pergunta.respostaCorreta;
    
    if (estaCorreto) {
        elemento.classList.add('correto');
        pontuacao += 10;
    } else {
        elemento.classList.add('incorreto');
        // Mostrar resposta correta
        document.querySelectorAll('.opcao-botao')[pergunta.respostaCorreta].classList.add('correto');
    }
    
    // Registrar resposta do usuário
    respostasUsuario[perguntaAtual] = {
        resposta: indice,
        correta: estaCorreto
    };
    
    // Habilitar botão de próxima pergunta
    document.getElementById('btnProxima').disabled = false;
}

function proximaPergunta() {
    perguntaAtual++;
    exibirPergunta();
}

function voltarParaInicio() {
    if (confirm('Deseja sair do quiz? Seu progresso será perdido.')) {
        window.location.href = 'index.html';
    }
}

function finalizarQuiz() {
    const tempoFim = Date.now();
    const tempoTotal = Math.floor((tempoFim - tempoInicio) / 1000);
    
    // Salvar resultado no localStorage
    const resultado = {
        usuario: usuarioAtual,
        data: new Date().toLocaleDateString('pt-BR'),
        pontuacao: pontuacao,
        tempo: tempoTotal,
        respostas: respostasUsuario
    };
    
    let resultados = JSON.parse(localStorage.getItem('resultados')) || [];
    resultados.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(resultados));
    
    // Redirecionar para página de resultado
    sessionStorage.setItem('ultimoResultado', JSON.stringify(resultado));
    window.location.href = 'resultado.html';
}

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

function atualizarBarraProgresso() {
    const nivelAtual = obterNivelAtual(perguntaAtual);
    const nivelAtivo = nivelAtual.indice;
    const totalNiveis = niveisQuiz.length;

    const rastroConcluido = document.getElementById('rastroConcluido');
    const larguraConcluida = totalNiveis > 1 ? (nivelAtivo / (totalNiveis - 1)) * 100 : 0;
    rastroConcluido.style.width = `${larguraConcluida}%`;

    document.querySelectorAll('.segmento-progresso').forEach((segmento, indice) => {
        const preenchimento = segmento.querySelector('.segmento-preenchimento');
        if (indice < nivelAtivo) {
            preenchimento.style.width = '100%';
        } else if (indice === nivelAtivo) {
            preenchimento.style.width = '0%';
        } else {
            preenchimento.style.width = '0%';
        }
    });

    const marcadorAtivo = document.getElementById('marcadorAtivo');
    const posicaoMarcador = totalNiveis > 1 ? (nivelAtivo / (totalNiveis - 1)) * 100 : 0;
    marcadorAtivo.style.left = `${posicaoMarcador}%`;
    marcadorAtivo.textContent = String(nivelAtivo + 1);
}

// Inicializar quando a página carregar
window.addEventListener('load', carregarQuestoes);
