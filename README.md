# Noha.ro — Astro pe Cloudflare Workers

Site-ul agenției Noha, reconstruit în Astro pentru Cloudflare Workers (cu static assets).

## Dezvoltare locală

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Preview pe runtime Cloudflare

```bash
npm run preview:cf
```

## Deploy

```bash
npx wrangler login
npm run deploy
```

Apoi leagă domeniul `noha.ro` în Cloudflare Dashboard → Workers & Pages → custom domains.

### Formular contact

1. Creează o cheie pe [web3forms.com](https://web3forms.com) cu emailul `contact@noha.ro`
2. Adaugă secretul `WEB3FORMS_ACCESS_KEY` în Cloudflare (Worker → Settings → Variables)

## Structură

| Path | Rol |
|------|-----|
| `src/pages/` | Pagini + API contact |
| `src/content/blog/` | Articole Markdown |
| `src/data/site.ts` | Contact, servicii, FAQ |
| `wrangler.jsonc` | Config Cloudflare Worker |
