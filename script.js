// Função para inicializar o toggle da senha (somente se os elementos existirem)
function initPasswordToggle() {
    const passwordField = document.getElementById('passwordField');
    const toggleButton = document.getElementById('togglePassword');
    const toggleText = document.getElementById('toggleText');

    if (!passwordField || !toggleButton || !toggleText) {
        return; // silenciosamente retorna; não há toggle nesta página
    }

    toggleButton.addEventListener('click', function () {
        const currentType = passwordField.getAttribute('type');
        const newType = (currentType === 'password' ? 'text' : 'password');
        passwordField.setAttribute('type', newType);
        toggleText.textContent = newType === 'text' ? 'Ocultar' : 'Mostrar';
        localStorage.setItem('passwordVisible', newType === 'text');
    });
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordToggle);
} else {
    initPasswordToggle();
}

// Carregar dados salvos no localStorage de forma defensiva
window.addEventListener('load', function () {
    const saved = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Loaded user data:', saved);

    if (saved) {
        const mapping = [
            ['nome', 'nome'],
            ['sobrenome', 'sobrenome'],
            ['email', 'cpfEmail'],
            ['telefone', 'telefone'],
            ['passwordField', 'senha'],
            ['sexo', 'sexo'],
            ['dataContratacao', 'dataContratacao'],
            ['dataNascimento', 'dataNascimento'],
            ['diploma', 'diploma'],
            ['cargo', 'cargo'],
            ['complementos', 'complementos']
        ];

        mapping.forEach(function (pair) {
            const el = document.getElementById(pair[0]);
            if (el) el.value = saved[pair[1]] || '';
        });
    }

    // Aplicar estado do toggle se existirem elementos
    const passwordVisible = localStorage.getItem('passwordVisible') === 'true';
    const passwordField = document.getElementById('passwordField');
    const toggleText = document.getElementById('toggleText');
    if (passwordVisible && passwordField && toggleText) {
        passwordField.setAttribute('type', 'text');
        toggleText.textContent = 'Ocultar';
    }
});

// Validação do formulário e binding somente quando o formulário existir
(function () {
    const form = document.getElementById('loginForm');
    if (!form) return; // Página atual não tem formulário de login

    const cpfEmailField = document.getElementById('email');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        if (!cpfEmailField) {
            alert('Campo de CPF/E-mail não encontrado.');
            return;
        }

        const value = cpfEmailField.value.trim();
        const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
        const cpfRegex = /^\d{11}$/;

        if (!emailRegex.test(value) && !cpfRegex.test(value)) {
            alert('CPF deve ter exatamente 11 números ou e-mail deve ser no formato usuario@gmail.com');
            return;
        }

        const telefoneEl = document.getElementById('telefone');
        const telefone = telefoneEl ? telefoneEl.value : '';
        if (!/^\d{13}$/.test(telefone)) {
            alert('Telefone deve ter exatamente 13 números.');
            return;
        }

        // Coletar dados de forma defensiva
        const getVal = id => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };

        const data = {
            nome: getVal('nome'),
            sobrenome: getVal('sobrenome'),
            cpfEmail: value,
            telefone: telefone,
            senha: getVal('passwordField'),
            sexo: getVal('sexo'),
            dataContratacao: getVal('dataContratacao'),
            dataNascimento: getVal('dataNascimento'),
            diploma: getVal('diploma'),
            cargo: getVal('cargo'),
            complementos: getVal('complementos')
        };

        console.log(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
        console.log('Dados salvos:', data);
        window.location.href = 'm.html';
    });
})();

// regex para validar o email (utilitária, se necessário)
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
}
