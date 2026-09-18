# What's in my Fridge?

Turn leftover ingredients into delicious meals. Select what you have, get AI recipe ideas, and open a YouTube tutorial for each dish.

## Setup

```bash
npm install
cp .env.example .env.local
```

Optional live AI (otherwise mock recipes are used):

```
OPENAI_API_KEY=sk-...
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Figma MCP (local Dev Mode)

Wired to Figma Desktop Dev Mode MCP:

- Endpoint: `http://127.0.0.1:3845/mcp`
- Config: `.cursor/mcp.json`

Keep Figma open with the `fooD` file so Cursor can pull design context.

## Screens (from Figma)

1. Onboarding  
2. Home (Marina's Kitchen)  
3. Choose Ingredients  
4. Loading (“Cooking up ideas…”)  
5. Your Recipes  
6. Recipe detail  

## Architecture

Swappable modules under `src/components/`:

- `screens/` — Figma-aligned screen shells  
- `ui/` — Button, SearchInput  
- `ingredients/` — chips, categories, picker  
- `recipes/` — recipe cards  
- `layout/` — app shell / navigation  

Ingredient selection persists in `sessionStorage`. Assets from Figma live in `public/figma/`.
