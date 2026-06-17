const CHAVE_DADOS_SESSAO = 'dadosUsuarioQuiz';
const CHAVE_RESULTADOS_SESSAO = 'resultadosQuiz';

// Cria a estrutura base do estado salvo na sessão.
function criarEstadoPadrao() {
	return {
		nome: '',
		email: '',
		senha: '',
		respostas: [],
		resultado: null
	};
}

// Lê o estado atual salvo em sessionStorage.
function lerEstadoSessao() {
	try {
		const dados = JSON.parse(sessionStorage.getItem(CHAVE_DADOS_SESSAO));
		return {
			...criarEstadoPadrao(),
			...(dados || {}),
			respostas: Array.isArray(dados?.respostas) ? dados.respostas : []
		};
	} catch (erro) {
		return criarEstadoPadrao();
	}
}

// Persiste um novo estado parcial na sessão.
function salvarEstadoSessao(parcial) {
	const estadoAtual = {
		...lerEstadoSessao(),
		...parcial
	};

	if (Array.isArray(parcial?.respostas)) {
		estadoAtual.respostas = parcial.respostas;
	}

	sessionStorage.setItem(CHAVE_DADOS_SESSAO, JSON.stringify(estadoAtual));
	return estadoAtual;
}

// Salva os dados do usuário logado na sessão.
function registrarUsuario({ nome, email, senha }) {
	return salvarEstadoSessao({ nome, email, senha });
}

// Atualiza as respostas já marcadas pelo usuário.
function registrarRespostas(respostas) {
	return salvarEstadoSessao({ respostas });
}

// Lê a lista de resultados guardada na sessão.
function lerResultadosSessao() {
	try {
		return JSON.parse(sessionStorage.getItem(CHAVE_RESULTADOS_SESSAO)) || [];
	} catch (erro) {
		return [];
	}
}

// Salva a lista de resultados na sessão.
function salvarResultadosSessao(resultados) {
	sessionStorage.setItem(CHAVE_RESULTADOS_SESSAO, JSON.stringify(resultados));
	return resultados;
}

// Registra o último resultado e mantém o histórico na sessão.
function registrarResultado(resultado) {
	const estadoAtualizado = salvarEstadoSessao({
		respostas: Array.isArray(resultado?.respostas) ? resultado.respostas : lerEstadoSessao().respostas,
		resultado
	});

	const resultados = lerResultadosSessao();
	resultados.push(resultado);
	salvarResultadosSessao(resultados);
	sessionStorage.setItem('ultimoResultado', JSON.stringify(resultado));
	return estadoAtualizado;
}

// Remove apenas o último resultado exibido, mantendo o histórico.
function limparResultado() {
	sessionStorage.removeItem('ultimoResultado');
	const estadoAtual = lerEstadoSessao();
	estadoAtual.resultado = null;
	sessionStorage.setItem(CHAVE_DADOS_SESSAO, JSON.stringify(estadoAtual));
}

// Retorna o nome do usuário logado ou um padrão anônimo.
function obterUsuarioAtual() {
	const estado = lerEstadoSessao();
	return estado.nome || 'Anônimo';
}

// Indica se existe usuário salvo na sessão.
function temUsuarioLogado() {
	const estado = lerEstadoSessao();
	return Boolean(estado.nome || estado.email);
}

// Imprime todos os dados atuais da sessão no console.
function depurarDadosSessao() {
	const snapshot = {
		estado: lerEstadoSessao(),
		resultados: lerResultadosSessao(),
		ultimoResultado: sessionStorage.getItem('ultimoResultado')
			? JSON.parse(sessionStorage.getItem('ultimoResultado'))
			: null,
		todasAsChaves: Object.keys(sessionStorage).reduce((acumulado, chave) => {
			acumulado[chave] = sessionStorage.getItem(chave);
			return acumulado;
		}, {})
	};

	console.log('Dados da sessão do quiz:', snapshot);
	return snapshot;
}

window.armazenamentoQuiz = {
	lerEstadoSessao,
	salvarEstadoSessao,
	registrarUsuario,
	registrarRespostas,
	lerResultadosSessao,
	salvarResultadosSessao,
	registrarResultado,
	limparResultado,
	obterUsuarioAtual,
	temUsuarioLogado,
	depurarDadosSessao
};