const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});
app.use(express.static(path.join(__dirname, "public")));

function splitSqlList(text) {
  const values = [];
  let current = "";
  let inString = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "'") {
      if (inString && next === "'") {
        current += "'";
        index += 1;
      } else {
        inString = !inString;
        current += char;
      }
      continue;
    }

    if (char === "," && !inString) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    values.push(current.trim());
  }

  return values;
}

function unquoteSqlValue(value) {
  const trimmed = value.trim();

  if (/^null$/i.test(trimmed)) {
    return null;
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }

  return trimmed;
}

function normalizeEnfermeiro(record) {
  return {
    id: String(record.id ?? ""),
    nome: record.nome ?? "",
    sobrenome: record.sobrenome ?? "",
    cpfEmail: record.cpfEmail ?? record.cpfEemail ?? record.cpf_email ?? "",
    telefone: record.telefone ?? "",
    passwordField: record.passwordField ?? record.senha ?? "",
    sexo: record.sexo ?? "",
    dataContratacao: record.dataContratacao ?? record.data_contratacao ?? "",
    dataNascimento: record.dataNascimento ?? record.data_nascimento ?? "",
    diploma: record.diploma ?? "",
    cargo: record.cargo ?? "",
    complementos: record.complementos ?? ""
  };
}

function normalizePaciente(record) {
  return {
    id: record.id != null ? Number(record.id) : null,
    nurse_id: String(record.nurse_id ?? ""),
    primeiro_nome: record.primeiro_nome ?? record.primeiroNome ?? "",
    sobrenome: record.sobrenome ?? "",
    data_nascimento: record.data_nascimento ?? record.dataNascimento ?? "",
    cpf: record.cpf ?? "",
    endereco: record.endereco ?? "",
    telefone: record.telefone ?? "",
    nome_responsavel: record.nome_responsavel ?? record.nomeResponsavel ?? "",
    telefone_responsavel: record.telefone_responsavel ?? record.telefoneResponsavel ?? "",
    procedimento: record.procedimento ?? "",
    historico_doencas: record.historico_doencas ?? record.historicoDoencas ?? "",
    medicacoes: record.medicacoes ?? "",
    sexo: record.sexo ?? "",
    prioridade: record.prioridade ?? "",
    risco: record.risco ?? "",
    alergias: record.alergias ?? "",
    especificacoes: record.especificacoes ?? ""
  };
}

function loadSeedData(sqlFilePath) {
  const sql = fs.readFileSync(sqlFilePath, "utf8");
  const insertRegex = /INSERT\s+INTO\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*VALUES\s*\(([^]*?)\);/gi;
  const enfermeiros = [];
  const pacientes = [];

  for (const match of sql.matchAll(insertRegex)) {
    const tableName = match[1].toLowerCase();
    const columns = splitSqlList(match[2]).map(column => column.trim());
    const values = splitSqlList(match[3]).map(unquoteSqlValue);
    const record = {};

    columns.forEach((column, index) => {
      record[column] = values[index];
    });

    if (tableName === "enfermeiro") {
      enfermeiros.push(normalizeEnfermeiro(record));
    }

    if (tableName === "paciente") {
      pacientes.push(normalizePaciente(record));
    }
  }

  return { enfermeiros, pacientes };
}

const seedPath = path.join(__dirname, "public", "sensecare2.0.sql");
const seedData = loadSeedData(seedPath);

let enfermeiros = seedData.enfermeiros;
let pacientes = seedData.pacientes;
let nextPacienteId = pacientes.reduce((max, paciente) => Math.max(max, Number(paciente.id) || 0), 0) + 1;

