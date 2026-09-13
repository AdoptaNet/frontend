# AdoptaNet Frontend — Agent Context

> **Purpose of this file:** Give any AI coding agent (Claude Code, Cursor, Copilot, Gemini, etc.) full context about this repository so it can propose changes that respect the architecture, conventions, and constraints without requiring human re-explanation.

---

## 1. System Overview

**AdoptaNet** is an undergraduate thesis project (Software Engineering + Computer Science) building a web platform for **rescued animal adoption in Peru**. It uses a **hybrid Machine Learning recommendation system** to match rescued pets with potential adopters based on animal characteristics, adopter preferences/lifestyle, and compatibility scoring.

### System Components

| Component | Tech | Repository | Responsibility |
|-----------|------|------------|----------------|
| **Frontend (THIS REPO)** | Next.js 16 + TypeScript | `frontend` | UI, user interactions, consumes NestJS REST API |
| **Backend Core** | NestJS 11 + TypeScript | `adopta-net` | REST API, authentication (JWT + bcrypt + Google OAuth), business logic, data persistence |
| **ML Inference Service** | FastAPI | Separate repo | Hybrid recommendation model, matching/scoring |
| **Database** | PostgreSQL (Supabase / Managed) | Managed | Relational data storage |
| **Realtime** | Supabase Realtime | Managed | WebSocket-based real-time chat subscriptions |
| **Image Storage** | Cloudinary | Managed | Pet photo upload and CDN delivery |

### What This Frontend Does

- Renders all user-facing screens for both **adopters** and **shelters/rescuers**.
- Consumes the NestJS REST API (`http://localhost:3000` in development).
- Handles client-side authentication state (JWT access token in `localStorage`).
- Presents ML-based pet recommendations with **explainable reasons** (never percentages).
- Implements the adopter compatibility questionnaire (multi-step form).
- Provides real-time chat via Supabase Realtime subscriptions.

### What This Frontend Does NOT Do

- Does NOT handle password hashing, token generation, or OAuth flows (delegated to the backend).
- Does NOT call the ML service directly (the backend orchestrates ML calls).
- Does NOT upload images directly to Cloudinary (the backend handles uploads via `multipart/form-data`).

---

## 2. Architecture: Modular with Thin App Router

The project follows a **module-based architecture** where the Next.js `app/` directory handles only routing and layouts, while all business logic lives in a separate `modules/` directory organized by domain.

### Folder Structure

