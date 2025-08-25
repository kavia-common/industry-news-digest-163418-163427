# Industry News Digest Frontend (React) — Architecture Overview

This document describes the architecture of the Industry News Digest frontend application implemented in React. It covers the major components, state management, routing, services, and the primary data and control flows. The intent is to provide a high-level mental model that aligns with the current codebase so new contributors can quickly understand how the application is structured.

Application scope and purpose
The frontend provides a dashboard-style interface for authenticated users to browse daily headlines, view article details, adjust notification preferences, search the archive, and manage email subscriptions. In development or when no backend is configured, the app uses an in-memory mock API to simulate server endpoints.

Key technologies and patterns
- React 18 with functional components and hooks
- React Router v6 for client-side routing
- Zustand for authentication/session state
- A simple services layer (services/api.js) that talks to a REST API or a local mock fallback
- Presentational components for tiles and article cards
- CSS with variables and a light theme

High-level architecture diagram

```mermaid
flowchart TD
  subgraph UI["UI Layer (React Components & Pages)"]
    Layout["Layout (Sidebar, Topbar, Shell)\nsrc/App.js -> Layout()"]
    RequireAuth["RequireAuth (Route Guard)\nsrc/App.js -> RequireAuth()"]
    Dashboard["Page: Dashboard\nsrc/pages/Dashboard.js"]
    Archive["Page: Archive\nsrc/pages/Archive.js"]
    ArticleDetail["Page: ArticleDetail\nsrc/pages/ArticleDetail.js"]
    Preferences["Page: Preferences\nsrc/pages/Preferences.js"]
    EmailSub["Page: EmailSubscription\nsrc/pages/EmailSubscription.js"]
    Login["Page: Login\nsrc/pages/Login.js"]
    Register["Page: Register\nsrc/pages/Register.js"]
    SummaryTile["Component: SummaryTile\nsrc/components/SummaryTile.js"]
    ArticleCard["Component: ArticleCard\nsrc/components/ArticleCard.js"]
    ProtectedNote["Component: ProtectedNote\nsrc/components/ProtectedNote.js"]
  end

  subgraph State["State Management"]
    AuthStore["Zustand Auth Store\nsrc/store/authStore.js\n- user/token\n- isAuthenticated\n- bootstrap/login/logout/register"]
  end

  subgraph Services["Services Layer"]
    API["API Client (REST or Mock)\nsrc/services/api.js\n- apiLogin/apiRegister/apiLogout/apiMe\n- apiListArticles\n- apiGet/UpdatePreferences\n- apiUpdateSubscription"]
  end

  subgraph External["External Interfaces"]
    Backend["Optional Backend REST API\n(REACT_APP_API_BASE)"]
    Mock["In-Memory Mock Handlers\n(fallback when no backend)"]
  end

  %% Routing and layout
  Layout -->|wraps| Dashboard
  Layout --> Archive
  Layout --> ArticleDetail
  Layout --> Preferences
  Layout --> EmailSub
  Layout --> Login
  Layout --> Register

  %% Route guard
  RequireAuth -->|protects| Dashboard
  RequireAuth --> ArticleDetail
  RequireAuth --> Preferences
  RequireAuth --> Archive
  RequireAuth --> EmailSub
  AuthStore --> RequireAuth

  %% Component composition
  Dashboard --> SummaryTile
  Dashboard --> ArticleCard
  Dashboard --> ProtectedNote
  Archive --> ArticleCard
  ArticleDetail --> ArticleCard

  %% Data flows to services
  Dashboard -->|fetch articles, prefs| API
  Archive -->|search articles| API
  Preferences -->|get/update prefs| API
  EmailSub -->|get/update email subscription| API
  Login -->|login| API
  Register -->|register| API
  AuthStore -->|me/logout| API

  %% API routes to backend or mock
  API -->|REACT_APP_API_BASE set| Backend
  API -->|fallback (no backend)| Mock
```

How things fit together

1. Entry, layout, and routing
- App.js wires the BrowserRouter, Routes, and each route element. The Layout component provides the persistent UI chrome: sidebar navigation, topbar with user actions, and a content area.
- Routes that require authentication wrap their page element in RequireAuth. If the user is not authenticated, RequireAuth redirects to /login and preserves the original destination in location state.

2. Authentication and session management
- The Zustand store (src/store/authStore.js) holds user, token, isAuthenticated, and loading flags.
- bootstrap() attempts to restore the session from localStorage first, then queries apiMe() if no cached session is found.
- login(), register(), and logout() call into services/api.js and update both store state and localStorage. The Layout uses the store to render user actions and the RequireAuth component consults it to protect routes.

