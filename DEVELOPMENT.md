# Development Workflow Reference

## Project: IT Self-Service Recovery Portal
**Repo:** https://github.com/venom877/it-self-service-recovery-portal

---

## Quick Start Commands

```bash
# Navigate to project
cd "V:\PROJECTS Vijay\it-self-service-recovery-portal"

# Install deps
npm install

# Dev server (frontend + backend)
npm run dev        # Vite on :3000
# In another terminal:
npx tsx server.ts  # Express backend (if created)

# Build for production
npm run build

# Lint/Typecheck
npm run lint

# Preview production build
npm run preview
```

---

## Git Workflow

```bash
# Daily work
git status
git add .
git commit -m "type: description"
git push

# Types: feat, fix, chore, docs, refactor, test, ci
```

---

## Cloud Deployment (Next Steps)

### 1. Dockerize
```dockerfile
# Dockerfile (multi-stage)
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (nginx for static + node for API)
FROM nginx:alpine AS frontend
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Or use Cloud Run: single container with node serving static + API
```

### 2. GitHub Actions CI/CD (`.github/workflows/ci-cd.yml`)
```yaml
name: CI/CD
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      # - run: npm test
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      # Deploy to Cloud Run / Container Apps / App Runner
```

### 3. Deploy to Cloud (pick one)

| Provider | Service | Command |
|----------|---------|---------|
| **GCP** | Cloud Run | `gcloud run deploy --source .` |
| **Azure** | Container Apps | `az containerapp up --source .` |
| **AWS** | App Runner | `aws apprunner create-service ...` |

---

## AI Integration (Replace Mock in ChatInterface)

```typescript
// src/services/aiClient.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function diagnoseIssue(symptom: string): Promise<DiagnosticResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `As IT support AI, diagnose: "${symptom}". Return JSON with category, confidence, description, severity, suggestedActions.`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

Add to `.env`:
```env
VITE_GEMINI_API_KEY=your_key_here
```

---

## Project Structure

```
src/
├── App.tsx                 # Main app (Login → User Portal / Agent Portal)
├── components/
│   ├── ChatInterface.tsx   # User portal - AI chat with voice
│   ├── AgentPortal.tsx     # Service desk dashboard
│   ├── ManagerDashboard.tsx # 5 self-healing modules + AI heuristics
│   ├── ScriptGenerator.tsx # PowerShell terminal simulator
│   └── [5 module components]
├── utils/
│   └── presentationDownloader.ts  # PPTX + HTML demo generator
└── types.ts
```

---

## Key Files to Modify for Cloud/AI Showcase

| Goal | Files to Touch |
|------|----------------|
| Add real AI | `ChatInterface.tsx`, new `src/services/aiClient.ts` |
| Backend API | New `server.ts` (Express), `vite.config.ts` (proxy) |
| Docker | New `Dockerfile`, `docker-compose.yml`, `.dockerignore` |
| CI/CD | New `.github/workflows/ci-cd.yml` |
| Infra as Code | New `main.tf` (Terraform) or `infra/` (Bicep/CDK) |
| Observability | Add OpenTelemetry to `main.tsx` and `server.ts` |
| Auth | New `src/context/AuthContext.tsx`, protect routes |

---

## Resume Talking Points

- **Problem**: WFH users stuck in "No VPN → No Cert Renewal → No Login" deadlock
- **Solution**: Session 0 pre-login agent + 5 on-demand self-healing modules
- **Impact**: 40% ticket reduction, <12s MTTR, 0% background footprint
- **Tech**: React 19, TypeScript, Tailwind v4, Vite, Express, Gemini AI, Docker, Cloud Run
- **Cloud Skills**: CI/CD, containerization, serverless deploy, IaC, observability, secrets mgmt

---

## Next Session Checklist

- [ ] Add Dockerfile + docker-compose.yml
- [ ] Add GitHub Actions workflow
- [ ] Deploy to Cloud Run (GCP) / Container Apps (Azure)
- [ ] Integrate real Gemini AI in ChatInterface
- [ ] Add OpenTelemetry tracing
- [ ] Write Terraform for cloud resources
- [ ] Add authentication (Entra ID / Cognito)
- [ ] Create architecture diagram (Mermaid/Excalidraw)
- [ ] Record 2-min demo video for portfolio