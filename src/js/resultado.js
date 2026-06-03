function carregarResultado() {
    const resultado = JSON.parse(sessionStorage.getItem('ultimoResultado'));
    
    if (!resultado) {
        window.location.href = 'index.html';
        return;
    }
    
    // Preencher dados do resultado
    document.getElementById('usuarioResultado').textContent = resultado.usuario;
    document.getElementById('pontuacaoResultado').textContent = resultado.pontuacao;
    
    // Converter tempo
    const horas = Math.floor(resultado.tempo / 3600);
    const minutos = Math.floor((resultado.tempo % 3600) / 60);
    const segundos = resultado.tempo % 60;
    const tempoFormatado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    document.getElementById('tempoResultado').textContent = tempoFormatado;
    
    // Contar acertos
    let totalAcertos = 0;
    resultado.respostas.forEach(resposta => {
        if (resposta.correta) {
            totalAcertos++;
        }
    });
    document.getElementById('acertosResultado').textContent = `${totalAcertos}/${resultado.respostas.length}`;
    
    // Exibir mensagem baseada na pontuação
    exibirMensagem(resultado.pontuacao, totalAcertos);
    
    // Limpar sessionStorage
    sessionStorage.removeItem('ultimoResultado');
}

function exibirMensagem(pontuacao, acertos) {
    const container = document.getElementById('mensagemResultado');
    let mensagem = '';
    let classe = '';
    
    if (acertos === 10) {
        mensagem = '🏆 Perfeito! Você é um verdadeiro mestre de F1!';
        classe = 'mensagem-excelente';
    } else if (acertos >= 8) {
        mensagem = '👏 Excelente! Você conhece muito sobre F1!';
        classe = 'mensagem-otima';
    } else if (acertos >= 6) {
        mensagem = '😊 Bom trabalho! Você sabe bastante sobre F1!';
        classe = 'mensagem-boa';
    } else if (acertos >= 4) {
        mensagem = '📚 Continue estudando sobre F1!';
        classe = 'mensagem-media';
    } else {
        mensagem = '💪 Volte em breve! Você melhora a cada tentativa!';
        classe = 'mensagem-baixa';
    }
    
    container.className = classe;
    container.textContent = mensagem;
}

function fazerNovoQuiz() {
    window.location.href = 'quiz.html';
}

function verEstatisticas() {
    window.location.href = 'estatisticas.html';
}

function voltarParaInicio() {
    window.location.href = 'index.html';
}

// Carregar resultado quando a página for carregada
window.addEventListener('load', carregarResultado);
