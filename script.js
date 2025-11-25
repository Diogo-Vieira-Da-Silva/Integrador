 // Função para inicializar o toggle da senha
 function initPasswordToggle() {
     const passwordField = document.getElementById('passwordField');
     const toggleButton = document.getElementById('togglePassword');
     const toggleText = document.getElementById('toggleText');
 
     if (!passwordField || !toggleButton || !toggleText) {
         console.error('Elementos do toggle da senha não encontrados.');
         return;
     }
 
     // Adicione um ouvinte de evento (event listener) ao botão
     toggleButton.addEventListener('click', function() {
         // 1. Alterna o Tipo do Input: 'password' <-> 'text'
         // Verifica qual é o tipo atual e define o tipo oposto
         const currentType = passwordField.getAttribute('type');
         const newType = (currentType === 'password' ? 'text' : 'password');
 
         passwordField.setAttribute('type', newType);
 
         // 2. Alterna o Texto do Botão: "Mostrar" <-> "Ocultar"
         if (newType === 'text') {
             // Se mudou para 'text', a senha está visível
             toggleText.textContent = 'Ocultar';
         } else {
             // Se voltou para 'password', a senha está oculta
             toggleText.textContent = 'Mostrar';
         }
 
         // Salvar estado do toggle
         localStorage.setItem('passwordVisible', newType === 'text');
     });
 }
 
 // Inicializar o toggle quando o DOM estiver pronto
 if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', initPasswordToggle);
 } else {
     initPasswordToggle();
 }
 
 // Carregar dados salvos no localStorage
 window.addEventListener('load', function() {
     const saved = JSON.parse(localStorage.getItem('currentUser'));
       console.log('Loaded user data:', saved);
     if (saved) {
         document.getElementById('nome').value = saved.nome || '';
         document.getElementById('sobrenome').value = saved.sobrenome || '';
         document.getElementById('email').value = saved.cpfEmail || '';
         document.getElementById('telefone').value = saved.telefone || '';
         document.getElementById('passwordField').value = saved.senha || '';
         document.getElementById('sexo').value = saved.sexo || '';
         document.getElementById('dataContratacao').value = saved.dataContratacao || '';
         document.getElementById('dataNascimento').value = saved.dataNascimento || '';
         document.getElementById('diploma').value = saved.diploma || '';
         document.getElementById('cargo').value = saved.cargo || '';
         document.getElementById('complementos').value = saved.complementos || '';
     }
 
     // Carregar estado do toggle da senha
     const passwordVisible = localStorage.getItem('passwordVisible') === 'true';
      console.log('Password visible:', passwordVisible);
     if (passwordVisible) {
         passwordField.setAttribute('type', 'text');
         toggleText.textContent = 'Ocultar';
     }
 });
 
 // Validação do formulário
 const form = document.getElementById('loginForm');
 const cpfEmailField = document.getElementById('email');
 
 form.addEventListener('submit', function(e) {
     e.preventDefault();
 
     if (!form.checkValidity()) {
         alert('Preencha todos os campos obrigatórios.');
         return;
     }
 
     const value = cpfEmailField.value.trim();
     const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
     const cpfRegex = /^\d{11}$/;
 
     if (!emailRegex.test(value) && !cpfRegex.test(value)) {
         alert('CPF deve ter exatamente 11 números ou e-mail deve ser no formato usuario@gmail.com');
         return;
     }
 
     const telefone = document.getElementById('telefone').value;
     if (!/^\d{13}$/.test(telefone)) {
         alert('Telefone deve ter exatamente 13 números.');
         return;
     }
 
     // Coletar dados
     const data = {
         nome: document.getElementById('nome').value,
         sobrenome: document.getElementById('sobrenome').value,
         cpfEmail: value,
         telefone: document.getElementById('telefone').value,
         senha: document.getElementById('passwordField').value,
         sexo: document.getElementById('sexo').value,
         dataContratacao: document.getElementById('dataContratacao').value,
         dataNascimento: document.getElementById('dataNascimento').value,
         diploma: document.getElementById('diploma').value,
         cargo: document.getElementById('cargo').value,
         complementos: document.getElementById('complementos').value
     };
 
     console.log(data);
 
     // Salvar no localStorage
     localStorage.setItem('currentUser', JSON.stringify(data));
     console.log('Dados salvos:', data);
     // Redirecionar para a página de boas-vindas
     window.location.href = 'm.html';
 });

//regex para validar o emai, fazendo ele ter que ter pelo menos 1 letra ou número e depois um @gmail.com
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
}
