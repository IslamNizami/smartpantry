# 🌿 Smart Pantry & Recipe Manager

A modern, food-themed SPA for managing kitchen inventory and discovering recipes,
built with React + Vite + Tailwind CSS. Connects to your Spring Boot backend at
`http://localhost:8080/api`.

---

## ⚡ Quick Start (Vite — recommended)

```bash
# 1. Scaffold (if starting fresh — skip if you already have this folder)
npm create vite@latest smart-pantry -- --template react
cd smart-pantry

# 2. Install dependencies
npm install axios lucide-react

# 3. Install Tailwind + PostCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Copy in all the files from this project, then:
npm run dev
# → http://localhost:5173
```

> **Tip:** The Vite dev server automatically **proxies** `/api/*` requests to
> `http://localhost:8080`, so you never hit a CORS error in development.
> (See `vite.config.js` — no changes needed to your Spring Boot `WebMvcConfigurer`.)

---

## 📁 Project Structure

```
smart-pantry/
├── index.html
├── vite.config.js           ← Proxy config → localhost:8080
├── tailwind.config.js       ← Custom forest/sage/cream palette
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx             ← React entry point
    ├── App.jsx              ← Root layout + view router
    ├── index.css            ← Tailwind + custom component classes
    ├── services/
    │   └── api.js           ← All Axios calls (pantryApi + recipeApi)
    └── components/
        ├── Sidebar.jsx          ← Left-nav with logo + item count badge
        ├── PantryDashboard.jsx  ← Inventory table + stats bar
        ├── AddItemForm.jsx      ← Validated add-item form
        └── RecipeSection.jsx    ← Recipe discovery + recipe cards
```

---

## 🌐 Backend API Contract

The frontend expects these endpoints on `http://localhost:8080`:

| Method | Endpoint               | Description                         |
|--------|------------------------|-------------------------------------|
| GET    | `/api/items`           | Get all pantry items                |
| GET    | `/api/items/:id`       | Get single item                     |
| POST   | `/api/items`           | Create item `{ name, quantity, expiryDate }` |
| PUT    | `/api/items/:id`       | Update item                         |
| DELETE | `/api/items/:id`       | Delete item                         |
| GET    | `/api/recipes/suggest` | Get recipe suggestions from pantry  |
| GET    | `/api/recipes/search?query=` | Search recipes              |

### Item JSON shape
```json
{ "id": 1, "name": "Milk", "quantity": 1.0, "expiryDate": "2026-03-25" }
```

### Recipe JSON shape
```json
{
  "title": "Apple Pie",
  "image": "https://…",
  "usedIngredients":   [{ "name": "Apple" }],
  "missedIngredients": [{ "name": "Cinnamon" }]
}
```

---

## 🎨 Design System

| Token          | Value                 |
|----------------|-----------------------|
| Primary green  | `#2e7d32` (forest-500)|
| Accent sage    | `#5d8f51` (sage-500)  |
| Background     | `#f0f7f0` (forest-50) |
| Display font   | DM Serif Display      |
| Body font      | DM Sans               |
| Mono font      | JetBrains Mono        |

---

## ✅ Features Checklist

- [x] Pantry table with ID, Name, Quantity, Expiry Date
- [x] Stats bar (Total / Expiring Soon / Expired)
- [x] Red left border + "Expiring Soon" badge for items ≤ 3 days
- [x] Add Item form with client-side validation
- [x] Delete item with loading state
- [x] Live search / filter within pantry
- [x] Recipe Discovery with "Find Recipes" button
- [x] Recipe cards (title, image, used/missing ingredients)
- [x] Loading skeleton for recipes
- [x] API error handling + retry
- [x] Fully responsive (sidebar collapses on mobile if extended)
- [x] Centralised `services/api.js` with Axios interceptors

---

## 🔧 Extending

### Add authentication (JWT)
In `src/services/api.js`, uncomment and fill in the request interceptor:
```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Add React Router
```bash
npm install react-router-dom
```
Replace the `VIEWS` map in `App.jsx` with `<Routes>` / `<Route>` pairs.

### Add React Query (recommended for caching)
```bash
npm install @tanstack/react-query
```
Wrap `<App>` in `<QueryClientProvider>` and replace `useEffect` fetches with `useQuery`.
