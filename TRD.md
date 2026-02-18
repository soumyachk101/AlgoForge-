# 🔧 Technical Requirements Document (TRD)
## AlgoArena — System Architecture & Engineering Specification

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** February 2026  
**Owner:** Engineering Team

---

## 1. System Architecture Overview

AlgoArena is built on a **microservices-oriented, cloud-native architecture** with a React frontend, a Node.js/Go backend gateway, isolated execution workers, and a PostgreSQL + Redis data layer.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│   Next.js 14 (App Router)  +  Monaco Editor  +  Socket.io  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS / WSS
┌─────────────────────▼───────────────────────────────────────┐
│                   API GATEWAY (Node.js/Express)              │
│          Auth middleware │ Rate limiting │ Routing           │
└──┬──────────────┬────────────────┬────────────────┬─────────┘
   │              │                │                │
┌──▼──┐      ┌───▼───┐       ┌────▼────┐     ┌────▼──────┐
│Auth │      │Problem│       │Execution│     │Analytics  │
│Svc  │      │Svc    │       │Worker   │     │Svc        │
│(Go) │      │(Node) │       │(Docker) │     │(Python)   │
└──┬──┘      └───┬───┘       └────┬────┘     └────┬──────┘
   │              │                │                │
┌──▼──────────────▼────────────────▼────────────────▼──────┐
│                    DATA LAYER                              │
│  PostgreSQL (primary)  │  Redis (cache/sessions)          │
│  S3 (assets/uploads)   │  Elasticsearch (search)          │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
| Layer | Technology | Justification |
|-------|------------|---------------|
| Framework | Next.js 14 (App Router) | SSR, SEO, file-based routing, streaming |
| Language | TypeScript 5 | Type safety, IDE support |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design tokens |
| Code Editor | Monaco Editor (via `@monaco-editor/react`) | Industry standard, VS Code compatible |
| State Management | Zustand + React Query (TanStack) | Lightweight global state + server state |
| Auth Client | NextAuth.js v5 | Unified OAuth + credentials handler |
| Real-time | Socket.io client | Contest live updates |
| Charts | Recharts + D3.js | Dashboard visualizations |
| Animations | Framer Motion | Smooth transitions |
| Testing | Vitest + Playwright | Unit + E2E |

### Backend
| Layer | Technology | Justification |
|-------|------------|---------------|
| API Gateway | Node.js + Express / Fastify | Performance, ecosystem |
| Auth Service | Go (Golang) | High performance, low latency JWT operations |
| Problem Service | Node.js | Rapid development, strong JS ecosystem |
| Execution Worker | Docker + gVisor | Secure sandboxed execution |
| Queue | BullMQ (Redis-backed) | Job queue for submission processing |
| WebSocket | Socket.io (Node.js) | Contest real-time updates |
| AI Service | Python + FastAPI | LLM integrations |

### Databases
| Store | Technology | Use Case |
|-------|------------|----------|
| Primary DB | PostgreSQL 16 | User data, problems, submissions |
| Cache | Redis 7 | Sessions, leaderboards, rate limiting |
| Search | Elasticsearch 8 | Full-text problem search |
| Object Store | AWS S3 / Cloudflare R2 | Avatars, test case files |
| Analytics | ClickHouse | Event tracking, user behavior analytics |

### Infrastructure
| Service | Provider |
|---------|----------|
| Cloud | AWS (primary) |
| CDN | Cloudflare |
| Container Orchestration | AWS EKS (Kubernetes) |
| CI/CD | GitHub Actions |
| Monitoring | Grafana + Prometheus + Loki |
| Error Tracking | Sentry |
| Secrets | AWS Secrets Manager |

---

## 3. Database Schema

