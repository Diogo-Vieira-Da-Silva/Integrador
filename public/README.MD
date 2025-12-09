Prioridades:

Tela de login com cpf, telefone, nome e senha que inclui regex (prioridade alta)  ✅

nome, sobrenome, cpf(email), telefone, senha, sexo, data da contratação, data de nascimento, diploma, cargo (complementos)   ✅

Modo alternativo de login com email e senha que inclui regex (prioridade baixa)  ✅

Logo do sensecare na página de login e na página dos padrão (prioridade baixa)  ✅


Tela inicial com mensagem de bem vindo com as bordas da direita e esquerda em azul (prioridade mediana)  ✅

Segunda tela onde você vai registra os pacientes, incluindo nome, telefone, sexo,  (prioridade alta)✅

nome, sobrenome, data de nascimento, cpf, endereço, telefone, nome do(a) responsável, telefone do(a) responsável, sexo, procedimento, enfermeiro(a), histórico de doenças alergias e etc.., medicações, alergias, prioridade de atendimento, especificações ✅

Botões ao lado do paciente registrado para excluir ele ou então adicionar cuidados, como medicina, horários de troca de decúbito, hidratação e etc..(prioridade mediana) ✅

medicação, banho de leito, hidratação, mudança de decúbito, outro.  observações, data do cuidado e horário ✅

Agenda para cuidados pendentes e cuidados já concluídos(irá ser adicionado quando marcar um cuidado como concluído) (prioridade mediana) ✅

Botão de sair, o que vai te levar para a tela de login(prioridade baixa) ✅

Botão de conectar com pulseira (abrirá uma pequena página com os alertas verde, amarelo e vermelho e as descrições para quando são soados, e ao clicar neles, vai gerar um alerta simulando caso fossem realmente soados e eles ficarão registrados) (prioridade alta) ✅


----------------

 📝 Relato do Processo de Desenvolvimento

O desenvolvimento do projeto iniciou-se pela criação dos arquivos HTML e JavaScript, onde estruturei o formulário e a lógica do sistema com base em experiências anteriores. Busquei manter o código o mais limpo possível, priorizando organização, detalhamento e clareza desde o início.

Em seguida, realizei os ajustes visuais utilizando Bootstrap, o que permitiu melhorar a aparência e a usabilidade da interface de forma prática. Posteriormente, adaptei meu código SQL para atender às necessidades específicas deste projeto. Considero que meu principal erro foi ter iniciado pelo front-end antes de estruturar o banco de dados, o que exigiu diversas alterações no código ao longo do processo.

Apesar disso, essa dificuldade trouxe um aprendizado importante. Utilizei projetos anteriores como referência para compreender melhor como deveria criar a estrutura do MySQL de forma mais eficiente. Aos poucos, fui revisando, adaptando e reorganizando o banco de dados para que ele funcionasse corretamente em conjunto com o sistema.

Durante os testes, identifiquei e corrigi problemas que impediam o funcionamento adequado do localhost, especialmente após modificações nos arquivos HTML e JavaScript. Com o apoio e orientação do Kilo Code e do ChatGPT, consegui compreender melhor os erros e aplicar soluções eficazes.

Ao final do processo, consegui concluir um sistema funcional, estável e integrado, o que representou um grande avanço no meu aprendizado e na minha confiança para trabalhar com integração entre front-end, back-end e banco de dados.

--------------

⚙️ Como configurar o projeto 

📌 1. Inicialização do Node.js No terminal, execute: npm init -y Em seguida, instale as dependências principais: npm install express mysql2 Esses pacotes são essenciais para que o servidor funcione e possa se comunicar com o MySQL, eles que instalam o package-lock.json, node_modules e package.json.

 📁 Estrutura recomendada do projeto Crie a seguinte organização de arquivos: /public ├── index.html ├── script.js └── style.css server.js A pasta public deve conter os arquivos do front-end e o arquivo server.js será responsável pelo servidor Express e pela conexão com o MySQL. 
 
 ▶️ Como executar o sistema Após tudo configurado, basta rodar: node server.js(no meu caso o m.js) O servidor iniciará e o projeto estará pronto para uso.