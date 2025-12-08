  -- APAGAR COMPLETAMENTE O DATABASE
DROP DATABASE IF EXISTS SenseCare;

-- CRIAR NOVO DATABASE
CREATE DATABASE SenseCare;
USE SenseCare;

-- =============================
-- TABELA: ENFERMEIRO
-- =============================
CREATE TABLE Enfermeiro (
    id VARCHAR(50) PRIMARY KEY,   -- ID manual 100%
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    cpfEemail VARCHAR(120) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    sexo ENUM('masculino', 'feminino') NOT NULL,
    dataContratacao DATE NOT NULL,
    dataNascimento DATE NOT NULL,
    diploma VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    complementos VARCHAR(255)
);

-- =============================
-- INSERT DE ENFERMEIRO
-- =============================
INSERT INTO Enfermeiro (
    id, nome, sobrenome, cpfEmail, telefone,
    senha, sexo, dataContratacao, dataNascimento,
    diploma, cargo, complementos
) VALUES (
    '1', 'Lucas',
    'Ferreira Mendes',
    'lucas.mendes@sensecare.com',
    '(11) 99123-7788',
    '$2y$10$T8R7eY1dQ8X0YhVqZIv1xe8FWyN3cvYF1eQ7o8mHpe6UjswW0ae9W',
    'masculino',
    '2024-04-20',
    '1992-10-05',
    'Enfermagem - USP',
    'Enfermeiro Chefe',
    'Responsável por triagem e supervisão.'
);

-- =============================
-- TABELA: PACIENTE
-- =============================
CREATE TABLE Paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nurse_id VARCHAR(50) NOT NULL,
    primeiro_nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(30) NOT NULL,

    nome_responsavel VARCHAR(100),
    telefone_responsavel VARCHAR(30),

    procedimento VARCHAR(255) NOT NULL,
    historico_doencas TEXT,
    medicacoes TEXT,

    sexo ENUM('masculino', 'feminino') NOT NULL,
    prioridade ENUM('alta', 'media', 'baixa') NOT NULL,
    risco ENUM('idoso', 'nada') NOT NULL,

    alergias TEXT,
    especificacoes TEXT,

    FOREIGN KEY (nurse_id) REFERENCES Enfermeiro(id)
);

-- =============================
-- INSERT DE PACIENTE
-- =============================
INSERT INTO Paciente (
    nurse_id, primeiro_nome, sobrenome, data_nascimento, cpf, endereco, telefone,
    nome_responsavel, telefone_responsavel,
    procedimento, historico_doencas, medicacoes,
    sexo, prioridade, risco,
    alergias, especificacoes
) VALUES (
    '1', 'Mariana',
    'Oliveira Santos',
    '2010-08-12',
    '321.654.987-00',
    'Av. Brasil, 445 - Centro, Recife - PE',
    '(81) 98745-3321',
    'João Santos',
    '(81) 99876-1122',
    'Avaliação pediátrica',
    'Bronquite leve; sem internações.',
    'Usa bombinha quando necessário.',
    'feminino',
    'alta',
    'nada',
    'Alergia a penicilina',
    'Paciente demonstra ansiedade antes de procedimentos.'
);

-- =============================
-- SELECTS
-- =============================
SELECT * FROM Enfermeiro;
SELECT * FROM Paciente;