### 3.1 Users Table
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(320) UNIQUE NOT NULL,
  username        VARCHAR(30) UNIQUE NOT NULL,
  display_name    VARCHAR(60),
  avatar_url      TEXT,
  bio             TEXT,
  country         VARCHAR(2),
  github_url      TEXT,
  linkedin_url    TEXT,
  role            VARCHAR(20) DEFAULT 'free' CHECK (role IN ('free', 'premium', 'admin')),
  plan_expires_at TIMESTAMPTZ,
  is_email_verified BOOLEAN DEFAULT FALSE,
  totp_secret     TEXT,
  totp_enabled    BOOLEAN DEFAULT FALSE,
  streak_current  INTEGER DEFAULT 0,
  streak_longest  INTEGER DEFAULT 0,
  last_active_date DATE,
  rating          INTEGER DEFAULT 1500,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 3.2 OAuth Accounts Table
```sql
CREATE TABLE oauth_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider        VARCHAR(20) NOT NULL,   -- 'google', 'github'
  provider_id     VARCHAR(255) NOT NULL,
  access_token    TEXT,
  refresh_token   TEXT,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);
```

### 3.3 Sessions Table
```sql
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token   VARCHAR(512) UNIQUE NOT NULL,
  user_agent      TEXT,
  ip_address      INET,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.4 Problems Table
```sql
CREATE TABLE problems (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(120) UNIQUE NOT NULL,
  title           VARCHAR(200) NOT NULL,
  difficulty      VARCHAR(10) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  description     TEXT NOT NULL,  -- Markdown
  constraints     TEXT,
  follow_up       TEXT,
  starter_code    JSONB,          -- { python: "...", java: "...", cpp: "..." }
  solution_code   JSONB,          -- premium-only
  editorial       TEXT,           -- Markdown, premium-only
  is_premium      BOOLEAN DEFAULT FALSE,
  is_published    BOOLEAN DEFAULT FALSE,
  frequency_score FLOAT DEFAULT 0,
  acceptance_rate FLOAT DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  total_accepted  INTEGER DEFAULT 0,
  order_index     INTEGER,        -- for sorting in lists
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_problems_slug ON problems(slug);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_is_published ON problems(is_published);
```

### 3.5 Tags Table
```sql
CREATE TABLE tags (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  VARCHAR(60) UNIQUE NOT NULL,
  slug  VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE problem_tags (
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  tag_id     UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, tag_id)
);
```

### 3.6 Companies Table
```sql
CREATE TABLE companies (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT
);

CREATE TABLE problem_companies (
  problem_id  UUID REFERENCES problems(id) ON DELETE CASCADE,
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  frequency   FLOAT DEFAULT 0,  -- normalized 0-1
  PRIMARY KEY (problem_id, company_id)
);
```

### 3.7 Submissions Table
```sql
CREATE TABLE submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id      UUID NOT NULL REFERENCES problems(id),
  language        VARCHAR(20) NOT NULL,
  code            TEXT NOT NULL,
  status          VARCHAR(30) NOT NULL,  -- 'Accepted', 'Wrong Answer', 'TLE', 'MLE', 'RE', 'CE'
  runtime_ms      INTEGER,
  memory_kb       INTEGER,
  test_cases_passed INTEGER,
  test_cases_total  INTEGER,
  error_message   TEXT,
  is_best         BOOLEAN DEFAULT FALSE,  -- fastest accepted submission
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
```

### 3.8 User Problem State Table
```sql
CREATE TABLE user_problem_state (
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_id    UUID REFERENCES problems(id) ON DELETE CASCADE,
  status        VARCHAR(20) DEFAULT 'unseen',  -- 'unseen', 'attempted', 'solved'
  is_bookmarked BOOLEAN DEFAULT FALSE,
  notes         TEXT,
  code_drafts   JSONB,  -- { python: "...", java: "..." }
  last_attempted_at TIMESTAMPTZ,
  solved_at     TIMESTAMPTZ,
  PRIMARY KEY (user_id, problem_id)
);
```

### 3.9 Test Cases Table
```sql
CREATE TABLE test_cases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id  UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  input       TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_sample   BOOLEAN DEFAULT FALSE,  -- shown to user; hidden = for judge only
  order_index INTEGER DEFAULT 0
);
```

### 3.10 Contests Table
```sql
CREATE TABLE contests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(100) UNIQUE NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  type        VARCHAR(20) DEFAULT 'weekly',  -- 'weekly', 'biweekly', 'virtual'
  is_rated    BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contest_problems (
  contest_id  UUID REFERENCES contests(id) ON DELETE CASCADE,
  problem_id  UUID REFERENCES problems(id),
  points      INTEGER DEFAULT 100,
  order_index INTEGER,
  PRIMARY KEY (contest_id, problem_id)
);

