document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-input').value;
    const email = document.getElementById('email-input').value;
    const senha = document.getElementById('senha-input').value;
    
    // Salvar dados do usuário
    localStorage.setItem('usuarioAtual', nome);
    localStorage.setItem('usuarioEmail', email);
    
    // Redirecionar para o quiz
    window.location.href = 'quiz.html';
});
