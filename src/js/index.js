// Configura os botões e links da página inicial.
function inicializarPaginaInicial() {
    const btnIniciarQuiz = document.querySelector('.btn_iniciar');
    const btnVerEstatisticas = document.querySelector('.btn_estatisticas');
    const linksNav = document.querySelectorAll('.links a');
    
    // Verificar se usuário está logado
    const usuarioLogado = window.armazenamentoQuiz.temUsuarioLogado();
    
    if (btnIniciarQuiz) {
        btnIniciarQuiz.addEventListener('click', function() {
            if (!usuarioLogado) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'quiz.html';
            }
        });
    }
    
    if (btnVerEstatisticas) {
        btnVerEstatisticas.addEventListener('click', function() {
            window.location.href = 'estatisticas.html';
        });
    }
    
    // Configurar links de navegação
    linksNav.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', function() {
            const texto = this.textContent.toLowerCase();
            
            switch(texto) {
                case 'inicio':
                    window.location.href = 'index.html';
                    break;
                case 'estatisticas':
                    window.location.href = 'estatisticas.html';
                    break;
                case 'sobre':
                    window.location.href = 'sobre.html';
                    break;
                case 'logar':
                    window.location.href = 'login.html';
                    break;
            }
        });
    });
}

// Inicializar quando a página carregar
window.addEventListener('load', inicializarPaginaInicial);