```
frontend/
│
├── app/                              # 🚦 ROUTING ONLY (Next.js App Router)
│   ├── layout.tsx                    # Root layout (fonts, global providers)
│   ├── page.tsx                      # Landing page (/) — ungrouped
│   ├── globals.css                   # Design tokens (Figma-sourced, shadcn-compatible)
│   ├── favicon.ico
│   │
│   ├── (auth)/                       # Route group: unauthenticated pages
│   │   ├── layout.tsx                # Centered layout, no app shell, redirects if logged in
│   │   ├── login/
│   │   │   └── page.tsx              # /login
│   │   ├── register/
│   │   │   ├── page.tsx              # /register
│   │   │   └── role/
│   │   │       └── page.tsx          # /register/role
│   │   └── recover/
│   │       └── page.tsx              # /recover
│   │
│   └── (app)/                        # Route group: all authenticated pages
│       ├── layout.tsx                # App shell with AuthGuard + role-conditional nav
│       ├── home/
│       │   └── page.tsx              # /home
│       ├── pets/
│       │   ├── page.tsx              # /pets
│       │   ├── [id]/
│       │   │   ├── page.tsx          # /pets/123
│       │   │   ├── apply/
│       │   │   │   └── page.tsx      # /pets/123/apply
│       │   │   └── edit/
│       │   │       └── page.tsx      # /pets/123/edit
│       │   └── new/
│       │       └── [step]/
│       │           └── page.tsx      # /pets/new/1
│       ├── questionnaire/
│       │   └── [step]/
│       │       └── page.tsx          # /questionnaire/1
│       ├── applications/
│       │   ├── page.tsx              # /applications
│       │   └── [id]/
│       │       └── page.tsx          # /applications/123
│       ├── messages/
│       │   ├── page.tsx              # /messages
│       │   └── [roomId]/
│       │       └── page.tsx          # /messages/abc
│       ├── profile/
│       │   └── page.tsx              # /profile
│       └── follow-up/
│           ├── page.tsx              # /follow-up
│           └── [id]/
│               └── page.tsx          # /follow-up/123
│
├── modules/                          # 🏗️ BUSINESS LOGIC (outside app/)
│   ├── auth/
│   │   ├── components/               # LoginForm, RegisterForm, RoleSelector...
│   │   ├── hooks/                    # useAuth, useLogin, useRegister...
│   │   ├── services/                 # auth.service.ts
│   │   ├── store/                    # auth.store.ts (Zustand)
│   │   └── models/                   # auth.types.ts
│   │
│   ├── users/
│   │   ├── components/               # ProfileForm, AvatarUploader, PasswordForm...
│   │   ├── hooks/                    # useProfile, useUpdateProfile...
│   │   ├── services/                 # users.service.ts
│   │   └── models/                   # user.types.ts, adopter-profile.types.ts
│   │
│   ├── pets/
│   │   ├── components/               # PetCard, PetDetail, PetForm, ReasonBadge...
│   │   ├── hooks/                    # usePets, usePetDetail, useRecommendations...
│   │   ├── services/                 # pets.service.ts
│   │   └── models/                   # pet.types.ts, recommendation.types.ts
│   │
│   ├── questionnaire/
│   │   ├── components/               # QuestionStep, ProgressBar, ToggleOption...
│   │   ├── hooks/                    # useQuestionnaire, useStepValidation...
│   │   ├── services/                 # questionnaire.service.ts
│   │   └── models/                   # questionnaire.types.ts, enums.ts
│   │
│   ├── adoptions/
│   │   ├── components/               # ApplicationCard, ApplicationDetail, StatusBadge...
│   │   ├── hooks/                    # useApplications, useAdoptionStatus...
│   │   ├── services/                 # adoptions.service.ts
│   │   └── models/                   # adoption.types.ts
│   │
│   ├── chat/
│   │   ├── components/               # ChatWindow, MessageBubble, ChatList...
│   │   ├── hooks/                    # useChat, useMessages...
│   │   ├── services/                 # chat.service.ts
│   │   └── models/                   # chat.types.ts
│   │
│   ├── shelter/
│   │   ├── components/               # ShelterDashboard, PetManagement, FollowUpList...
│   │   ├── hooks/                    # useShelterStats, useShelterPets...
│   │   ├── services/                 # shelter.service.ts
│   │   └── models/                   # shelter.types.ts
│   │
│   └── follow-up/
│       ├── components/               # FollowUpForm, FollowUpHistory, ReminderCard...
│       ├── hooks/                    # useFollowUp, useFollowUpHistory...
│       ├── services/                 # follow-up.service.ts
│       └── models/                   # follow-up.types.ts
│
├── shared/                           # 🔧 CROSS-CUTTING (outside app/)
│   ├── components/
│   │   ├── guards/                   # AuthGuard, RoleGuard (protection wrappers)
│   │   └── layouts/                  # AppShell (role-conditional nav)
│   ├── hooks/                        # useMediaQuery, useDebounce, useLocalStorage...
│   ├── services/                     # http-client.ts (typed fetch wrapper)
│   ├── models/                       # api-response.types.ts, pagination.types.ts
│   ├── utils/                        # date.ts (dayjs + es locale), formatters, validators, constants
│   └── config/                       # env.ts, api-routes.ts
│
├── components/                       # Shadcn UI (CLI-generated) + landing
│   ├── ui/                           # button.tsx, card.tsx, badge.tsx... (do NOT modify)
│   ├── landing/                      # Hero, HowItWorks, FAQ... (landing-specific)
│   └── providers/                    # SmoothScroll, ThemeProvider...
│
├── lib/                              # Shadcn utilities
│   └── utils.ts                      # cn() helper
│
└── public/                           # Static assets
```

