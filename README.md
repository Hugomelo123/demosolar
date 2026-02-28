# SolarOps Luxembourg — Demo Portfolio

> **Portfolio demo construído por Hugo Melo para candidatura a empresas do setor solar no Luxemburgo.**
> Mostra compreensão do negócio + competências full-stack (React 19, TypeScript, PDF, Kanban, testes unitários).

---

## Porquê este projeto?

Estudei o mercado solar luxemburguês e identifiquei um problema operacional concreto: as equipas de vendas e instalação gerem leads, devis, CREOS e instalações com Excel, WhatsApp e papel. O resultado é pipeline invisível, gargalos CREOS que custam semanas, e erros de seguimento.

Esta consola resolve esse problema:
- **Dashboard em 30 segundos** — pipeline total, valor, alertas CREOS, projetos sem contacto
- **Devis em 5 minutos** — cálculo real com Klimabonus 2026, PDF profissional, fourchette indicativa
- **Pipeline Kanban** — Lead → Visita → Devis → CREOS → Instalação → Terminado
- **Checklist de instalação** — por projeto, 3 fases, persistido localmente

O objetivo é mostrar que posso **ser contratado** para ajudar uma empresa solar a digitalizar e escalar as suas operações.

---

## Quick start

**Requisitos:** Node.js 18+, npm.

```bash
git clone https://github.com/Hugomelo123/demosolar.git
cd demosolar
npm install
npm run dev:client
```

Abrir **http://localhost:5002** — dashboard, pipeline e devis visíveis em menos de 30 segundos.

---

## Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| **Devis em 5 min** | Formulário com cálculos em tempo real (kWp, Klimabonus, retorno); PDF profissional; fourchette indicativa. |
| **Adicionar ao pipeline** | Converte o devis num projeto (coluna Devis Enviado); redireciona para detalhe. |
| **Dashboard** | Métricas (leads, devis enviados, CREOS/instalação, valor pipeline); funil; Kanban. |
| **Alertas** | CREOS >21 dias, devis >14 dias, sem contacto >7 dias — com links diretos. |
| **Detalhe do projeto** | Stepper, notas, agendar visita, próxima ação, templates WhatsApp. |
| **Checklist instalação** | Por projeto (pré / dia-de / pós instalação); estado guardado por projeto em `localStorage`. |

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev:client` | Frontend apenas (Vite), http://localhost:5002 |
| `npm run dev` | Full stack (cliente + servidor) |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm test` | Testes unitários (Vitest) — cálculos e regras de negócio |
| `npm run check` | Verificação TypeScript |

---

## Modo demo

- **Sem base de dados.** Dados em React state + `localStorage` (sobrevive a reloads).
- **Reset:** Limpar `localStorage` no browser (chaves `solarops_projects` e `solarops_checklist`) ou abrir em janela privada.

### Regras de cálculo (simplificadas para demo)

- **kWp:** superfície telhado (m²) × 0,17 · **Produção:** kWp × 1150 kWh/ano.
- **Klimabonus (indicativo):** ≤15 kWp → €9.300; >15 kWp → €9.300 + €620/kWp extra; bateria +€2.250.
- **Instalação:** Basic €2.100/kWp, Premium €2.400/kWp; bateria ~€6.500.
- **Poupança anual:** % da fatura anual (baixo 35%, normal 45%, elevado 55%). Custo líquido = max(0, instalação − Klimabonus).
- **Fourchette:** Custo líquido apresentado como banda (ex. €12.000 – €13.440), não preço fixo; ~12% margem no limite superior.

---

## Adaptar para outra empresa ou região

**Branding (ficheiro único):** **`client/src/config/demo.ts`**

- `companyName` — Nome da empresa (navbar, PDF).
- `consoleTagline` — Subtítulo da consola.
- `userName` / `userRole` — Nome e cargo do utilizador (canto superior direito).
- `subsidyName` / `operatorName` — Nome do subsídio e operador de rede (ex. Klimabonus, CREOS).

Todo o copy da UI está em **`client/src/config/opsCopy.ts`**. Regras de cálculo e constantes em **`client/src/lib/calculations.ts`**.

---

## Deploy (link ao vivo para enviar por email)

Para publicar o demo (ex. Vercel ou Netlify): ver **[docs/DEPLOY.md](docs/DEPLOY.md)** — build command: `npm run build`, output: `dist/public`.

---

## Stack técnica

- **Frontend:** React 19, Vite 7, Wouter, Tailwind CSS 4, Radix UI, TanStack Query
- **Backend:** Express 5 (rotas API preparadas, não ligadas ao demo)
- **Tipos:** TypeScript (strict mode), Zod
- **Testes:** Vitest (testes de cálculo e regras de negócio)
- **PDF:** pdf-lib (geração client-side, sem servidor)
- **Drag-and-drop:** dnd-kit

---

## Sobre o autor

**Hugo Melo** — candidato a posições de operações, digital ou gestão comercial no setor solar no Luxemburgo.

- GitHub: [github.com/Hugomelo123](https://github.com/Hugomelo123)
- LinkedIn: [linkedin.com/in/hugomelo123](https://www.linkedin.com/in/hugomelo123)

---

## Licença

MIT
