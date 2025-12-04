  const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Middleware para servir arquivos estáticos (HTML, CSS, JS da pasta public/)
app.use(express.static(path.join(__dirname, "public")));

// Conexão com o banco MySQL (via XAMPP)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "SenseCare",
});

// GET /pacientes → retorna todos os pacientes
app.get("/pacientes", (req, res) => {
  db.query("SELECT * FROM Paciente", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET /enfermeiros → retorna todos os enfermeiros
app.get("/enfermeiros", (req, res) => {
  db.query("SELECT * FROM Enfermeiro", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST /enfermeiros → insere um novo enfermeiro
app.post("/enfermeiros", (req, res) => {
  const { nome, sobrenome, email, telefone, passwordField, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos } = req.body;
  db.query(
    "INSERT INTO Enfermeiro (nome, sobrenome, cpfEmail, telefone, senha, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nome, sobrenome, email, telefone, passwordField, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Enfermeiro adicionado com sucesso!" });
    }
  );
});

// POST /pacientes → insere um novo paciente
app.post("/pacientes", (req, res) => {
  const { primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes } = req.body;
  db.query(
    "INSERT INTO Paciente (primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Paciente adicionado com sucesso!" });
    }
  );
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);