### Layer Responsibilities

| Layer | Contains | Rules |
|-------|----------|-------|
| **`app/`** | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` only | Thin pages: import from `modules/`, render, nothing else. No business logic. |
| **`modules/`** | Components, hooks, services, stores, models per domain | Each module is self-contained. Cross-module imports go through `shared/`. |
| **`shared/`** | Code used by 2+ modules | Not a junk drawer. If it's only used in one module, it stays in that module. |
| **`components/ui/`** | Shadcn auto-generated components | Never modify directly. Extend in `modules/` or `shared/` via composition. |

---

## 3. Routing

### Route Map

```
/                              Landing (public, ungrouped)
/login                         Sign in (email/password or Google)
/register                      Create account
/register/role                 Role selection (adopter or shelter)
/recover                       Password recovery

/home                          Dashboard (adopter → recommendations, shelter → panel)
/pets                          Catalog (adopter → explore, shelter → own pets)
/pets/[id]                     Pet detail card
/pets/new/[step]               Register pet wizard (shelter only)
/pets/[id]/edit                Edit pet (shelter only)
/pets/[id]/apply               Submit adoption application (adopter only)
/questionnaire/[step]          Compatibility questionnaire (adopter only)
/applications                  Applications (adopter → mine, shelter → received)
/applications/[id]             Application detail
/messages                      Conversations list
/messages/[roomId]             Chat room
/profile                       Profile & settings
/follow-up                     Follow-up (adopter → my reports, shelter → pending)
/follow-up/[id]                Follow-up detail / history
```

### Route Groups

The `app/` directory uses **two route groups** (folders with parentheses that don't affect the URL):

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)` | Unauthenticated pages (login, register, recover) | Centered card, no app shell. Redirects to `/home` if already authenticated. |
| `(app)` | All authenticated pages | Full app shell with role-conditional navigation + `AuthGuard`. |

### Single Authenticated Layout with Role-Conditional Nav

There is **one** authenticated layout, not two. The navigation items change based on the user's role:

| Adopter Nav | Shelter Nav |
|-------------|-------------|
| Home · Explore · Applications · Profile | Dashboard · Pets · Applications · Follow-up |

```tsx
// app/(app)/layout.tsx
const ADOPTER_NAV = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/pets", label: "Explorar", icon: Search },
  { href: "/applications", label: "Solicitudes", icon: FileText },
  { href: "/profile", label: "Perfil", icon: User },
];

const SHELTER_NAV = [
  { href: "/home", label: "Panel", icon: LayoutDashboard },
  { href: "/pets", label: "Mascotas", icon: PawPrint },
  { href: "/applications", label: "Solicitudes", icon: FileText },
  { href: "/follow-up", label: "Seguimiento", icon: ClipboardCheck },
];
```

### Role-Specific Page Protection

Pages exclusive to one role use a `RoleGuard` component:

```tsx
// app/(app)/pets/new/[step]/page.tsx — shelter only
<RoleGuard allow="shelter" fallback="/home">
  <PetFormWizard step={step} />
</RoleGuard>
```

---

## 4. Thin Page Pattern

Every `page.tsx` inside `app/` is a **thin wrapper**. It imports the main component from `modules/` and renders it. No business logic, no hooks, no state.

```tsx
// app/(app)/pets/[id]/page.tsx — THIS IS ALL IT DOES
import { PetDetailPage } from "@/modules/pets/components/PetDetailPage";

export default function Page({ params }: { params: { id: string } }) {
  return <PetDetailPage id={params.id} />;
}
```

```tsx
// modules/pets/components/PetDetailPage.tsx — ALL LOGIC LIVES HERE
"use client";
import { usePetDetail } from "../hooks/usePetDetail";
import { PetCard } from "./PetCard";
import { ReasonBadge } from "./ReasonBadge";

export function PetDetailPage({ id }: { id: string }) {
  const { pet, isLoading } = usePetDetail(id);
  if (isLoading) return <PetDetailSkeleton />;
  // ... full UI and logic here
}
```