CREATE TABLE contest_registrations (
  contest_id  UUID REFERENCES contests(id),
  user_id     UUID REFERENCES users(id),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (contest_id, user_id)
);
```

### 3.11 Payments / Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  plan              VARCHAR(20) NOT NULL,   -- 'monthly', 'annual', 'enterprise'
  status            VARCHAR(20) NOT NULL,   -- 'active', 'cancelled', 'expired', 'past_due'
  stripe_customer_id VARCHAR(255),
  stripe_sub_id     VARCHAR(255),
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. API Design

### 4.1 Authentication Endpoints
```
POST   /api/auth/register          → Create account (email + password)
POST   /api/auth/login             → Email/password login → { accessToken, refreshToken }
POST   /api/auth/logout            → Invalidate refresh token
POST   /api/auth/refresh           → Rotate refresh token → new accessToken
POST   /api/auth/forgot-password   → Send reset email
POST   /api/auth/reset-password    → Confirm reset with token
POST   /api/auth/verify-email      → Confirm email with OTP
POST   /api/auth/magic-link        → Send magic link
GET    /api/auth/magic-link/verify → Validate magic link token
GET    /api/auth/google            → Redirect to Google OAuth
GET    /api/auth/google/callback   → Handle Google OAuth callback
GET    /api/auth/github            → Redirect to GitHub OAuth
GET    /api/auth/github/callback   → Handle GitHub OAuth callback
POST   /api/auth/2fa/setup         → Generate TOTP secret + QR code
POST   /api/auth/2fa/verify        → Verify TOTP and enable 2FA
POST   /api/auth/2fa/disable       → Disable 2FA (requires TOTP)
```

### 4.2 Problem Endpoints
```
GET    /api/problems               → List problems (paginated, filterable)
GET    /api/problems/:slug         → Get single problem detail
GET    /api/problems/:slug/hints   → Get hints (tier-gated)
GET    /api/problems/:slug/editorial → Get editorial (premium + solved gate)
GET    /api/problems/:slug/solutions → Community solutions (paginated)
POST   /api/problems/:slug/bookmark  → Toggle bookmark
GET    /api/problems/daily         → Today's problem of the day
GET    /api/problems/tags          → All tags
GET    /api/problems/companies     → All companies (premium)
GET    /api/problems/sets/:setSlug → Get problem set details
```

### 4.3 Submission Endpoints
```
POST   /api/submissions/run        → Run code against sample/custom test cases
POST   /api/submissions/submit     → Submit code for judging
GET    /api/submissions/:id        → Get submission result (poll)
GET    /api/submissions/problem/:problemId → User's submissions for a problem
GET    /api/submissions            → All user submissions (paginated)
```

### 4.4 User / Dashboard Endpoints
```
GET    /api/users/me               → Current user profile
PUT    /api/users/me               → Update profile
POST   /api/users/me/avatar        → Upload avatar
GET    /api/users/:username        → Public profile
GET    /api/users/me/stats         → Detailed statistics
GET    /api/users/me/streak        → Streak data
GET    /api/users/me/heatmap       → Submission heatmap data (365 days)
GET    /api/users/me/recommendations → Personalized problem recommendations
```

### 4.5 Subscription Endpoints
```
GET    /api/billing/plans          → Available plans
POST   /api/billing/checkout       → Create Stripe checkout session
POST   /api/billing/portal         → Create Stripe customer portal session
POST   /api/billing/webhook        → Stripe webhook handler
GET    /api/billing/subscription   → Current subscription status
DELETE /api/billing/subscription   → Cancel subscription
```

### 4.6 Contest Endpoints
```
GET    /api/contests               → List contests (upcoming, past)
GET    /api/contests/:slug         → Contest details + problems
POST   /api/contests/:slug/register → Register for contest
GET    /api/contests/:slug/leaderboard → Live leaderboard (WebSocket compatible)
GET    /api/contests/:slug/my-rank → Current user's rank in contest
```

---

## 5. Code Execution Engine

### Architecture
```
User submits code
       │
       ▼
