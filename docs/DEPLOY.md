# Deploy da demo (link para enviar por email)

Para ter um **link público** da demo (ex. para enviar por email em candidaturas), podes usar Vercel ou Netlify (grátis).

## Opção 1: Vercel

1. Cria conta em [vercel.com](https://vercel.com) (grátis).
2. Instala a CLI: `npm i -g vercel` (ou usa o site sem CLI).
3. Na raiz do projeto:
   ```bash
   npm run build
   ```
4. No Vercel: **Add New Project** → importa o repositório Git (GitHub/GitLab).
5. **Build settings:**
   - **Root Directory:** (deixar em branco ou `.`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/public` (a build do Vite gera em `dist/public`)
   - **Install Command:** `npm install`
6. Deploy. O Vercel dá-te um URL tipo `solarops-xxx.vercel.app`.

**Nota:** Se a app usar apenas o frontend (sem servidor Express em produção), o Output Directory é o que o `npm run build` gera. No script atual, a build do cliente vai para `dist/public` — confirma no teu `package.json` / `vite.config.ts` e usa esse path no Vercel.

## Opção 2: Netlify

1. Conta em [netlify.com](https://netlify.com) (grátis).
2. **Add new site** → **Import an existing project** → liga o repo.
3. **Build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/public` (ou o que o teu build indicar)
4. Deploy. URL tipo `xxx.netlify.app`.

## Depois do deploy

Usa o link no email: *"Demo: https://solarops-xxx.vercel.app"* (ou Netlify). Assim quem recruta abre a app em um clique.
