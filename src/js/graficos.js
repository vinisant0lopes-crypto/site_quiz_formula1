let graficoInstance = null;

// ===================== CRIAR GRÁFICO =====================
function criarGrafico() {
    const canvas = document.getElementById('grafico_principal');

    let resultados = JSON.parse(localStorage.getItem('resultados')) || [];

    // 🔥 pega melhor pontuação por usuário
    const melhores = {};

    resultados.forEach(r => {
        const usuario = r.usuario;

        if (!melhores[usuario] || r.pontuacao > melhores[usuario]) {
            melhores[usuario] = r.pontuacao;
        }
    });

    const labels = Object.keys(melhores);
    const dados = Object.values(melhores);

    // 🔥 destrói gráfico antigo se existir
    if (graficoInstance) {
        graficoInstance.destroy();
    }

    // 🔥 cria novo gráfico
    graficoInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Melhor Pontuação',
                data: dados,
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                borderColor: '#ff0000',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Ranking de Usuários'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ===================== TROCA DE ABA =====================
function mudarAba(aba) {
    const tabela = document.getElementById('tabelaPlacar');
    const grafico = document.getElementById('grafico_principal');

    const btnPlacar = document.querySelector('[onclick="mudarAba(\'placar\')"]');
    const btnGrafico = document.querySelector('[onclick="mudarAba(\'graficos\')"]');

    if (aba === 'placar') {
        tabela.style.display = 'table';
        grafico.style.display = 'none';

        btnPlacar.className = 'aba-ativa';
        btnGrafico.className = 'aba-inativa';
    }

    if (aba === 'graficos') {
        tabela.style.display = 'none';
        grafico.style.display = 'block';

        btnPlacar.className = 'aba-inativa';
        btnGrafico.className = 'aba-ativa';

        // 🔥 espera renderizar antes de criar gráfico
        setTimeout(() => {
            criarGrafico();
        }, 50);
    }
}