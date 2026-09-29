# 🌿 Smart Pantry & Recipe Manager

A full-stack web app for tracking what's in your kitchen and discovering recipes you can cook with it. Add pantry items with quantities and expiry dates, get flagged when food is about to expire, and get recipe suggestions based on your current ingredients via the [Spoonacular API](https://spoonacular.com/food-api).

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Spring Boot (Java 17) + Spring Security + JPA
- **Database:** MySQL
- **Auth:** Email/password with email verification, or Google OAuth2, issuing stateless JWTs

---

## ✨ Features

- **Pantry management:** add, edit, delete, and "use" a partial amount of an item; items are categorised and measured in units (g, kg, ml, l, pcs, tbsp, cups)
- **Smart merging:** adding an item that already exists (case-insensitive) increases its quantity instead of creating a duplicate
- **Expiry tracking:** items are classified as `FRESH`, `EXPIRING_SOON` (within 3 days) or `EXPIRED`; a dedicated endpoint returns urgent items
- **Recipe suggestions:** ingredients from your pantry are sent to Spoonacular's *find by ingredients* endpoint, with pagination ("Load more")
- **Recipe search:** free-text recipe search and a detail modal with ingredients and steps
- **Authentication:**
  - Register with email + password (8–16 chars), then verify via an emailed link (valid 24 h)
  - Log in with email/password or **Sign in with Google**
  - JWT (24 h) attached to every request by an Axios interceptor
- **Marketing pages:** Landing, About and Contact pages; login/register in a modal

---

## 🏗 Architecture

```
┌────────────────────┐   /api/*  (Bearer JWT)   ┌───────────────────────┐
│  React SPA (Vite)  │ ───────────────────────▶ │  Spring Boot REST API │
│  localhost:5173    │ ◀─────────────────────── │  localhost:8080       │
└────────────────────┘                          └──────┬───────┬────────┘
        ▲                                              │       │
        │  redirect with ?token=<jwt>                  │       └──▶ Spoonacular API
        │                                              ▼            (recipes)
        └──── Google OAuth2 ◀────────────────────  MySQL  +  SMTP (verification email)
```

---

## 📁 Project Structure

```
smartpantry/
├── backend/                         # Spring Boot app (Gradle)
│   ├── build.gradle
│   └── src/main/
│       ├── resources/application.properties
│       └── java/com/example/smartpantry/
│           ├── SmartpantryApplication.java
│           ├── config/              # SecurityConfig, JwtAuthenticationFilter,
│           │                        # CustomOAuth2SuccessHandler, DataInitializer,
│           │                        # RestTemplateConfig, JacksonConfig
│           ├── controller/          # AuthController, PantryController, RecipeController
│           ├── service/             # AuthService, PantryService, RecipeService,
│           │                        # JwtService, EmailService, UserDetailsServiceImpl
│           ├── repository/          # User, Role, VerificationToken, PantryItem
│           ├── model/
│           │   ├── entity/          # User, Role, VerificationToken, PantryItem
│           │   ├── dto/             # Request/response DTOs
│           │   └── enums/           # Category, Unit
│           └── exception/           # GlobalExceptionHandler
└── frontend/                        # React SPA (Vite)
    ├── vite.config.js               # dev server :5173, proxies /api → :8080
    ├── tailwind.config.js           # forest / sage / cream palette
    └── src/
        ├── main.jsx, App.jsx        # entry point + view switching / auth state
        ├── services/api.js          # Axios instance, JWT interceptor, authApi/pantryApi/recipeApi
        └── components/
            ├── Navbar, Sidebar, LandingPage, AboutPage, ContactPage
            ├── AuthModal, AuthPage
            ├── PantryDashboard, AddItemForm
            └── RecipeSection        # suggestions, search, detail modal
```

---

## 🚀 Getting Started

### Prerequisites

| Tool    | Version |
|---------|---------|
| JDK     | 17+     |
| Node.js | 18+     |
| MySQL   | 8.x     |

You will also need:

