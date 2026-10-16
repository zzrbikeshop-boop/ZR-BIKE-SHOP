# ZR Bike Shop
1. Create a project at supabase.com, then run `supabase/schema.sql` in the SQL Editor.
2. Authentication > Users > Add user (the shop owner's email + password). Then Authentication > Providers > Email: disable "Allow new users to sign up".
3. `cd frontend`, then `cp .env.example .env` and paste your project URL and anon key.
4. `npm install && npm run dev` (inside `frontend/`)
5. Dashboard: open `/#/admin` (also linked in the footer).
6. Deploy: `npm run build` inside `frontend/`, upload `frontend/dist/` to Netlify/Vercel/Cloudflare Pages and add the same two env vars.
Edit the Facebook link at the top of `frontend/src/config.js`.

## Structure
```
frontend/src/
  main.jsx · App.jsx (language + route) · config.js (phone, social links)
  context/AppContext.jsx       cart, language, open modals
  lib/                         supabase.js · i18n.js (AR/EN texts) · delivery.js (fees)
  styles/base.css              global + shared styles; every component has its own .css next to it
  pages/Home.jsx
  pages/admin/                 Dashboard · Login · OrdersTab · ProductsTab · ProductForm
  components/layout/           Navbar · Footer · Modal
  components/home/             Hero · ProductSection · Reviews
  components/product/          ProductCard · ProductModal
  components/cart/             CartDrawer · Checkout · OrderSuccess
```

## Pictures
- Hero background: `frontend/public/hero.jpg`
- Customer reviews: `frontend/public/reviews/1.jpg … 20.jpg`
- Layout direction (fixed, does not change with language): `LAYOUT_DIR` in `frontend/src/config.js`

## Folders
- `frontend/` : the React website (Vite)
- `supabase/` : the backend, SQL files to run in Supabase (schema.sql, then migration_2/3/4.sql if you already ran an older schema)
