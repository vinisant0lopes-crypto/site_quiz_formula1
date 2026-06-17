// Captura o envio do formulário de login e salva os dados na sessão.
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-input').value;
    const email = document.getElementById('email-input').value;
    const senha = document.getElementById('senha-input').value;
    
    window.armazenamentoQuiz.registrarUsuario({
        nome,
        email,
        senha
    });
    
    // Redirecionar para o quiz
    window.location.href = 'quiz.html';
});
