// Dados armazenados em cache
let cachedPacientes = [];
let cachedEnfermeiros = [];
let filteredPacientes = [];
let filteredEnfermeiros = [];

// Elementos do DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const pacientesList = document.getElementById('pacientesList');
const enfermeirosList = document.getElementById('enfermeirosList');
const searchPacientes = document.getElementById('searchPacientes');
const searchEnfermeiros = document.getElementById('searchEnfermeiros');
const countPacientes = document.getElementById('countPacientes');
const countEnfermeiros = document.getElementById('countEnfermeiros');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadData();
    setupSearch();
});

// Setup das abas
function setupTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove classe ativa de todas as abas
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Adiciona classe ativa à aba selecionada
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Setup da busca
function setupSearch() {
    searchPacientes.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filteredPacientes = cachedPacientes.filter(p => 
            p.primeiro_nome.toLowerCase().includes(term) ||
            p.sobrenome.toLowerCase().includes(term) ||
            p.cpf.includes(term)
        );
        renderPacientes();
    });

    searchEnfermeiros.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filteredEnfermeiros = cachedEnfermeiros.filter(e => 
            e.nome.toLowerCase().includes(term) ||
            e.sobrenome.toLowerCase().includes(term) ||
            e.cpfEmail.toLowerCase().includes(term)
        );
        renderEnfermeiros();
    });
}

// Carrega dados da API
async function loadData() {
    try {
        // Carrega pacientes
        const pacientesResponse = await fetch('/pacientes');
        cachedPacientes = await pacientesResponse.json();
        filteredPacientes = [...cachedPacientes];
        
        // Carrega enfermeiros
        const enfermeirosResponse = await fetch('/enfermeiros');
        cachedEnfermeiros = await enfermeirosResponse.json();
        filteredEnfermeiros = [...cachedEnfermeiros];
        
        // Renderiza os dados
        renderPacientes();
        renderEnfermeiros();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        pacientesList.innerHTML = '<div class="loading">❌ Erro ao carregar pacientes</div>';
        enfermeirosList.innerHTML = '<div class="loading">❌ Erro ao carregar enfermeiros</div>';
    }
}

// Renderiza lista de pacientes
function renderPacientes() {
    if (filteredPacientes.length === 0) {
        pacientesList.innerHTML = '<div class="empty">Nenhum paciente encontrado</div>';
        countPacientes.textContent = 'Total: 0';
        return;
    }

    countPacientes.textContent = `Total: ${filteredPacientes.length}`;
    
    pacientesList.innerHTML = filteredPacientes.map(paciente => `
        <div class="record-card">
            <div class="card-header">
                <div class="card-title">${paciente.primeiro_nome} ${paciente.sobrenome}</div>
                <div class="card-id">#${paciente.id}</div>
            </div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">CPF:</span>
                    <span class="info-value"><strong>${paciente.cpf}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Data Nasc.:</span>
                    <span class="info-value">${formatDate(paciente.data_nascimento)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Sexo:</span>
                    <span class="info-value">
                        <span class="badge ${paciente.sexo === 'masculino' ? 'badge-masculino' : 'badge-feminino'}">
                            ${paciente.sexo}
                        </span>
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Prioridade:</span>
                    <span class="info-value">
                        <span class="badge badge-${paciente.prioridade}">
                            ${paciente.prioridade.toUpperCase()}
                        </span>
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Risco:</span>
                    <span class="info-value">
                        <span class="badge badge-${paciente.risco}">
                            ${paciente.risco.toUpperCase()}
                        </span>
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Endereço:</span>
                    <span class="info-value">${paciente.endereco}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Telefone:</span>
                    <span class="info-value">${paciente.telefone}</span>
                </div>
                ${paciente.nome_responsavel ? `
                <div class="info-row">
                    <span class="info-label">Responsável:</span>
                    <span class="info-value">${paciente.nome_responsavel}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tel. Resp.:</span>
                    <span class="info-value">${paciente.telefone_responsavel}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Procedimento:</span>
                    <span class="info-value">${paciente.procedimento}</span>
                </div>
                ${paciente.medicacoes ? `
                <div class="info-row">
                    <span class="info-label">Medicações:</span>
                    <span class="info-value">${paciente.medicacoes}</span>
                </div>
                ` : ''}
                ${paciente.alergias ? `
                <div class="info-row">
                    <span class="info-label">Alergias:</span>
                    <span class="info-value"><strong style="color: #c62828;">${paciente.alergias}</strong></span>
                </div>
                ` : ''}
                ${paciente.historico_doencas ? `
                <div class="info-row">
                    <span class="info-label">Histórico:</span>
                    <span class="info-value">${paciente.historico_doencas}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Enfermeiro:</span>
                    <span class="info-value">ID: <strong>${paciente.nurse_id}</strong></span>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderiza lista de enfermeiros
function renderEnfermeiros() {
    if (filteredEnfermeiros.length === 0) {
        enfermeirosList.innerHTML = '<div class="empty">Nenhum enfermeiro encontrado</div>';
        countEnfermeiros.textContent = 'Total: 0';
        return;
    }

    countEnfermeiros.textContent = `Total: ${filteredEnfermeiros.length}`;
    
    enfermeirosList.innerHTML = filteredEnfermeiros.map(enfermeiro => `
        <div class="record-card">
            <div class="card-header">
                <div class="card-title">${enfermeiro.nome} ${enfermeiro.sobrenome}</div>
                <div class="card-id">#${enfermeiro.id}</div>
            </div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">Email/CPF:</span>
                    <span class="info-value"><strong>${enfermeiro.cpfEmail}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Telefone:</span>
                    <span class="info-value">${enfermeiro.telefone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Sexo:</span>
                    <span class="info-value">
                        <span class="badge ${enfermeiro.sexo === 'masculino' ? 'badge-masculino' : 'badge-feminino'}">
                            ${enfermeiro.sexo}
                        </span>
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Cargo:</span>
                    <span class="info-value"><strong>${enfermeiro.cargo}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Diploma:</span>
                    <span class="info-value">${enfermeiro.diploma}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Data Nasc.:</span>
                    <span class="info-value">${formatDate(enfermeiro.dataNascimento)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Contratação:</span>
                    <span class="info-value">${formatDate(enfermeiro.dataContratacao)}</span>
                </div>
                ${enfermeiro.complementos ? `
                <div class="info-row">
                    <span class="info-label">Complementos:</span>
                    <span class="info-value">${enfermeiro.complementos}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Formata datas
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
