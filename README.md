# SolarOps — Consola de Operações para Instaladores Solares

**Demo construído por Hugo Melo** | Luxemburgo, 2026

---

## O problema que vi no terreno

A maior parte das empresas de instalação solar no Luxemburgo ainda gere o pipeline com Excel, mensagens de WhatsApp e notas em papel.

Resultado concreto:
- Um comercial envia um devis e não sabe se o cliente o abriu
- Ninguém sabe em que fase está o dossier CREOS — até que o cliente liga a perguntar
- O responsável de obra não sabe que técnico está em que chantier hoje
- Quando a equipa cresce, as informações ficam dispersas entre telemóveis pessoais
- Leads entram, mas ninguém os segue a tempo — e perdem-se para a concorrência

Estes não são problemas de tecnologia. São problemas de **visibilidade e coordenação** — e custam tempo, clientes e margem.

---

## O que esta consola resolve

### 1. Pipeline sempre visível

Um Kanban com todas as obras ativas: Prospection → Visite → Devis → CREOS → Installation → Raccordement → Terminé.

Qualquer pessoa da equipa vê em 30 segundos onde está cada projeto, quem é o responsável, e qual é o próximo passo.

**Alertas automáticos** quando algo está bloqueado:
- Dossier CREOS há mais de 21 dias sem resposta
- Devis enviado há mais de 14 dias sem feedback do cliente
- Projeto sem contacto há mais de 7 dias

Deixa de precisar que o gestor pergunte "então, onde está o projeto do Schmit?"

---

### 2. Devis profissional em 5 minutos

Preenches a superfície do telhado, o tipo de consumo e o cliente — a consola calcula:
- Potência do sistema (kWp)
- Subvenção Klimabonus 2026 aplicável
- Custo líquido estimado com margem
- Período de retorno do investimento

Gera um PDF de devis pronto a enviar, com os dados do cliente e os detalhes técnicos e financeiros.

**Problema que resolve:** evitar devis feitos à mão em Word com erros de cálculo, ou comerciais que demoram 2 dias a preparar uma proposta simples.

---

### 3. Seguimento WhatsApp com um clique

Para cada projeto, há modelos de mensagem prontos:
- Relance após envio de devis
- Actualização CREOS em curso
- Confirmação de data de instalação

O comercial clica, vê a prévia da mensagem, e envia. O evento fica registado no histórico do projeto.

**Problema que resolve:** mensagens esquecidas, seguimentos inconsistentes entre comerciais, histórico de contacto perdido no telemóvel de alguém.

---

### 4. Vista de equipa no terreno

Uma página de despacho para o escritório ver, em tempo real:
- Que técnico está em que chantier
- Morada, cliente, kWp, estado da obra
- Projetos activos sem técnico atribuído

**Problema que resolve:** o responsável a ligar para cada técnico de manhã a perguntar onde está e o que tem para hoje.

---

### 5. Histórico por projeto

Cada vez que um estado muda, uma nota é adicionada, um contacto é marcado, ou uma mensagem é enviada — fica registado com data e hora no projeto.

**Problema que resolve:** "quem disse o quê ao cliente e quando?" — uma pergunta que cria conflitos internos e perde negócios quando a resposta não existe.

---

### 6. Checklist de instalação por obra

Antes, durante e depois da instalação — checklists estruturadas por projeto, com progresso visível.

**Problema que resolve:** instalações que ficam incompletas porque um passo foi esquecido, ou onde ninguém sabe se a documentação final foi entregue ao cliente.

---

## Para quem é isto

Esta consola foi pensada para empresas de instalação solar de 3 a 30 pessoas que:

- Já têm pipeline suficiente para perder o controlo sem uma ferramenta
- Querem profissionalizar o seguimento de clientes sem contratar mais pessoal administrativo
- Estão a crescer e precisam que toda a equipa fale a mesma linguagem operacional

Não requer formação técnica. Qualquer comercial, técnico ou gestor consegue usar no primeiro dia.

---

## Demo ao vivo

A demo utiliza dados fictícios de projetos em Luxemburgo. Não requer login.

**O que podes testar:**
- Abrir o dashboard e ver o estado do pipeline em 30 segundos
- Criar um devis e gerar o PDF
- Ver os alertas CREOS e de seguimento
- Consultar o histórico de um projeto
- Ver a distribuição da equipa no terreno

---

## Sobre o autor

**Hugo Melo** — experiência em operações e gestão de projetos, com foco no setor solar luxemburguês.

Construí esta consola para demonstrar que entendo os problemas operacionais reais de uma empresa de instalação — não apenas a tecnologia, mas o dia-a-dia de vendas, CREOS, equipas de terreno e follow-up de clientes.

Disponível para posições de gestão de operações, coordenação comercial ou transformação digital no setor solar.

- GitHub: [github.com/Hugomelo123](https://github.com/Hugomelo123)
- LinkedIn: [linkedin.com/in/hugomelo123](https://www.linkedin.com/in/hugomelo123)

---

## Informação técnica (resumida)

A consola funciona no browser, sem instalação de servidor ou base de dados. Os dados ficam guardados localmente.

Para equipas reais, a arquitetura está preparada para ligação a base de dados e autenticação multi-utilizador — não foi implementado porque o objetivo desta versão é demonstrar as operações, não a infraestrutura.

> Stack: React 19, TypeScript, Express, Tailwind CSS, pdf-lib — ver código fonte para detalhes.
