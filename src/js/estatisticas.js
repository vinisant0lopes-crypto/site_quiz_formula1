// ================= Variáveis Globais =================
let resultados = [];
let usuarioAtual = localStorage.getItem('usuarioAtual') || 'Anônimo';

// ================= Carregar Estatísticas =================
function carregarEstatisticas() {
    resultados = JSON.parse(localStorage.getItem('resultados')) || [];

    // Mostrar nome do usuário atual
    document.getElementById('usuario_atual').textContent = usuarioAtual.toUpperCase();

    if (resultados.length === 0) {
        // Se não houver resultados
        document.getElementById('quizesRealizados').textContent = '0';
        document.getElementById('taxaAcerto').textContent = '0%';
        document.getElementById('melhorPontuacao').textContent = '0';
        document.getElementById('tempoTotal').textContent = '00:00:00';

        const tbody = document.getElementById('bodyTabelaPlacar');
        tbody.innerHTML = '<tr><td colspan="3">Nenhum quiz realizado ainda</td></tr>';
        return;
    }

    // Calcular estatísticas gerais
    calcularEstatisticas();

    // Preencher tabela de placar, mantendo apenas a melhor pontuação por usuário
    preencherTabelaPlacar();
}

// ================= Calcular Estatísticas =================
function calcularEstatisticas() {
    let totalAcertos = 0;
    let totalTentativas = 0;
    let tempoTotalSegundos = 0;
    let melhorPontuacao = 0;

    resultados.forEach(resultado => {
        // Contar acertos
        resultado.respostas.forEach(resposta => {
            if (resposta.correta) totalAcertos++;
            totalTentativas++;
        });

        // Tempo total
        tempoTotalSegundos += resultado.tempo;

        // Melhor pontuação
        if (resultado.pontuacao > melhorPontuacao) {
            melhorPontuacao = resultado.pontuacao;
        }
    });

    // Taxa de acerto
    const taxaAcerto = totalTentativas > 0 
        ? ((totalAcertos / totalTentativas) * 100).toFixed(1) 
        : 0;

    // Formatar tempo
    const horas = Math.floor(tempoTotalSegundos / 3600);
    const minutos = Math.floor((tempoTotalSegundos % 3600) / 60);
    const segundos = tempoTotalSegundos % 60;
    const tempoFormatado = `${String(horas).padStart(2,'0')}:${String(minutos).padStart(2,'0')}:${String(segundos).padStart(2,'0')}`;

    // Atualizar cards
    document.getElementById('quizesRealizados').textContent = resultados.length;
    document.getElementById('taxaAcerto').textContent = taxaAcerto + '%';
    document.getElementById('melhorPontuacao').textContent = melhorPontuacao;
    document.getElementById('tempoTotal').textContent = tempoFormatado;
}

// ================= Preencher Placar =================
function preencherTabelaPlacar() {
    const tbody = document.getElementById('bodyTabelaPlacar');
    tbody.innerHTML = '';

    // Criar mapa: usuário → melhor resultado
    const melhoresResultados = {};
    resultados.forEach(resultado => {
        const usuario = resultado.usuario;
        if (!melhoresResultados[usuario] || resultado.pontuacao > melhoresResultados[usuario].pontuacao) {
            melhoresResultados[usuario] = resultado;
        }
    });

    // Transformar mapa em array e ordenar por pontuação
    const resultadosUnicos = Object.values(melhoresResultados)
        .sort((a, b) => b.pontuacao - a.pontuacao);

    // Preencher tabela
    resultadosUnicos.forEach((resultado, indice) => {
        const linha = document.createElement('tr');

        const colunaPosicao = document.createElement('td');
        colunaPosicao.className = 'coluna-posicao';
        colunaPosicao.textContent = indice + 1;

        const colunaNome = document.createElement('td');
        colunaNome.className = 'coluna-nome';
        colunaNome.textContent = resultado.usuario;

        const colunaPontos = document.createElement('td');
        colunaPontos.className = 'coluna-pontos';
        colunaPontos.textContent = resultado.pontuacao + ' pts';

        linha.appendChild(colunaPosicao);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaPontos);

        tbody.appendChild(linha);
    });
}

// ================= Alternar Abas =================
function mudarAba(aba) {
    const btnPlacar = document.querySelector('[onclick="mudarAba(\'placar\')"]');
    const btnGraficos = document.querySelector('[onclick="mudarAba(\'graficos\')"]');

    if (aba === 'placar') {
        btnPlacar.className = 'aba-ativa';
        btnGraficos.className = 'aba-inativa';
        document.getElementById('tabelaPlacar').style.display = 'table';
    } else {
        btnPlacar.className = 'aba-inativa';
        btnGraficos.className = 'aba-ativa';
        document.getElementById('tabelaPlacar').style.display = 'none';
        // Lógica de gráficos pode ser implementada aqui
    }
}

// ================= Inicializar ao carregar =================
window.addEventListener('load', carregarEstatisticas);