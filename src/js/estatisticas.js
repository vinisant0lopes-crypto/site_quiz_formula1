let resultados = [];

function carregarEstatisticas() {
    resultados = JSON.parse(localStorage.getItem('resultados')) || [];
    
    if (resultados.length === 0) {
        // Se não houver resultados, mostrar mensagem padrão
        document.getElementById('quizesRealizados').textContent = '0';
        document.getElementById('taxaAcerto').textContent = '0%';
        document.getElementById('melhorPontuacao').textContent = '0';
        document.getElementById('tempoTotal').textContent = '00:00:00';
        
        // Limpar tabela
        const tbody = document.getElementById('bodyTabelaPlacar');
        tbody.innerHTML = '<tr><td colspan="3">Nenhum quiz realizado ainda</td></tr>';
        return;
    }
    
    // Calcular estatísticas
    calcularEstatisticas();
    
    // Preenc her tabela
    preencherTabelaPlacar();
}

function calcularEstatisticas() {
    let totalAcertos = 0;
    let totalTentativas = 0;
    let tempoTotalSegundos = 0;
    let melhorPontuacao = 0;
    
    resultados.forEach(resultado => {
        // Contar acertos
        resultado.respostas.forEach(resposta => {
            if (resposta.correta) {
                totalAcertos++;
            }
            totalTentativas++;
        });
        
        // Tempo total
        tempoTotalSegundos += resultado.tempo;
        
        // Melhor pontuação
        if (resultado.pontuacao > melhorPontuacao) {
            melhorPontuacao = resultado.pontuacao;
        }
    });
    
    // Calcular taxa de acerto
    const taxaAcerto = totalTentativas > 0 
        ? ((totalAcertos / totalTentativas) * 100).toFixed(1) 
        : 0;
    
    // Converter tempo em horas, minutos e segundos
    const horas = Math.floor(tempoTotalSegundos / 3600);
    const minutos = Math.floor((tempoTotalSegundos % 3600) / 60);
    const segundos = tempoTotalSegundos % 60;
    const tempoFormatado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    
    // Atualizar elementos
    document.getElementById('quizesRealizados').textContent = resultados.length;
    document.getElementById('taxaAcerto').textContent = taxaAcerto + '%';
    document.getElementById('melhorPontuacao').textContent = melhorPontuacao;
    document.getElementById('tempoTotal').textContent = tempoFormatado;
}

function preencherTabelaPlacar() {
    const tbody = document.getElementById('bodyTabelaPlacar');
    tbody.innerHTML = '';
    
    // Ordenar resultados por pontuação (maior para menor)
    const resultadosOrdenados = [...resultados].sort((a, b) => b.pontuacao - a.pontuacao);
    
    resultadosOrdenados.forEach((resultado, indice) => {
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
        // Aqui você pode adicionar a lógica para exibir gráficos
    }
}

// Inicializar quando a página carregar
window.addEventListener('load', carregarEstatisticas);