API Gateway validates request
       │
       ▼
BullMQ job enqueued in Redis
       │
       ▼
Execution Worker Pool (Docker containers)
  - gVisor (runsc) for kernel-level sandboxing
  - Per-language images (python:3.12-slim, openjdk:21-slim, etc.)
  - Resource limits enforced:
      CPU: 2 cores max
      Memory: 256 MB max
      Time: language_timeout (e.g., 2s for Python, 3s for Java)
      Disk: 64 MB
      Network: BLOCKED
       │
       ▼
Result stored in PostgreSQL + Redis (for polling)
       │
       ▼
Client polls /api/submissions/:id (long-poll or SSE)
```

### Supported Languages & Limits
| Language | Time Limit | Memory Limit | Image |
|----------|-----------|-------------|-------|
| Python 3.12 | 3s | 256 MB | python:3.12-slim |
| Java 21 | 4s | 256 MB | eclipse-temurin:21-jdk-alpine |
| C++ 17 | 2s | 256 MB | gcc:13-alpine |
| JavaScript (Node 20) | 3s | 256 MB | node:20-alpine |
| TypeScript | 3s | 256 MB | node:20-alpine + ts-node |
| Go 1.22 | 2s | 256 MB | golang:1.22-alpine |
| Rust | 2s | 256 MB | rust:1.76-alpine |
| Kotlin | 4s | 256 MB | eclipse-temurin:21-jdk-alpine |
| C# | 4s | 256 MB | mcr.microsoft.com/dotnet/sdk:8.0-alpine |

---

## 6. Authentication & Security Architecture

### Token Strategy
- **Access Token:** JWT, 15-minute expiry, signed with RS256
- **Refresh Token:** Opaque random UUID, 30-day expiry, stored in HttpOnly cookie + DB
- **Rotation:** Every refresh call rotates the refresh token (prevents replay attacks)
- **2FA:** TOTP (RFC 6238) with HMAC-SHA1, 30-second window ±1 drift tolerance

### Rate Limiting (via Redis + sliding window)
| Endpoint | Limit |
|----------|-------|
| POST /auth/login | 10 req/minute per IP |
| POST /auth/register | 5 req/minute per IP |
| POST /submissions/submit | 30 req/hour per user |
| POST /submissions/run | 60 req/hour per user |
| AI hint queries | 10 req/day (premium) |
| General API | 1000 req/minute per user |

### OAuth Flow
```
Client → /api/auth/google (GET)
       → Redirect to Google OAuth consent screen
       → Google → /api/auth/google/callback?code=...
       → Exchange code for tokens
       → Create/update user record
       → Issue JWT + refresh token
       → Redirect to /dashboard
