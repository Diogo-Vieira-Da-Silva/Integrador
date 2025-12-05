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

// GET /pacientes → retorna pacientes filtrados por nurse_id se fornecido
app.get("/pacientes", (req, res) => {
  const nurseId = req.query.nurse_id;
  let query = "SELECT * FROM Paciente";
  let params = [];
  if (nurseId) {
    query += " WHERE nurse_id = ?";
    params = [nurseId];
  }
  db.query(query, params, (err, results) => {
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

// GET /enfermeiros/:id → retorna enfermeiro por id
app.get("/enfermeiros/:id", (req, res) => {
  db.query("SELECT * FROM Enfermeiro WHERE id = ?", [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results[0] || null);
  });
});

// POST /enfermeiros → insere um novo enfermeiro
app.post("/enfermeiros", (req, res) => {
  const { id, nome, sobrenome, email, telefone, passwordField, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos } = req.body;
  db.query(
    "INSERT INTO Enfermeiro (id, nome, sobrenome, cpf_email, telefone, senha, sexo, data_contratacao, data_nascimento, diploma, cargo, complementos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, nome, sobrenome, email, telefone, passwordField, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Enfermeiro adicionado com sucesso!" });
    }
  );
});

// POST /pacientes → insere um novo paciente
app.post("/pacientes", (req, res) => {
  const { nurse_id, primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes } = req.body;
  db.query(
    "INSERT INTO Paciente (nurse_id, primeiro_nome, sobrenome, data_nascimento, cpf, endereco, telefone, nome_responsavel, telefone_responsavel, procedimento, historico_doencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nurse_id, primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Paciente adicionado com sucesso!" });
    }
  );
});

// DELETE /pacientes/:id → deleta paciente por id
app.delete("/pacientes/:id", (req, res) => {
  db.query("DELETE FROM Paciente WHERE id = ?", [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Paciente deletado com sucesso!" });
  });
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);