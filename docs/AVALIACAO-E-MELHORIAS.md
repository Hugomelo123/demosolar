# Análise do projeto — Nota e recomendações (demo para várias empresas)

## 1. Nota global e por área

| Área | Nota (0–10) | Comentário |
|------|-------------|------------|
| **Funcionalidade** | 8 | Quote, pipeline, Kanban, alertas, PDF, intervalo de preço; checklist não é por projeto. |
| **Código / tipos** | 8 | TypeScript strict, cálculos em constantes, tipos claros; alguns textos hardcoded. |
| **UI/UX** | 8 | Design coerente, responsivo, feedback (toast), intervalo de orçamento bem exposto. |
| **Regras de negócio** | 8 | Klimabonus, custos, intervalo, netCost ≥ 0 documentados em `calculations.ts`. |
| **Multi-empresa / demo** | 4 | Nome, utilizador, subsídio e operador de rede fixos para “Luxembourg”; pouco reutilizável. |
| **Documentação** | 7 | README e regras de cálculo ok; falta doc de configuração e multi-empresa. |
| **Manutenção** | 7 | Estrutura clara; sem testes; branding espalhado por muitos ficheiros. |

**Nota global: 7,2 / 10**

O projeto está sólido como **demo para uma empresa no Luxemburgo**. Para servir como **demo para várias empresas** (outros nomes, regiões, subsídios), o branding e as referências regionais estão muito fixos e devem ser tornados configuráveis.

---

## 2. Pontos fortes

- Fluxo completo: quote → intervalo de preço → Add to Pipeline → detalhe → Kanban.
- Cálculos centralizados, constantes nomeadas e intervalo de orçamento (não valor fixo).
- PDF e UI alinhados (range, “indicative”, “final quote after site visit”).
- Persistência em `localStorage` e validações (endereço, kWp) com toast.
- README com regras de cálculo e nota sobre intervalo.

---

## 3. O que melhorar (com foco em demo para várias empresas)

### 3.1 Configuração de branding e região (prioridade alta)

**Problema:** Nome da empresa (“SolarOps Luxembourg”), nome do utilizador (“Hugo M.”), subsídio (“Klimabonus”), operador de rede (“CREOS”) e locale (`lb-LU`) estão hardcoded. Uma demo para várias empresas deve permitir trocar isso sem alterar código.

**Recomendação:**

- Criar um ficheiro de configuração da demo, por exemplo `client/src/config/demo.ts` (ou `config/branding.json`), com algo como:

```ts
// config/demo.ts
export const demoConfig = {
  companyName: 'SolarOps Luxembourg',
  companyTagline: 'Premium Solar Installation Proposal',
  userName: 'Hugo M.',
  userRole: 'Sales Director',
  userInitials: 'HM',
  // Região/subsídio (permite trocar para outro país)
  region: {
    locale: 'lb-LU',           // ou 'de-DE', 'fr-FR', 'pt-PT'
    subsidyName: 'Klimabonus', // ex: "Klimabonus", "Förderung", "Subsídio"
    subsidyYear: '2026',
    gridOperatorName: 'CREOS', // ex: "CREOS", "RTE", "REN"
  },
};
```

- Navbar: usar `demoConfig.companyName`, `demoConfig.userName`, `demoConfig.userRole`, `demoConfig.userInitials`.
- PDF: usar `demoConfig.companyName`, `demoConfig.companyTagline`, `demoConfig.region.subsidyName` e ano.
- Páginas e componentes: usar `demoConfig.region.subsidyName` e `demoConfig.region.gridOperatorName` em vez de “Klimabonus” e “CREOS” em textos visíveis.
- `formatCurrency` e `formatDate` em `utils.ts`: usar `demoConfig.region.locale` (ou um parâmetro que venha dessa config).
- WhatsApp em `project-details.tsx`: usar `demoConfig.companyName` em vez de “SolarOps”.

Assim, cada empresa (ou cada sessão de demo) pode ter o seu nome, utilizador e rótulos de subsídio/rede sem tocar na lógica.

---

### 3.2 Colunas do Kanban e “CREOS” (prioridade média)

**Problema:** A coluna e os alertas usam o nome “CREOS” (específico do Luxemburgo).