---

## 5. Module Details

### auth

Handles login, registration, Google OAuth redirect, token storage, and session state.

| Subfolder | Contents |
|-----------|----------|
| `components/` | `LoginForm`, `RegisterForm`, `RoleSelector`, `GoogleLoginButton` |
| `hooks/` | `useAuth` (auth state), `useLogin` (mutation), `useRegister`, `useGoogleLogin` |
| `services/` | `auth.service.ts` — calls `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/logout` |
| `store/` | `auth.store.ts` — Zustand store with `user`, `accessToken`, `isAuthenticated`, `login()`, `logout()`, persist middleware for localStorage |
| `models/` | `auth.types.ts` — `LoginDto`, `RegisterDto`, `AuthResponse`, `User` |

### users

User profile management for both adopters and shelters.

| Subfolder | Contents |
|-----------|----------|
| `components/` | `ProfileForm`, `AvatarUploader`, `PasswordChangeForm`, `AdopterProfileForm`, `ShelterProfileForm` |
| `hooks/` | `useProfile`, `useUpdateProfile`, `useChangePassword`, `useUpdateAvatar` |
| `services/` | `users.service.ts` — calls `GET /users/me`, `PATCH /users/me`, `PATCH /users/me/password`, `PUT /users/me/adopter-profile`, `PUT /users/me/shelter-profile`, `PATCH /users/me/avatar` |
| `models/` | `user.types.ts`, `adopter-profile.types.ts`, `shelter-profile.types.ts` |

### pets

Pet catalog, detail views, and pet CRUD for shelters.

| Subfolder | Contents |
|-----------|----------|
| `components/` | `PetCard`, `PetGrid`, `PetDetailPage`, `PetForm`, `ReasonBadge`, `PetFilters` |
| `hooks/` | `usePets`, `usePetDetail`, `useRecommendations`, `useCreatePet`, `useUpdatePet` |
| `services/` | `pets.service.ts` |
| `models/` | `pet.types.ts`, `recommendation.types.ts` |

### questionnaire

Multi-step adopter compatibility questionnaire (feeds the ML model).

| Subfolder | Contents |
|-----------|----------|
| `components/` | `QuestionStep`, `ProgressBar`, `ToggleOption`, `QuestionnaireWizard` |
| `hooks/` | `useQuestionnaire`, `useStepValidation` |
| `services/` | `questionnaire.service.ts` |
| `models/` | `questionnaire.types.ts`, `enums.ts` (must match backend enums exactly) |

### adoptions

Adoption application workflow.

| Subfolder | Contents |
|-----------|----------|
| `components/` | `ApplicationCard`, `ApplicationDetail`, `StatusBadge`, `ApplicationsList` |
| `hooks/` | `useApplications`, `useApplicationDetail`, `useSubmitApplication` |
| `services/` | `adoptions.service.ts` |
| `models/` | `adoption.types.ts` — statuses: `pending`, `under_review`, `approved`, `rejected` |

### chat

Real-time messaging between adopters and shelters.

| Subfolder | Contents |
|-----------|----------|
| `components/` | `ChatWindow`, `MessageBubble`, `ChatList`, `ChatInput` |
| `hooks/` | `useChat`, `useMessages`, `useRealtimeMessages` |
| `services/` | `chat.service.ts` — REST endpoints + Supabase Realtime subscriptions |
| `models/` | `chat.types.ts` |

### shelter

Shelter-specific dashboard and management views.

| Subfolder | Contents |
|-----------|----------|
| `components/` | `ShelterDashboard`, `ShelterStats`, `PetManagementTable` |
| `hooks/` | `useShelterStats`, `useShelterPets` |
| `services/` | `shelter.service.ts` |
| `models/` | `shelter.types.ts` |

