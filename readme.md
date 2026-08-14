# ⚡ TestQuickAI — AI-Powered QA Automation Platform

> Describe a test in plain English. TestQuickAI reads your codebase, writes the Playwright script, and runs it in a real cloud browser — automatically.

---

## 🚀 What Is TestQuickAI?

**TestQuickAI** is a full-stack SaaS platform that eliminates the need to manually write end-to-end browser tests. Instead of spending hours writing and maintaining Playwright scripts, you simply:

1. Connect your GitHub repository
2. Describe what you want to test in plain English
3. Click **Run** — TestQuickAI does the rest

The platform reads your actual source code, feeds it to Google Gemini AI, generates a resilient Playwright script, runs it in a real cloud browser via Browserbase, and saves the full results including logs and session recordings.

---

## ✨ Key Features

| Feature | What It Does |
|---|---|
| **AI Script Generation** | Gemini AI reads your real source files and writes a Playwright test script from your plain-English description |
| **Cloud Browser Execution** | Tests run in real Browserbase cloud browsers — no local Chromium needed |
| **Session Recordings** | Every test run produces a recorded session you can replay |
| **Two Execution Modes** | Generate a fresh AI script, or re-run the cached script instantly |
| **Credit-Based Billing** | Stripe-powered — each run costs 70–100 credits based on AI token usage |
| **GitHub Integration** | OAuth pulls live source files directly into the AI prompt |
| **Repo-Level Config** | Set a target domain and global instructions (e.g. login steps) once per repo |

---

## 🧠 How It Works

```
Describe a test case
      ↓
GitHub token reads your source files (components, routes, selectors)
      ↓
Gemini AI receives: description + source code + global instructions
      ↓
Gemini generates a resilient Playwright script
      ↓
Script runs inside a Browserbase cloud browser (via CDP)
      ↓
Logs, pass/fail status, and session URL saved to Neon Postgres
      ↓
Credits deducted from your account
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + TypeScript |
| **UI** | React 19, Tailwind CSS v4, Radix UI, shadcn/ui, Framer Motion |
| **AI** | Google Gemini API (`@google/genai`) |
| **Browser Automation** | Playwright Core + Browserbase (cloud browsers via CDP) |
| **Database** | Neon Serverless Postgres + Drizzle ORM |
| **Authentication** | Clerk (user auth) + GitHub OAuth (repo access) |
| **Payments** | Stripe (credits + webhooks) |

---

## 📦 Project Setup

### 1. Clone & Install

```bash
git clone https://github.com/Realmer01/TestQuick-AI.git
cd TestQuick-AI
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Neon Postgres — https://neon.tech
DATABASE_URL=

# Clerk Auth — https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe — https://stripe.com (Test Mode)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# GitHub OAuth App — https://github.com/settings/developers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback

# Google Gemini — https://aistudio.google.com
GEMINI_API_KEY=