**Recomendação:**

- Título da coluna: usar config, por exemplo `{gridOperatorName} Pending` (em vez de “CREOS Pending”). Se não houver operador configurado, usar um termo genérico como “Grid approval” ou “Approval pending”.
- BottleneckAlert, FollowUpBadges, NextActionCard: idem, usar `demoConfig.region.gridOperatorName` quando o texto for “CREOS”.
- Manter o `status: 'creos'` no tipo/backend como identificador interno; só a **etiqueta** visível é que muda com a config.

---

### 3.3 Mensagens WhatsApp e idioma (prioridade média)

**Problema:** Textos em francês fixos (“Bonjour”, “Cordialement, SolarOps”, “Votre dossier CREOS…”). Para várias empresas, pode ser necessário outro idioma ou tom.

**Recomendação:**

- Incluir na config templates por tipo de mensagem (ex.: `followUpQuote`, `gridPending`, `installConfirm`) ou pelo menos `greeting` e `signature` (ex.: “Cordialement, {companyName}”).
- Assinatura: usar sempre `demoConfig.companyName` em vez de “SolarOps”.
- Opcional: campo `locale` ou `language` na config para, no futuro, escolher conjuntos de textos (fr, en, de, pt).

---

### 3.4 Checklist por projeto (prioridade média)

**Problema:** O checklist de instalação é global (estado local no componente), não por projeto. Ao mudar de projeto, o checklist é o mesmo.

**Recomendação:**

- Guardar o estado do checklist por `projectId` (ex.: no contexto dos projetos ou num mapa `projectId → checklist state`).
- Persistir no mesmo sítio que os projetos (ex. junto ao objeto do projeto em `localStorage`), para a demo continuar sem backend.

---

### 3.5 Mock data e primeiro uso (prioridade baixa)

**Problema:** `initialProjects` é sempre Luxemburgo (nomes, endereços, +352). Para uma demo genérica, pode fazer sentido ter um conjunto mais neutro ou vários conjuntos por “região”.

**Recomendação:**

- Opção A: manter um único mock “Luxembourg” como default e referir no README que é um exemplo; outras empresas podem substituir por outro array.
- Opção B: na config, permitir `demoConfig.region.mockDataKey: 'lu' | 'generic'` e carregar `initialProjectsLU` ou `initialProjectsGeneric` (nomes e endereços mais genéricos, telefones sem indicativo fixo).

---

### 3.6 Testes e qualidade (prioridade média)

**Problema:** Não há testes. Para evoluir sem regredir (especialmente com várias configs), os cálculos e a lógica de negócio são bons candidatos a testes.

**Recomendação:**

- Testes unitários para `calculations.ts`: `calculateKlimabonus`, `calculateNetCost`, `calculateNetCostRange`, `calculatePayback` com vários inputs (incl. edge cases: 0, negativo, bónus > custo).
- Pelo menos um teste que garanta que o intervalo (min/max) está consistente com a margem configurada.

---

### 3.7 README e doc para multi-empresa (prioridade média)

**Problema:** README descreve o produto como “SolarOps Luxembourg” e “Klimabonus”; não explica como adaptar a demo a outra empresa ou região.

**Recomendação:**

- Secção “Demo para várias empresas” no README: onde está a config (ex.: `client/src/config/demo.ts`), quais campos alterar (nome, utilizador, locale, nome do subsídio, nome do operador de rede).
- Referência a este ficheiro (`docs/AVALIACAO-E-MELHORIAS.md`) para detalhe das melhorias.

---

## 4. Resumo das prioridades

1. **Alta:** Config centralizada (nome da empresa, utilizador, região, subsidyName, gridOperatorName, locale) e usar em Navbar, PDF, quote, dashboard, alertas, Kanban e WhatsApp.
2. **Média:** Checklist por projeto e persistido; testes para `calculations.ts`; README multi-empresa.
3. **Baixa:** Mock data opcional por região; templates de WhatsApp configuráveis.

Com a config de branding e região implementada, a mesma base de código serve como **demo para várias empresas**, mudando apenas um ficheiro de configuração (e, se quiseres, no futuro um seletor de “empresa” ou “região” na UI).
