# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Supabase

- **Client file:** [src/lib/supabaseClient.js](src/lib/supabaseClient.js) — imports `@supabase/supabase-js` and exports a `supabase` client.
- **Environment:** create a local env file `.env.local` (this repo contains an example `.env.example`). The client reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env.

Example `.env.local` values (already provided in this workspace):

```
VITE_SUPABASE_URL=https://hivoufixkzzhlwcxcdtw.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED_IN_REPO_EXAMPLE
```

Basic usage example (in any component or store):

```
import { supabase } from './lib/supabaseClient';

// fetch rows from a table named 'customers'
const { data, error } = await supabase.from('customers').select('*');
```
