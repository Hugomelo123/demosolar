# MVP — O que está mal e o que melhorar

Resumo do que foi encontrado na codebase: erros, inconsistências e melhorias recomendadas para a demo Luxemburgo. **Só informação** — nada está implementado neste doc.

---

## 1. Texto em inglês (demo é LU/FR)

Muita UI ainda está em inglês. Para uma demo “Luxembourg”, convém francês (ou LU) em todo o lado.

| Onde | Texto atual (EN) | Sugestão (FR) |
|------|-------------------|---------------|
| **QuoteForm** | Toast: "Address required" / "Please enter an address..." | "Adresse requise" / "Saisissez une adresse avant d'ajouter au pipeline." |
| **QuoteForm** | Toast: "Invalid quote" / "Set roof area so..." | "Devis invalide" / "Renseignez la surface du toit pour calculer le kWp." |
| **QuoteForm** | Nota ao adicionar: "with battery" / "no battery" | "avec batterie" / "sans batterie" |
| **QuoteForm** | Nome default: "New lead" | "Nouveau lead" (ou "Lead sans nom") |
| **BottleneckAlert** | "+X more" | "+X autres" |
| **NextActionCard** | "Current Stage:", "Mark Contacted", "Open Install Checklist", "Advance Stage" | "Étape actuelle :", "Marquer contact", "Ouvrir checklist installation", "Passer à l'étape suivante" |
| **NextActionCard** | nextAction valores: "Schedule site visit", "Send quote PDF", etc. | "Planifier visite", "Envoyer devis PDF", "Envoyer dossier CREOS", "Planifier installation", "Clôturer le projet" |
| **project-details** | "Notes & Activity", "Add a note...", "Add" | "Notes et activité", "Ajouter une note...", "Ajouter" |
| **project-details** | "Quick Actions", "Schedule Site Visit", "Date & Time", "Assigned Technician", "Select technician", "Confirm Booking" | "Actions rapides", "Planifier visite", "Date et heure", "Technicien assigné", "Choisir un technicien", "Confirmer" |
| **project-details** | "Call Client", "WhatsApp Templates", "Follow-up:", "Update:", "Install:", "Scheduled Visit", "Tech:" | "Appeler le client", "Modèles WhatsApp", "Relance :", "Mise à jour :", "Install :", "Visite planifiée", "Tech :" |
| **project-details** | "X kWp System" | "X kWp" (ou "Système X kWp") |
| **install-checklist** | "Installation Phase", "Installation Checklist", "Manage the complete...", "Not set", "Unassigned", "Visit Date", "Tech Lead", "System Size" | "Phase installation", "Checklist installation", "Gérer le déroulé...", "Non renseigné", "Non assigné", "Date visite", "Responsable tech", "Puissance" |
| **ChecklistSection** | Todos os labels (Pre-Installation, Building permit received, etc.), "Installation Progress", "Complete Installation Project", "Installation Completed", "Success!", "Project marked as completed..." | Traduzir para FR (ex. "Avant installation", "Permis de construire reçu", "Connexion CREOS", "Acompte client reçu (30%)", etc.) |
| **Stepper (project-details)** | Steps mostrados como "lead", "visit", "quote"... | Pode manter em inglês técnico ou usar "Lead", "Visite", "Devis", "CREOS", "Install", "Terminé" |

**Resumo:** Um único ficheiro de copy (ex. alargar `opsCopy` ou criar `uiCopy.ts`) com todas as strings da UI evita esquecimentos e facilita manutenção.

---

## 2. Checklist “por projeto” não está realmente por projeto

- O **README** diz: *"Checklist de instalação — Por projeto"*.
- Na prática: a página `/install/:id` existe e mostra o projeto certo, mas o **ChecklistSection** usa `useState` local: os itens (permits, CREOS, etc.) **não são guardados por projeto** nem persistidos.
- Se abrires o checklist do Projeto A, marcar alguns itens, fores ao Projeto B e voltares ao A, o estado do checklist do A **volta ao inicial**.

**O que está mal:** A funcionalidade está “por projeto” na navegação, mas o estado do checklist é global/volátil.

**Melhoria:** Persistir o estado do checklist por `projectId` (ex. no contexto dos projetos, ou num objeto `checklistState[projectId]` guardado em `localStorage` junto dos projetos). Assim o README fica correto e a demo fica credível.

---

## 3. README enganador

- **"Checklist de instalação — Por projeto"** — como acima, hoje o checklist não é persistido por projeto. Ou implementas a persistência ou alteras o README para algo como: *"Checklist de instalação (par projet, état en cours)"* ou *"Checklist de instalação — lien par projet (état non persisté)"*.

---

## 4. Pequenos erros de francês no PDF

No `pdf.ts` há termos sem acentos (e um possível typo), que ficam mais corretos em FR:

- "Puissance **installee**" → "Puissance **installée**"
- "Production annuelle **estimee**" → "Production annuelle **estimée**"
- "**Cout** installation" → "**Coût** installation"
- "**Cout** net **estime**" → "**Coût** net **estimé**"
- "Offre ferme **apres** visite" → "Offre ferme **après** visite"

(O WinAnsi do PDF suporta é, è, ê, à, etc., portanto não há problema técnico.)

---

## 5. Navbar: “Hugo M.” e “Sales Director” em código

- Em **Navbar.tsx** o nome "Hugo M." e a função "Sales Director" estão hardcoded.
- Para demo multi-empresa ou para adaptar rápido, o ideal é vir de **config** (ex. `opsCopy` ou `config/demo.ts`): `userName`, `userRole`. Assim mudas num sítio só.

---

## 6. Rota `/install/:id` pouco descoberta

- O utilizador só chega à checklist se for ao **detalhe do projeto** e carregar em **"Open Install Checklist"**, e só quando o projeto está em **"installation"**.
- Não há link no Kanban para “Abrir checklist” nem na lista de projetos. Para a demo, pode ser útil um link mais visível no card do projeto (quando status = installation) ou na página de detalhe sempre que o status for installation, para não parecer funcionalidade escondida.

---

## 7. Possível bug / edge case no valor do pipeline

- Em **QuoteForm**, ao adicionar ao pipeline: `pipelineValue = (netCostMin + netCostMax) / 2` ou `data.netCost`.
- Se por algum bug `netCostMin`/`netCostMax` forem 0 com `netCost` > 0, o projeto pode ficar com valor 0. Verificar que, quando há intervalo, se usa sempre o ponto médio e que os valores vêm corretamente de `calculateNetCostRange`.

---

## 8. Resumo prioritário

| Prioridade | O quê | Impacto na demo |
|------------|--------|------------------|
| **Alta** | Traduzir toda a UI visível para FR (toasts, botões, labels, placeholders) | Demo LU coerente; evita “metade EN, metade FR”. |
| **Alta** | Checklist persistido por projeto (ou README corrigido) | Honestidade da doc e da funcionalidade. |
| **Média** | Acentos no PDF (installée, coût, après, etc.) | Profissionalismo do devis. |
| **Média** | Nome/função do utilizador (Hugo M. / Sales Director) na config | Facilita adaptar a outra empresa. |
| **Baixa** | Link mais visível para “Checklist installation” a partir do Kanban/detalhe | Melhor descoberta da funcionalidade. |

Se quiseres, no próximo passo podemos implementar só as traduções para FR e a persistência do checklist por projeto; o resto pode ficar para uma segunda volta.
