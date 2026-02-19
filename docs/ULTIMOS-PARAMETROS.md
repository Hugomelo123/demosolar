# Últimos parâmetros (revisão)

Resumo do que foi configurado para chegar à nota **9/10** e estar pronto para apresentar por email.

---

## 1. Config única de branding — `client/src/config/demo.ts`

| Parâmetro        | Valor atual           | Onde aparece                    |
|-----------------|------------------------|---------------------------------|
| **companyName** | SolarOps Luxembourg   | Navbar, PDF                     |
| **consoleTagline** | Console opérations | Navbar (subtítulo)              |
| **userName**    | Hugo M.                | Navbar (canto superior direito) |
| **userRole**    | Sales Director         | Navbar                          |
| **subsidyName** | Klimabonus             | Reservado para PDF/copy         |
| **operatorName**| CREOS                  | Reservado para alertas/copy     |

**Para outra empresa ou região:** alterar só este ficheiro.

---

## 2. Copy e UI (FR) — `client/src/config/opsCopy.ts`

- **Dashboard:** headline "Vos opérations en un coup d'œil", métricas em FR (Nouveaux leads, Devis envoyés, Valeur pipeline), pipeline "Pipeline — tous les projets", gargalos "agir avant qu'ils ne coûtent cher".
- **Quote:** labels do formulário e da grille em FR; toasts e botões em FR.
- **Outros:** next action, detalhe do projeto, checklist, alertas — tudo em FR.
- A identidade (companyName, userName, etc.) vem de **demo.ts**; o resto são strings em **opsCopy**.

---

## 3. Regras de cálculo — `client/src/lib/calculations.ts`

Constantes no topo do ficheiro (Klimabonus, tarifas, margem ~12 %, etc.). Para outro país ou ano, alterar aqui. **Testes:** `npm test` (14 testes Vitest).

---

## 4. Documentação

| Onde            | O quê                                                                 |
|-----------------|-----------------------------------------------------------------------|
| **README**      | Quick start (recrutadores) no topo; secção "Para outra empresa" (demo.ts + opsCopy + calculations); link para **docs/DEPLOY.md**. |
| **docs/DEPLOY.md** | Instruções curtas para Vercel e Netlify (build, output `dist/public`) para ter link para email. |
| **docs/AVALIACAO-ATUAL.md** | Nota 9/10; tabela por área; pontos fortes e resumo.              |
| **docs/CONCLUSAO.md**       | Estado do projeto e nota 9/10.                                    |

---

## 5. Checklist rápido antes de enviar por email

1. **demo.ts** — Nome da empresa e do utilizador corretos para a candidatura?
2. **npm test** — Todos a passar?
3. **npm run dev:client** — App a abrir em http://localhost:5002?
4. Se tiveres deploy: **docs/DEPLOY.md** — Build command e Publish directory (`dist/public`) corretos?

Com isto, os últimos parâmetros estão revistos e alinhados com a avaliação atual (9/10).