# Browserbase — https://www.browserbase.com
BROWSERBASE_PROJECT_ID=
BROWSERBASE_API_KEY=
```

### 3. Push Database Schema (First Time Only)

```bash
npm run db:push
```

### 4. Start the Dev Server

```bash
npm run dev
```

Visit **http://localhost:3000**. For Stripe webhook testing, run in a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🔑 API Keys — Where to Get Them

| Service | Link |
|---|---|
| **Neon Postgres** | [neon.tech](https://neon.tech) → Create project → Copy connection string |
| **Clerk** | [clerk.com](https://clerk.com) → Create app → API Keys |
| **Stripe** | [stripe.com](https://stripe.com) → Test Mode → Developers → API Keys |
| **GitHub OAuth** | GitHub Settings → Developer Settings → OAuth Apps → New OAuth App |
| **Gemini** | [aistudio.google.com](https://aistudio.google.com) → Get API Key |
| **Browserbase** | [browserbase.com](https://www.browserbase.com) → Project Settings → API Keys |

---

## 🧪 How to Run a Test

> ⚠️ **Important:** Browserbase runs in the cloud, so your local app must be publicly accessible. Use [ngrok](https://ngrok.com/) to expose it:

```bash
ngrok http 3000
# → https://abc123.ngrok-free.app
```

Then in TestQuickAI:
1. Sign in → Connect GitHub
2. Select a repo → **Project Config** → paste the ngrok URL as the target domain
3. Create a test case — add a title, description, route, and expected result
4. Click **Run Test** → view pass/fail status, logs, and the session recording

---

## 📁 Project Structure

```
app/
  api/
    checkout/stripe/route.ts   ← Stripe checkout session creation
    generate-test-cases/       ← Auto-generate test cases via Gemini AI
    github/                    ← GitHub OAuth callback & repo listing
    test-cases/run/route.ts    ← Main AI script generator + Playwright execution
    test-cases/settings/       ← Update test case metadata
    user-repo/                 ← Connected repo listing + settings
    users/                     ← User registration & credit management
    webhooks/stripe/           ← Stripe payment webhooks
  workspace/                   ← Protected dashboard routes
  page.tsx                     ← Public landing page

components/custom/
  EmptyWorkspace.tsx           ← Empty state view
  RepoDialog.tsx               ← Add GitHub repo dialog
  RepoSettings.tsx             ← Per-repo config dialog
  TestCaseExecutionModel.tsx   ← Test execution modal & live log viewer
  TestCaseList.tsx             ← List of created test cases
  TestCaseSettingDialog.tsx    ← Edit test case modal
  UserRepoList.tsx             ← Connected GitHub repos selector
  WorkspaceBody.tsx            ← Main dashboard content
  WorkspaceHeader.tsx          ← Top navigation header & credit counter

context/
  UserDetailContext.tsx        ← React context for user state & credits

db/
  schema.ts                    ← Drizzle ORM database tables
  index.ts                     ← Neon database client setup

lib/
  stripe.ts                    ← Stripe server configuration
  utils.ts                     ← Shared utility functions (cn, etc.)

proxy.ts                       ← Clerk auth middleware
```

---

## 💡 What I Learned

1. **Prompt Engineering** — AI output quality depends on what you put in the prompt. Injecting real source code (selectors, component structure) and encoding resilience rules (wait for elements, substring assertions) directly into the prompt was the key to generating reliable scripts.
2. **Dynamic Code Execution** — Used JavaScript's `AsyncFunction` constructor to compile Gemini's text output into a real runnable function at runtime, with `page`, `assert`, and a custom `console` injected as sandboxed parameters.
3. **Serverless Browser Automation** — Playwright can't install Chromium on a serverless function. Browserbase solves this with cloud browser sessions that Playwright connects to via Chrome DevTools Protocol (CDP).
4. **Full-Stack SaaS Wiring** — Connected Clerk (auth), GitHub OAuth (repo access), Stripe + webhooks (billing), and Neon + Drizzle (database) into a single cohesive production-ready system.

---

## 📊 Database Schema

| Table | Key Columns |
|---|---|
| `users` | `id`, `email`, `credits` (default: 1000) |
| `repositories` | `userId`, `repoId`, `fullName`, `targetDomain`, `globalInstruction` |
| `test_cases` | `title`, `description`, `targetRoute`, `expectedResult`, `browserbaseScript`, `status`, `logs`, `sessionUrl` |

---

## 🔒 Security Notes

- `/workspace` and all `/api` routes are protected by Clerk middleware
- GitHub tokens are stored as short-lived cookies — never in the database
- Stripe webhooks are verified with `STRIPE_WEBHOOK_SECRET` before processing
- Users need ≥ 100 credits to trigger a test run

---

## 📜 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:push      # Push schema to Neon
npm run db:studio    # Open Drizzle Studio (visual DB browser)
npm run lint         # Run ESLint
```

---

*Built with Next.js, TypeScript, Gemini AI, Browserbase, Clerk, Stripe, and Neon Postgres.*