3. Services layer and backend/mock switching
- services/api.js is the single interface for all network calls. It checks REACT_APP_API_BASE; if present, it performs real fetch calls. If not present or if fetch fails, it uses mockHandler() to return data from in-memory datasets.
- Implemented service functions:
  - Authentication: apiLogin, apiRegister, apiMe, apiLogout
  - Content: apiListArticles (with query and category filtering)
  - Preferences: apiGetPreferences, apiUpdatePreferences
  - Email: apiUpdateSubscription

4. Pages and components
- Dashboard uses apiListArticles and apiGetPreferences to render KPI tiles (SummaryTile), filter articles (ArticleCard), and provide quick topic toggles (persisted with apiUpdatePreferences). It also includes helper text via ProtectedNote.
- Archive provides keyword and category filters and displays results as ArticleCard items.
- ArticleDetail reads the article id from the route params and renders a matching ArticleCard or a “not found” message.
- Preferences fetches current preferences and allows modifying topics and email frequency, saving back via apiUpdatePreferences.
- EmailSubscription fetches email/subscription state and updates it via apiUpdateSubscription.
- Login and Register use authStore actions to authenticate and navigate back to the intended destination.

5. Styling and theming
- index.css defines design tokens via CSS variables (primary, secondary, accent, text, border, etc.) and base utility classes (btn, card, grid).
- App.css implements the shell layout (sidebar, topbar, tiles grid, article list) and responsive behaviors.

Primary flows

- App bootstrap:
  - index.js renders Root, which invokes authStore.bootstrap() on mount.
  - If a cached session is found in localStorage, it hydrates immediately; otherwise, it attempts apiMe() via the mock or backend.
- Auth flow:
  - Login/Register pages submit credentials to apiLogin/apiRegister.
  - On success, the store is updated and session is persisted; RequireAuth then allows access to protected routes and redirects the user.
  - Logout clears session in store and localStorage and calls apiLogout.
- Content fetching:
  - Dashboard and Archive call apiListArticles, passing search and category parameters.
  - ArticleDetail calls apiListArticles and selects the article by id for display.
- Preferences and subscription:
  - Preferences reads and writes via apiGetPreferences and apiUpdatePreferences.
  - EmailSubscription reads preferences and updates via apiUpdateSubscription.

Notable implementation details

- Mock-first development: When REACT_APP_API_BASE is not set, the API client falls back to local mocks with small artificial latency to simulate real requests. This enables full local development without a backend.
- Single source of truth for session: Zustand’s auth store and localStorage ensure session persistence across reloads, while apiMe() provides a server-truth fallback when needed.
- Route protection via composition: RequireAuth wraps the actual route elements, enabling a simple and clear protection pattern for all private screens.
- Stateless presentational components: SummaryTile, ArticleCard, and ProtectedNote keep logic minimal and are reused across pages to keep consistency.

File map (selected)
- src/App.js — Router and layout shell; RequireAuth route guard; route to pages
- src/store/authStore.js — Zustand store for authentication/session
- src/services/api.js — Services layer with backend or mock fallback
- src/pages/Dashboard.js — Main landing with KPI tiles, filters, and article list
- src/pages/Archive.js — Search and category filtering of historical articles
- src/pages/ArticleDetail.js — Single article view
- src/pages/Preferences.js — Topics and email frequency management
- src/pages/EmailSubscription.js — Email address and subscription on/off
- src/pages/Login.js, src/pages/Register.js — Authentication forms
- src/components/SummaryTile.js — KPI tile
- src/components/ArticleCard.js — Expandable summary card
- src/components/ProtectedNote.js — Helper text block
- src/index.css, src/App.css — Theme and layout styles

Operational considerations
- Environment configuration:
  - REACT_APP_API_BASE: Optional. If present, requests will target the backend base URL. If absent, the app operates in mock mode.
- CORS: When using a real backend, ensure the server is configured for CORS with credentials if needed.
- Testing: The repository includes unit and integration tests covering components, store behavior, and API mock flows.

End-to-end behavior summary
- Users land on the app; if unauthenticated, the protected routes redirect them to the Login page while Layout remains visible. After successful login, they are redirected back to the originally requested page. Dashboard and other pages fetch data via the API client, which directs traffic to either a real backend (if configured) or the mock handlers. Preferences and subscription changes persist through the same services. The UI remains responsive and consistent through presentational components and shared styles.