```

---

## 7. Frontend Architecture

### Next.js App Router Structure
```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── (dashboard)/
│   ├── layout.tsx          ← Sidebar + nav shell
│   ├── page.tsx            ← Home dashboard
│   ├── profile/
│   ├── stats/
│   └── settings/
├── problems/
│   ├── page.tsx            ← Problem list
│   └── [slug]/
│       └── page.tsx        ← Problem + editor view
├── contests/
│   ├── page.tsx
│   └── [slug]/
├── leaderboard/
├── pricing/
└── api/                    ← Next.js API routes (thin proxy to backend)
```

### Component Architecture
```
components/
├── ui/                     ← shadcn/ui primitives
├── layout/
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── OAuthButton.tsx
│   └── TwoFactorForm.tsx
├── problems/
│   ├── ProblemList.tsx
│   ├── ProblemCard.tsx
│   ├── ProblemFilter.tsx
│   ├── ProblemDetail.tsx
│   └── TagBadge.tsx
├── editor/
│   ├── CodeEditor.tsx
│   ├── LanguageSelector.tsx
│   ├── TestCasePanel.tsx
│   └── SubmissionResult.tsx
├── dashboard/
│   ├── StatsCard.tsx
│   ├── StreakWidget.tsx
│   ├── HeatmapCalendar.tsx
│   ├── RadarChart.tsx
│   ├── DifficultyRings.tsx
│   └── RecentActivity.tsx
└── shared/
    ├── DifficultyBadge.tsx
    ├── UserAvatar.tsx
    ├── LoadingSpinner.tsx
    └── Modal.tsx
```

---

## 8. Real-time Architecture (Contests)

- **Socket.io** server on a dedicated Node.js instance
- Events:
  - `contest:submission` → broadcast on successful submission
  - `contest:rank_update` → user's rank changed
  - `contest:timer_tick` → every minute for countdown sync
  - `contest:ended` → trigger results page
- Leaderboard snapshots cached in Redis and updated every 30s during active contest
- Redis Pub/Sub to sync across multiple Socket.io server instances

---

## 9. CI/CD Pipeline

```
GitHub Push → GitHub Actions
  ├── Lint (ESLint + tsc)
  ├── Unit Tests (Vitest)
  ├── Integration Tests
  ├── E2E Tests (Playwright, on PR only)
  ├── Docker build
  ├── Push to ECR
  └── Deploy to EKS (staging → production via manual approval)
```

---

## 10. Monitoring & Observability

| Tool | Purpose |
|------|---------|
| Prometheus | Metrics collection (request latency, submission queue depth) |
| Grafana | Dashboards and alerting |
| Loki | Log aggregation |
| Sentry | Frontend + backend error tracking |
| Uptime Robot | External uptime monitoring |
| AWS CloudWatch | Infrastructure metrics |

### Key Alerts
- Submission queue depth > 100 jobs → scale worker pool
- API p99 latency > 3s → PagerDuty alert
- Error rate > 1% → Slack alert
- Database connection pool exhausted → immediate alert

---

## 11. Environment Configuration

```bash
# Application
NODE_ENV=production
APP_URL=https://algoarena.io
API_URL=https://api.algoarena.io

# Database
DATABASE_URL=postgresql://user:pass@host:5432/algoarena
REDIS_URL=redis://host:6379

# Auth
JWT_PRIVATE_KEY=...   # RS256 private key
JWT_PUBLIC_KEY=...    # RS256 public key
JWT_EXPIRY=900        # 15 minutes in seconds
REFRESH_TOKEN_EXPIRY=2592000  # 30 days

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Payments
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_MONTHLY_PRICE_ID=...
STRIPE_ANNUAL_PRICE_ID=...

# Storage
AWS_S3_BUCKET=algoarena-assets
AWS_REGION=us-east-1

# AI
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...

# Email
RESEND_API_KEY=...
EMAIL_FROM=noreply@algoarena.io
```

---

## 12. Disaster Recovery & Backup

- **Database:** Daily automated snapshots (AWS RDS), point-in-time recovery, 30-day retention
- **Code submissions:** S3 versioning on submission storage bucket
- **RPO (Recovery Point Objective):** 1 hour
- **RTO (Recovery Time Objective):** 4 hours
- **Multi-AZ:** RDS and EKS across 3 availability zones
