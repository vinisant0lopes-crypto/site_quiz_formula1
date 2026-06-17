let graficoInstance = null;

// Cria ou recria o gráfico com os melhores resultados salvos na sessão.
function criarGrafico() {

    const canvas =
        document.getElementById('grafico_principal');

    const resultados =
        window.armazenamentoQuiz.lerResultadosSessao();

    const melhores = {};

    resultados.forEach(resultado => {

        const usuario = resultado.usuario;

        if (
            !melhores[usuario] ||
            resultado.pontuacao > melhores[usuario]
        ) {
            melhores[usuario] = resultado.pontuacao;
        }
    });

    const labels = Object.keys(melhores);
    const dados = Object.values(melhores);

    if (graficoInstance) {
        graficoInstance.destroy();
    }

    graficoInstance = new Chart(canvas, {

        type: 'bar',

        data: {

            labels,

            datasets: [{
                label: 'Pontuação',
                data: dados,

                backgroundColor: 'rgba(255,0,0,0.5)',
                borderColor: '#ff0000',
                borderWidth: 2
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },

                title: {
                    display: true,
                    text: 'Ranking de Usuários',
                    color: '#ffffff'
                }
            },

            scales: {

                x: {
                    ticks: {
                        color: '#ffffff'
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

// Alterna entre a tabela de placar e a área de gráficos.
function mudarAba(aba) {

    const tabela =
        document.getElementById('tabelaPlacar');

    const graficoContainer =
        document.getElementById('graficoContainer');

    const btnPlacar =
        document.querySelector(
            '[onclick="mudarAba(\'placar\')"]'
        );

    const btnGrafico =
        document.querySelector(
            '[onclick="mudarAba(\'graficos\')"]'
        );

    if (aba === 'placar') {

        tabela.style.display = 'table';
        graficoContainer.style.display = 'none';

        btnPlacar.className = 'aba-ativa';
        btnGrafico.className = 'aba-inativa';
    }

    if (aba === 'graficos') {

        tabela.style.display = 'none';
        graficoContainer.style.display = 'block';

        btnPlacar.className = 'aba-inativa';
        btnGrafico.className = 'aba-ativa';

        setTimeout(() => {
            criarGrafico();
        }, 100);
    }
}