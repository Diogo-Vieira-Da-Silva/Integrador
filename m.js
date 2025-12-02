  const express = require("express"); // Framework para criar servidor e rotas
const mysql = require("mysql2"); // Biblioteca para conectar no MySQL
const path = require("path"); // Módulo nativo do Node para lidar com caminhos
const session = require("express-session"); // Para gerenciar sessões

const app = express(); // Cria a aplicação Express

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Middleware de sessão
app.use(session({
 secret: 'sensecare_secret', // Chave secreta para assinar a sessão
 resave: false,
 saveUninitialized: true,
 cookie: { secure: false } // Para desenvolvimento, false; em produção, true com HTTPS
}));

// Middleware para servir arquivos estáticos (HTML, CSS, JS da pasta public/)
app.use(express.static(path.join(__dirname, "public")));

// Conexão com o banco MySQL (via XAMPP)
const db = mysql.createConnection({
  host: "localhost", // Servidor do MySQL
  user: "root", // Usuário padrão do XAMPP
  password: "", // Senha (geralmente vazia no XAMPP)
  database: "SenseCare", // Nome do banco que você criou
});

// Rotas para Enfermeiro
app.get("/Enfermeiro", (req, res) => {
  if (!req.session.Enfermeiro) {
    return res.status(401).json({ message: "Não autorizado" });
  }
  db.query("SELECT * FROM Enfermeiro", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/Enfermeiro", (req, res) => {
  const { nome, sobrenome, cpf_email, telefone, senha, sexo, data_contratacao, data_nascimento, diploma, cargo, complementos } = req.body;
  db.query(
    "INSERT INTO Enfermeiro (nome, sobrenome, cpf_email, telefone, senha, sexo, data_contratacao, data_nascimento, diploma, cargo, complementos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nome, sobrenome, cpf_email, telefone, senha, sexo, data_contratacao, data_nascimento, diploma, cargo, complementos],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Enfermeiro adicionado com sucesso!" });
    }
  );
});

// Login para Enfermeiro
app.post("/login", (req, res) => {
  const { cpfEmail, senha } = req.body;
  db.query("SELECT * FROM Enfermeiro WHERE cpf_email = ? AND senha = ?", [cpfEmail, senha], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.Enfermeiro = results[0];
      res.json({ message: "Login bem-sucedido", Enfermeiro: results[0] });
    } else {
      res.status(401).json({ message: "Credenciais inválidas" });
    }
  });
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logout bem-sucedido" });
});

// Get current Enfermeiro
app.get("/session", (req, res) => {
  if (req.session.Enfermeiro) {
    res.json({ Enfermeiro: req.session.Enfermeiro });
  } else {
    res.status(401).json({ message: "Não logado" });
  }
});

// Middleware para verificar sessão
function requireAuth(req, res, next) {
  if (req.session.Enfermeiro) {
    next();
  } else {
    res.status(401).json({ message: "Sessão expirada" });
  }
}


app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);

// Rotas para Paciente
app.get("/Paciente", requireAuth, (req, res) => {
  db.query("SELECT * FROM Paciente", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get("/Paciente/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Paciente WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

app.post("/Paciente", requireAuth, (req, res) => {
  const {
    primeiro_nome,
    sobrenome,
    data_nascimento,
    cpf,
    endereco,
    telefone,
    nome_responsavel,
    telefone_responsavel,
    procedimento,
    historico_doencas,
    medicacoes,
    sexo,
    prioridade,
    risco,
    alergias,
    especificacoes
  } = req.body;
  db.query(
    `INSERT INTO Paciente (primeiro_nome, sobrenome, data_nascimento, cpf, endereco, telefone, nome_responsavel, telefone_responsavel, procedimento, historico_doencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [primeiro_nome, sobrenome, data_nascimento, cpf, endereco, telefone, nome_responsavel, telefone_responsavel, procedimento, historico_doencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Paciente adicionado com sucesso!" });
    }
  );
});

app.delete("/Paciente/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Paciente WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Paciente deletado com sucesso!" });
  });
});



///parte - Código cliente para Enfermeiro e Paciente com sessões

// Verificar sessão ao carregar a página
async function verificarSessao() {
  try {
    const response = await fetch('/session');
    if (response.ok) {
      const data = await response.json();
      console.log('Sessão ativa:', data.enfermeiro);
      // Aqui você pode atualizar a UI com dados do enfermeiro
    } else {
      console.log('Sessão expirada');
      // Redirecionar para login se necessário
    }
  } catch (error) {
    console.log('Erro ao verificar sessão:', error);
  }
}

// Função para login
async function login(cpfEmail, senha) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpfEmail, senha })
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Login bem-sucedido:', data.enfermeiro);
      // Redirecionar ou atualizar UI
    } else {
      console.log('Falha no login');
    }
  } catch (error) {
    console.log('Erro no login:', error);
  }
}

// Função para logout
async function logout() {
  try {
    await fetch('/logout', { method: 'POST' });
    console.log('Logout realizado');
    // Redirecionar para login
  } catch (error) {
    console.log('Erro no logout:', error);
  }
}

// Função para carregar Paciente (requer sessão)
async function carregarPaciente() {
  try {
    const resposta = await fetch("/Paciente");
    if (resposta.ok) {
      const Paciente = await resposta.json();
      console.log(Paciente);
      // Atualizar UI com Paciente
    } else {
      console.log('Não autorizado');
    }
  } catch (error) {
    console.log('Erro ao carregar Paciente:', error);
  }
}

// Função para adicionar Paciente
async function adicionarPaciente(PacienteData) {
  try {
    const response = await fetch('/Paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(PacienteData)
    });
    if (response.ok) {
      console.log('Paciente adicionado');
      carregarPaciente(); // atualizar lista
    } else {
      console.log('Erro ao adicionar Paciente');
    }
  } catch (error) {
    console.log('Erro:', error);
  }
}

// Carrega sessão ao abrir a página
verificarSessao();
carregarPaciente();