- a free **Spoonacular API key** — https://spoonacular.com/food-api
- an SMTP account for verification emails (the project is set up for [Mailtrap](https://mailtrap.io) sandbox)
- **Google OAuth2 credentials** — https://console.cloud.google.com/apis/credentials  
  Add `http://localhost:8080/login/oauth2/code/google` as an authorised redirect URI.

### 1. Database

```sql
CREATE DATABASE smartpantry;
```

Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`), and the `ROLE_USER` / `ROLE_ADMIN` roles are seeded on first start by `DataInitializer`.

### 2. Backend

Edit `backend/src/main/resources/application.properties` (or better, override with environment variables, see [Security notes](#-security-notes)):

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/smartpantry
spring.datasource.username=<db-user>
spring.datasource.password=<db-password>

spoonacular.api.key=<your-spoonacular-key>
spoonacular.api.url=https://api.spoonacular.com/recipes/findByIngredients
spoonacular.api.search.url=https://api.spoonacular.com/recipes/complexSearch

spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=<smtp-user>
spring.mail.password=<smtp-password>

spring.security.oauth2.client.registration.google.client-id=<google-client-id>
spring.security.oauth2.client.registration.google.client-secret=<google-client-secret>
spring.security.oauth2.client.registration.google.scope=profile,email
```

Run it:

```bash
cd backend
./gradlew bootRun          # Windows: gradlew.bat bootRun
# → http://localhost:8080
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

---

## 🔐 Authentication Flow

**Email + password**

1. `POST /api/auth/register` → user saved (disabled) + verification token emailed
2. User clicks the link → `GET /api/auth/verify?token=…` enables the account
3. `POST /api/auth/login` → returns a JWT string
4. Frontend stores it in `localStorage` (`sp_token`) and sends `Authorization: Bearer <jwt>`

**Google**

1. Frontend links to `http://localhost:8080/oauth2/authorization/google`
2. After consent, `CustomOAuth2SuccessHandler` finds or creates the user (`provider=GOOGLE`, already enabled), issues a JWT, and redirects to `http://localhost:5173/login-success?token=<jwt>`
3. `App.jsx` reads `?token=`, stores it, and opens the pantry view

Any `401/403` response clears the token and returns the user to the home page.

---

## 📡 API Reference

Base URL: `http://localhost:8080/api`. All endpoints except `/auth/**` require a valid JWT.

### Auth

| Method | Endpoint                | Description                                  |
|--------|-------------------------|----------------------------------------------|
| POST   | `/auth/register`        | Register `{ email, password }`               |
| GET    | `/auth/verify?token=`   | Verify email address                         |
| POST   | `/auth/login`           | Log in `{ email, password }` → JWT           |

### Pantry items

| Method | Endpoint             | Description                                                        |
|--------|----------------------|--------------------------------------------------------------------|
| GET    | `/items`             | List all items                                                     |
| POST   | `/items`             | Add item (merges quantity if the name already exists)              |
| PUT    | `/items/{id}`        | Update an item                                                     |
| PUT    | `/items/{id}/use?amount=` | Subtract an amount; the item is deleted when it reaches 0     |
| DELETE | `/items/{id}`        | Delete an item                                                     |
| GET    | `/items/urgent`      | Items expiring within 3 days (or already expired)                  |

Item payload:

```json
{
  "name": "Milk",
  "quantity": 1.5,
  "unit": "LITERS",
  "category": "DAIRY",
  "expiryDate": "2026-10-12"
}
```

- **Categories:** `FRUITS, VEGETABLES, DAIRY, MEAT, SEAFOOD, PANTRY_STAPLES, BAKERY, FROZEN, BEVERAGES, SNACKS`
- **Units:** `PIECES, GRAMS, KILOGRAMS, MILLILITERS, LITERS, TABLESPOONS, CUPS`

### Recipes

| Method | Endpoint                                   | Description                                             |
|--------|--------------------------------------------|---------------------------------------------------------|
| GET    | `/recipes/suggest?limit=6&offset=0`        | Recipes matching current pantry ingredients             |
| GET    | `/recipes/search?query=&limit=6&offset=0`  | Free-text recipe search                                 |
| GET    | `/recipes/{id}/information`                | Full recipe details (ingredients, instructions)         |

### Errors

- Validation failures → `400` with `{ "field": "message" }`
- Other runtime exceptions → `400` with a plain-text message

---

## 🧰 Tech Stack

**Backend:** Spring Boot 4.0.4, Spring Web MVC, Spring Data JPA (Hibernate), Spring Security, OAuth2 Client, Spring Mail, Bean Validation, JJWT 0.12, Lombok, MySQL Connector/J (H2 is also on the classpath)

**Frontend:** React 18, Vite 5, Tailwind CSS 3, Axios, lucide-react, ESLint

---


## 📄 License

No license is specified yet. Add a `LICENSE` file (e.g. MIT) if you plan to share the project.
