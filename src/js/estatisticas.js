let resultados = [];
let usuarioAtual = window.armazenamentoQuiz.obterUsuarioAtual();

// Carrega os resultados e atualiza os cards da tela.
function carregarEstatisticas() {

    resultados = window.armazenamentoQuiz.lerResultadosSessao();
    window.armazenamentoQuiz.depurarDadosSessao();

    document.getElementById('usuario_atual').textContent =
        usuarioAtual.toUpperCase();

    if (resultados.length === 0) {

        document.getElementById('quizesRealizados').textContent = '0';
        document.getElementById('taxaAcerto').textContent = '0%';
        document.getElementById('melhorPontuacao').textContent = '0';
        document.getElementById('tempoTotal').textContent = '00:00:00';

        document.getElementById('bodyTabelaPlacar').innerHTML =
            '<tr><td colspan="3">Nenhum quiz realizado ainda</td></tr>';

        return;
    }

    calcularEstatisticas();
    preencherTabelaPlacar();
}

// Calcula as métricas gerais dos quizes realizados.
function calcularEstatisticas() {

    let totalAcertos = 0;
    let totalTentativas = 0;
    let tempoTotalSegundos = 0;
    let melhorPontuacao = 0;

    resultados.forEach(resultado => {

        resultado.respostas.forEach(resposta => {

            if (resposta.correta) {
                totalAcertos++;
            }

            totalTentativas++;
        });

        tempoTotalSegundos += resultado.tempo;

        if (resultado.pontuacao > melhorPontuacao) {
            melhorPontuacao = resultado.pontuacao;
        }
    });

    const taxaAcerto =
        totalTentativas > 0
            ? ((totalAcertos / totalTentativas) * 100).toFixed(1)
            : 0;

    const horas = Math.floor(tempoTotalSegundos / 3600);

    const minutos = Math.floor(
        (tempoTotalSegundos % 3600) / 60
    );

    const segundos = tempoTotalSegundos % 60;

    document.getElementById('quizesRealizados').textContent =
        resultados.length;

    document.getElementById('taxaAcerto').textContent =
        taxaAcerto + '%';

    document.getElementById('melhorPontuacao').textContent =
        melhorPontuacao;

    document.getElementById('tempoTotal').textContent =
        `${String(horas).padStart(2,'0')}:${String(minutos).padStart(2,'0')}:${String(segundos).padStart(2,'0')}`;
}

    // Monta a tabela de placar com os melhores resultados de cada usuário.
function preencherTabelaPlacar() {

    const tbody =
        document.getElementById('bodyTabelaPlacar');

    tbody.innerHTML = '';

    const melhoresResultados = {};

    resultados.forEach(resultado => {

        const usuario = resultado.usuario;

        if (
            !melhoresResultados[usuario] ||
            resultado.pontuacao >
            melhoresResultados[usuario].pontuacao
        ) {
            melhoresResultados[usuario] = resultado;
        }
    });

    const ranking =
        Object.values(melhoresResultados)
        .sort((a,b) => b.pontuacao - a.pontuacao);

    ranking.forEach((resultado, indice) => {

        tbody.innerHTML += `
            <tr>
                <td class="coluna-posicao">${indice + 1}</td>
                <td class="coluna-nome">${resultado.usuario}</td>
                <td class="coluna-pontos">${resultado.pontuacao} pts</td>
            </tr>
        `;
    });
}

// Executa a carga inicial da área de estatísticas.
window.addEventListener('load', carregarEstatisticas);