### follow-up

Post-adoption follow-up tracking (scheduled check-ins at 30, 90, 180 days).

| Subfolder | Contents |
|-----------|----------|
| `components/` | `FollowUpForm`, `FollowUpHistory`, `ReminderCard`, `FollowUpTimeline` |
| `hooks/` | `useFollowUp`, `useFollowUpHistory`, `useSubmitReport` |
| `services/` | `follow-up.service.ts` |
| `models/` | `follow-up.types.ts` |

---

## 6. Code Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase.tsx` | `LoginForm.tsx`, `PetCard.tsx` |
| Hooks | `camelCase.ts` with `use` prefix | `useAuth.ts`, `usePetDetail.ts` |
| Services | `kebab-case.ts` with `.service` suffix | `auth.service.ts`, `pets.service.ts` |
| Types/Models | `kebab-case.ts` with `.types` suffix | `user.types.ts`, `adoption.types.ts` |
| Stores (Zustand) | `kebab-case.ts` with `.store` suffix | `auth.store.ts` |
| Utilities | `kebab-case.ts` | `formatters.ts`, `constants.ts` |

### Imports

- Use `@/` alias for absolute imports (configured in `tsconfig.json` as `"@/*": ["./*"]`).
- Import paths: `@/modules/auth/...`, `@/shared/...`, `@/components/ui/...`.
- **Never use relative imports that cross module boundaries** (e.g., `../../pets/services/`).

### Components

- `"use client"` only where interactivity is needed (forms, hooks with state, event handlers).
- Server Components by default in `app/`.
- Props typed with `interface`, not `type` (consistency).
- Component files export a single named export (no default exports in module components).

### HTTP Client

```typescript
// shared/services/http-client.ts
// Typed fetch wrapper with:
// - Base URL from environment variable (NEXT_PUBLIC_API_URL)
// - Auth interceptor (attaches access token from localStorage)
// - Error interceptor (centralized error handling, 401 → redirect to /login)
// - Generic typed responses: httpClient.get<PetResponseDto>("/pets/123")
// - Token refresh on 401 (calls POST /auth/refresh, retries original request)
```

### Zustand Stores

```typescript
// modules/auth/store/auth.store.ts
// - Minimal state: accessToken, user, isAuthenticated
// - Synchronous actions only
// - persist middleware for token in localStorage
// - No async logic in the store — async operations live in hooks
```

### Date & Time Handling (Day.js — Peruvian Conventions)

All date and time formatting across the entire app must use `@/shared/utils/date`.
Configuration:
- **Timezone**: `America/Lima` (UTC-5)
- **Time format**: 12-hour format with `am/pm` (e.g., `06:30 pm`, `10:15 am`), **never** 24h format.
- **First day of the week**: Monday (`weekStart: 1`).
- **Locale**: Spanish (`es`).

```typescript
import { formatDate, formatTime, formatDateTime, formatRelativeTime } from "@/shared/utils/date";

formatDate("2026-09-13");               // "13 de septiembre de 2026"
formatTime("2026-09-13T18:30:00");      // "06:30 pm"
formatDateTime(application.createdAt);  // "13/09/2026 06:30 pm"
formatRelativeTime(message.timestamp);  // "hace 2 horas"
```

---

## 7. Authentication Pattern

### Flow

1. User submits credentials → `useLogin` hook calls `auth.service.ts` → `POST /auth/login`.
2. Backend returns `{ accessToken, refreshToken, user }`.
3. `auth.store.ts` saves `accessToken` and `user` in Zustand (persisted to `localStorage`).
4. `refreshToken` is stored in `localStorage` (used for silent refresh).
5. `http-client.ts` attaches `Authorization: Bearer <accessToken>` to every request.
6. On 401 response, `http-client.ts` attempts `POST /auth/refresh` with the refresh token:
   - Success: updates the access token and retries the original request.
   - Failure: clears the store and redirects to `/login`.

### Guards