function localQuery(sql, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = [];
  }

  const normalizedSql = sql.replace(/\s+/g, " ").trim().toLowerCase();

  try {
    if (normalizedSql === "select * from paciente") {
      callback(null, pacientes.map(paciente => ({ ...paciente })));
      return;
    }

    if (normalizedSql === "select * from paciente where nurse_id = ?") {
      const nurseId = String(params[0] ?? "");
      callback(null, pacientes.filter(paciente => String(paciente.nurse_id) === nurseId).map(paciente => ({ ...paciente })));
      return;
    }

    if (normalizedSql === "select * from enfermeiro") {
      callback(null, enfermeiros.map(enfermeiro => ({ ...enfermeiro })));
      return;
    }

    if (normalizedSql === "select * from enfermeiro where id = ?") {
      const enfermeiroId = String(params[0] ?? "");
      const found = enfermeiros.find(enfermeiro => String(enfermeiro.id) === enfermeiroId) || null;
      callback(null, found ? { ...found } : null);
      return;
    }

    if (normalizedSql.startsWith("insert into enfermeiro")) {
      const [id, nome, sobrenome, cpfEmail, telefone, passwordField, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos] = params;
      const existingIndex = enfermeiros.findIndex(enfermeiro => String(enfermeiro.id) === String(id));
      const record = normalizeEnfermeiro({
        id,
        nome,
        sobrenome,
        cpfEmail,
        telefone,
        passwordField,
        sexo,
        dataContratacao,
        dataNascimento,
        diploma,
        cargo,
        complementos
      });

      if (existingIndex >= 0) {
        enfermeiros[existingIndex] = record;
      } else {
        enfermeiros.push(record);
      }

      callback(null, { affectedRows: 1, insertId: record.id });
      return;
    }

    if (normalizedSql.startsWith("insert into paciente")) {
      const [nurseId, primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes] = params;
      const record = normalizePaciente({
        id: nextPacienteId,
        nurse_id: nurseId,
        primeiro_nome: primeiroNome,
        sobrenome,
        data_nascimento: dataNascimento,
        cpf,
        endereco,
        telefone,
        nome_responsavel: nomeResponsavel,
        telefone_responsavel: telefoneResponsavel,
        procedimento,
        historico_doencas: historicoDoencas,
        medicacoes,
        sexo,
        prioridade,
        risco,
        alergias,
        especificacoes
      });

      nextPacienteId += 1;
      pacientes.push(record);
      callback(null, { affectedRows: 1, insertId: record.id });
      return;
    }

    if (normalizedSql === "delete from paciente where id = ?") {
      const pacienteId = String(params[0] ?? "");
      const beforeLength = pacientes.length;
      pacientes = pacientes.filter(paciente => String(paciente.id) !== pacienteId);
      callback(null, { affectedRows: beforeLength - pacientes.length });
      return;
    }

    throw new Error(`Consulta não suportada no banco local: ${sql}`);
  } catch (error) {
    callback(error);
  }
}

const db = { query: localQuery };

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

app.get("/enfermeiros", (req, res) => {
  db.query("SELECT * FROM Enfermeiro", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get("/enfermeiros/:id", (req, res) => {
  db.query("SELECT * FROM Enfermeiro WHERE id = ?", [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results || null);
  });
});

app.post("/enfermeiros", (req, res) => {
  const { id, nome, sobrenome, email, telefone, passwordField, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos } = req.body;

  db.query(
    "INSERT INTO Enfermeiro (id, nome, sobrenome, cpf_email, telefone, senha, sexo, data_contratacao, data_nascimento, diploma, cargo, complementos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, nome, sobrenome, email, telefone, passwordField, sexo, dataContratacao, dataNascimento, diploma, cargo, complementos],
    (err) => {
      if (err) throw err;
      res.json({ message: "Enfermeiro adicionado com sucesso!" });
    }
  );
});

app.post("/pacientes", (req, res) => {
  const { nurse_id, primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes } = req.body;

  db.query(
    "INSERT INTO Paciente (nurse_id, primeiro_nome, sobrenome, data_nascimento, cpf, endereco, telefone, nome_responsavel, telefone_responsavel, procedimento, historico_doencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nurse_id, primeiroNome, sobrenome, dataNascimento, cpf, endereco, telefone, nomeResponsavel, telefoneResponsavel, procedimento, historicoDoencas, medicacoes, sexo, prioridade, risco, alergias, especificacoes],
    (err) => {
      if (err) throw err;
      res.json({ message: "Paciente adicionado com sucesso!" });
    }
  );
});

app.delete("/pacientes/:id", (req, res) => {
  db.query("DELETE FROM Paciente WHERE id = ?", [req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Paciente deletado com sucesso!" });
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log("Banco local carregado a partir de public/sensecare2.0.sql");
});