# Industry News Digest - Frontend (React)

Modern, clean, dashboard-style React application for viewing daily industry news summaries, managing notification preferences, browsing archives, and email subscription management.

## Features
- Daily summary dashboard with KPI tiles
- Category filtering and full-text search
- Expandable article summaries and links to original sources
- User registration/login (mock backend fallback)
- Preferences management (topics, frequency)
- Archived news search
- Email subscription management
- Responsive, light theme with business-oriented styling

## Quick Start
1. Install dependencies:
   npm install
2. Configure environment:
   cp .env.example .env
   # Edit .env to set REACT_APP_API_BASE if a backend is available
3. Run the app:
   npm start
4. Build for production:
   npm run build

If REACT_APP_API_BASE is not set, the app uses in-memory mock endpoints.

## Configuration
- REACT_APP_API_BASE: Backend API base URL (optional; mock used if missing)
- REACT_APP_SITE_URL: Public site URL for email redirects

## Tech
- React 18 + React Router 6
- Zustand for auth state
- No heavy UI framework, custom CSS with CSS variables

## Project Structure
src/
  components/      # Reusable UI building blocks
  pages/           # Routed pages (Dashboard, Archive, Preferences, Auth, etc.)
  services/        # API client with mock fallback
  store/           # Zustand stores
  App.js           # Routing and layout
  App.css          # Layout and component styles
  index.css        # Global styles and variables

## Notes
- Authentication/session is simulated when no backend is provided.
- For production with a backend, set REACT_APP_API_BASE and ensure CORS is configured.
