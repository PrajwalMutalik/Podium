# Pin-to-Pin Frontend Explanation

---

## 1. Project Structure

- **client/**: The root of the frontend React app.
  - `index.html`: The HTML template. Contains a `<div id="root"></div>` where React mounts the app.
  - `package.json`: Lists dependencies (React, Vite, etc.) and scripts.
  - `vite.config.js`: Vite config, including a proxy for API requests to the backend.
  - **src/**: All source code.
    - `main.jsx`: Entry point. Renders `<App />` inside context providers and `<BrowserRouter>`.
    - `App.jsx`: Root component. Sets up routes, layout, and renders the `Navbar` and `Footer`.
    - `index.css`, `App.css`, `animations.css`: Global and component styles.
    - **components/**: All reusable UI components (see below).
    - **context/**: React Contexts for authentication and quota.

---

## 2. Entry Point (`main.jsx`)

- Imports React, ReactDOM, BrowserRouter, App, AuthProvider, QuotaProvider, and CSS.
- Renders the app inside `<BrowserRouter>`, `<AuthProvider>`, and `<QuotaProvider>`.
- This makes authentication and quota state available everywhere.

---

## 3. App Layout (`App.jsx`)

- Renders the `Navbar` at the top and `Footer` at the bottom.
- Uses React Router's `<Routes>` and `<Route>` to map URLs to pages.
- Uses `<PrivateRoute>` to protect routes that require login.
- Wraps pages in `<AnimatedPage>` for smooth transitions.

---

## 4. Routing

- `/` → Welcome page
- `/register` → Register form
- `/login` → Login form
- `/about` → About page
- `/contact` → Contact form
- `/dashboard` → User dashboard (protected)
- `/practice` → Session setup (protected)
- `/interview-room` → Interview room (protected)
- `/history` → Session history (protected)
- `/settings` → User settings (protected)
- `/leaderboard` → Leaderboard (protected)

---

## 5. Contexts

### AuthContext

- Manages authentication state, user profile, and API key.
- Provides `login`, `logout`, `fetchUserProfile`, and API key management.
- Makes `userProfile` (points, streak, badges, etc.) available to all components.

### QuotaContext

- Manages daily usage quota (number of free questions).
- Fetches quota from backend and updates on usage.
- Provides `quota`, `fetchQuota`, and `isLoading`.

---

## 6. Main Components

### Navbar

- Shows navigation links based on authentication.
- Displays daily quota usage.
- Includes a theme switcher.
- Handles logout.

### Dashboard

- Shows user stats (points, streak, badges, session stats).
- Quick links to start a session, view history, or leaderboard.

### Login/Register

- Forms for authentication.
- On success, updates context and redirects.

### PrivateRoute

- Protects routes that require login.
- Redirects to `/login` if not authenticated.

### SessionSetup

- Lets user pick role and category for practice.
- Checks quota before starting a session.
- Links to CS resource pack.

### InterviewRoom

- Fetches a random question.
- Lets user record an answer (audio).
- Submits audio to backend for analysis.
- Shows feedback and allows next question.

### AnalysisReport

- Shows AI feedback, pace, filler words, and transcript after each answer.

### HistoryPage

- Lists all past sessions.
- Shows question, feedback, transcript, and allows deletion.

### Leaderboard

- Shows top users and their points.

### SettingsPage

- (Not shown above, but typically for profile and API key management.)

### AboutPage/ContactPage

- Informational and contact forms.

### UpgradePage

- Handles payment and quota upgrades.

### CSFundamentalsCard

- Links to downloadable CS study resources.

### AudioVisualizer

- Visualizes audio input during recording.

### Spinner

- Shows loading animation.

### ThemeSwitch

- Toggles between light and dark themes (persists in localStorage).

### DailyQuotaPopup

- Pops up when daily quota is reached, prompts to upgrade or add API key.

### AnimatedPage

- Adds fade-in-up animation to page transitions.

---

## 7. Styling

- Uses CSS variables for light/dark themes.
- Responsive design for mobile and desktop.
- Animations for smooth transitions.
- Glassmorphism and modern UI patterns.

---

## 8. Data Flow

- Uses React Context for global state (auth, quota).
- Local state for forms and UI.
- Communicates with backend via HTTP (axios/fetch).
- Uses Vite's proxy to avoid CORS issues in development.

---

## 9. Build & Deployment

- Vite for fast dev server and optimized builds.
- Output in `dist/` for deployment.
- Can be hosted statically or with backend.

---

## 10. Best Practices

- Modular, reusable components.
- Context for global state.
- Protected routes.
- Clean, modern UI.
- Accessibility and responsiveness.

---

If you want even more detail on any specific part, just ask!