| Guard | Location | Purpose |
|-------|----------|---------|
| `AuthGuard` | `shared/components/guards/` | Wraps authenticated layouts. Redirects to `/login` if no token. |
| `RoleGuard` | `shared/components/guards/` | Wraps role-specific pages. Redirects to `/home` if wrong role. |

### Backend Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register (multipart/form-data, supports optional avatar) |
| `POST` | `/auth/login` | Authenticate with email & password |
| `GET` | `/auth/google` | Initiate Google OAuth redirect |
| `GET` | `/auth/google/callback` | Google OAuth callback |
| `POST` | `/auth/refresh` | Rotate tokens using valid refresh token |
| `POST` | `/auth/logout` | Invalidate active refresh token |

---

## 8. Design System Reference

The design system is fully specified in [`DESIGN.md`](file:///home/franco/Escritorio/tp/frontend/DESIGN.md). Key points for agents:

### Tokens

All design tokens are defined in [`globals.css`](file:///home/franco/Escritorio/tp/frontend/app/globals.css) as CSS custom properties, mapped to shadcn's variable system. Source of truth: Figma.

### Palette Rules

- **Amber (`ambar-500`)** is reserved for the recommendation system and the adopter's primary action. Never two amber buttons on the same screen.
- **Blue and coral** only appear as process states, never as decoration.
- The palette is **not negotiable** — it comes directly from Figma.

### Typography

- **Archivo** for headings and pet names (weights: 600, 700, 800).
- **Plus Jakarta Sans** for body text and UI (weights: 400, 500, 600, 700).
- Both loaded via `next/font/google` in the root layout.

### Component Library

Shadcn/ui v4 with `base-nova` style. Components are installed via the shadcn CLI into `components/ui/`. Currently installed: `accordion`, `badge`, `button`, `card`, `separator`, `sheet`, `tabs`, `toggle-group`, `toggle`.

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Single column. Bottom nav (4 destinations). Filters in bottom sheet. |
| `≥ 768px` | Top bar replaces bottom nav. Max width 1440px, margin 48px. |
| `≥ 1100px` | Fixed sidebar filters. 3-column grid. Tables instead of card stacks. |

### Non-Negotiable Design Rules

1. **Never show a compatibility percentage.** Show concrete reasons only.
2. **Touch target: 48px minimum** on all actionable elements.
3. **No dead ends.** Every empty state or error offers a concrete action.

---

## 9. Backend API Reference

### Base URL

```
Development: http://localhost:3000
```

Environment variable: `NEXT_PUBLIC_API_URL`

### Available Endpoints (implemented)

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /auth/register` (multipart), `POST /auth/login`, `GET /auth/google`, `GET /auth/google/callback`, `POST /auth/refresh`, `POST /auth/logout` |
| **Users** | `GET /users/me`, `PATCH /users/me`, `PATCH /users/me/password`, `PUT /users/me/adopter-profile`, `PUT /users/me/shelter-profile`, `PATCH /users/me/avatar` (multipart) |
| **Media** | `POST /media/upload` (multipart, protected) |

### Pending Endpoints (not yet implemented)

| Module | Endpoints (planned) |
|--------|---------------------|
| **Pets** | CRUD for pets, recommendations, filters |
| **Adoptions** | Application submission, status management |
| **Messages** | Conversations, message sending |
| **Follow-up** | Report submission, history, reminders |

---

## 10. Configuration & Environment

### Environment Variables

```env
# Application Name (configurable branding)
NEXT_PUBLIC_APP_NAME=Adoptanet

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google OAuth (for client-side redirect initiation)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Key Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript config with `@/*` path alias |
| `components.json` | Shadcn UI configuration (style, aliases, icon library) |
| `eslint.config.mjs` | ESLint with Next.js core-web-vitals + TypeScript |
| `postcss.config.mjs` | PostCSS with Tailwind CSS v4 |

---

## 11. Git Workflow

### Branch Strategy

```
main ← production-ready code
 └── dev ← integration branch, all features merge here first
      ├── feat/auth        ← authentication module
      ├── feat/users       ← user profiles
      ├── feat/pets        ← pet catalog & recommendations
      ├── feat/adoptions   ← adoption workflow
      ├── feat/chat        ← real-time messaging
      ├── feat/shelter     ← shelter dashboard
      └── feat/follow-up   ← post-adoption tracking
```

### Rules

- **Branches are scoped by domain context** (module), not by individual user stories.
- A feature branch **can touch other modules** if the feature requires it (e.g., `feat/auth` may add guards used by other modules).
- **Always merge with explicit merge commits**: `git merge --no-ff feat/xxx`.
- Feature branches are created from `dev` and merged back into `dev`.
- `dev` is merged into `main` only when stable.

### Commit Messages

Use conventional commits in English:

```
feat(auth): add login form with email/password
fix(pets): handle empty recommendations state
refactor(shared): extract http client interceptors
style(landing): adjust hero section spacing
chore: install zustand and react-hook-form
```

---

## 12. Useful Commands

```bash
# Development
npm run dev             # Start Next.js dev server (default: http://localhost:3001)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # ESLint

# Dependencies
npm install             # Install dependencies
npx shadcn@latest add <component>   # Add a shadcn component
```

---

## 13. Tech Stack Summary

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.3.5 |
| Language | TypeScript | ^5 |
| UI Runtime | React | 19.2.8 |
| CSS | Tailwind CSS | v4 |
| Component Library | Shadcn/ui (`base-nova` style) | ^4.21.0 |
| Icons | Lucide React | ^1.45.0 |
| State Management | Zustand | ^5.0.15 |
| Forms | React Hook Form + Zod | ^7.88.0 / ^3.25.76 |
| Date & Time | Day.js (timezone, es, weekStart) | ^1.11.23 |
| Animations | Motion (Framer Motion) | ^13.2.0 |
| Smooth Scroll | Lenis | ^1.3.26 |
| Linting | ESLint (next/core-web-vitals + typescript) | ^9 |

---

## 14. Inviolable Rules

> **These rules are non-negotiable. Any AI agent working on this codebase MUST respect all of them.**

### Rule 1: No Business Logic in `app/`

Pages are thin. They import the main component from `modules/` and render it. **Zero business logic, zero hooks, zero state.**

```tsx
// ✅ CORRECT
export default function Page({ params }: { params: { id: string } }) {
  return <PetDetailPage id={params.id} />;
}

// ❌ WRONG — logic in page
export default function Page({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState(null);
  useEffect(() => { fetchPet(params.id).then(setPet) }, []);
  return <div>{pet?.name}</div>;
}
```

### Rule 2: Module Boundaries

- Each module (`modules/auth/`, `modules/pets/`, etc.) is self-contained.
- **Never import directly from another module's internals.** If two modules need to share code, it goes in `shared/`.
- Services from one module should not call services from another module directly.

### Rule 3: Never Modify `components/ui/`

Shadcn components are CLI-generated and treated as a base layer. To customize behavior, **compose or wrap** them in module components. Never edit the files in `components/ui/` directly.

### Rule 4: Never Show a Compatibility Percentage

The ML system produces scores, but the UI **always** shows concrete, explainable reasons (e.g., "Tolera 6 horas solo — compatible con tu jornada laboral"). This is the thesis's core differentiator.

### Rule 5: Design Tokens Are Not Negotiable

The color palette, typography, spacing scale, and component specs come from Figma and are documented in `DESIGN.md`. Do not invent new colors, modify existing tokens, or deviate from the spec.

### Rule 6: Questionnaire Must Match Backend Enums

The compatibility questionnaire fields, options, and codification **must exactly match** the backend's `AdopterProfile` entity enums. If they diverge, the ML model's training data becomes invalid.

### Rule 7: `"use client"` Only When Necessary

Default to Server Components. Only add `"use client"` when the component genuinely needs client-side interactivity (hooks with state, event handlers, browser APIs). Layout components in `app/` that need client-side auth checks are the exception.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
