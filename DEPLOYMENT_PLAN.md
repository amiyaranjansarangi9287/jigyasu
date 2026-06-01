# Jigyasu Deployment Plan

**Date**: 2026-05-31  
**Platform Options**: Vercel vs Cloudflare Pages  
**Architecture**: Multi-service monorepo with 8 frontend apps + 1 backend

---

## Current Architecture Analysis

### Services Overview
| Service | Port | Technology | Purpose | Status |
|---------|------|------------|---------|--------|
| Hub | 3100 | React + Vite + PWA | Main app (LearnOS + KidsCamp) | ✅ Ready |
| Physics | 3001 | React + Vite | Physics learning modules | ✅ Ready |
| Toys | 3002 | React + Vite | Interactive toys & build system | ✅ Ready |
| Bio | 3003 | React + Vite | Biology learning modules | ✅ Ready |
| Math | 3004 | React + Vite | Mathematics learning modules | ✅ Ready |
| Chem | 3005 | React + Vite | Chemistry learning modules | ✅ Ready |
| Cosmos | 3008 | React + Vite | Astronomy content | ✅ Ready |
| Camp | 3007 | React + Vite | Kids camp activities | ✅ Ready |
| Backend | - | Bun + TypeScript | API service | ❌ Requires Bun |

### Current Development Setup
- **Monorepo**: pnpm workspace structure
- **Development**: Vite dev servers on different ports
- **Proxy**: Hub app proxies requests to other services via Vite config
- **PWA**: Hub app configured with Vite PWA plugin
- **Storage**: Dexie (IndexedDB) for local data
- **Analytics**: Plausible (privacy-first)

---

## Deployment Strategy Comparison

### Option 1: Vercel (Recommended)

**Pros**:
- Native React/Vite support
- Automatic HTTPS and SSL
- Built-in edge functions
- Easy environment variable management
- Preview deployments for each PR
- Excellent monorepo support
- Free tier generous (100GB bandwidth/month)
- Automatic domain routing
- Built-in analytics

**Cons**:
- Serverless functions have execution time limits
- Edge functions limited to 50MB bundle size
- Backend Bun runtime not natively supported (would need adaptation)

### Option 2: Cloudflare Pages

**Pros**:
- Free tier unlimited bandwidth
- Edge deployment globally
- Workers for serverless functions
- D1 database (SQLite) included
- KV storage included
- R2 object storage (S3-compatible)
- Excellent for static sites

**Cons**:
- Less mature React/Vite support
- Monorepo support more complex
- Backend Bun runtime not natively supported
- Preview deployments less seamless
- Edge functions have memory limits

---

## Recommended Architecture: Vercel Multi-Project Deployment

### Deployment Model: Subdomain-Based Routing

```
jigyasu.app (main domain)
├── hub.jigyasu.app (Hub app - main entry point)
├── physics.jigyasu.app (Physics app)
├── toys.jigyasu.app (Toys app)
├── bio.jigyasu.app (Bio app)
├── math.jigyasu.app (Math app)
├── chem.jigyasu.app (Chem app)
├── cosmos.jigyasu.app (Cosmos app)
├── camp.jigyasu.app (Camp app)
└── api.jigyasu.app (Backend API)
```

### Alternative: Path-Based Routing (Single Domain)

```
jigyasu.app
├── / (Hub app - main entry point)
├── /physics (Physics app)
├── /toys (Toys app)
├── /bio (Bio app)
├── /math (Math app)
├── /chem (Chem app)
├── /cosmos (Cosmos app)
├── /camp (Camp app)
└── /api (Backend API)
```

**Recommendation**: Subdomain-based routing for better separation of concerns and easier scaling.

---

## Vercel Deployment Configuration

### 1. Hub App (Main Application)

**vercel.json**:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev",
  "regions": ["hkg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/physics/(.*)",
      "destination": "https://physics.jigyasu.app/$1"
    },
    {
      "source": "/toys/(.*)",
      "destination": "https://toys.jigyasu.app/$1"
    },
    {
      "source": "/bio/(.*)",
      "destination": "https://bio.jigyasu.app/$1"
    },
    {
      "source": "/math/(.*)",
      "destination": "https://math.jigyasu.app/$1"
    },
    {
      "source": "/chem/(.*)",
      "destination": "https://chem.jigyasu.app/$1"
    },
    {
      "source": "/cosmos/(.*)",
      "destination": "https://cosmos.jigyasu.app/$1"
    },
    {
      "source": "/camp/(.*)",
      "destination": "https://camp.jigyasu.app/$1"
    },
    {
      "source": "/api/(.*)",
      "destination": "https://api.jigyasu.app/$1"
    }
  ]
}
```

**Environment Variables**:
```
NODE_ENV=production
VITE_API_URL=https://api.jigyasu.app
VITE_PHYSICS_URL=https://physics.jigyasu.app
VITE_TOYS_URL=https://toys.jigyasu.app
VITE_BIO_URL=https://bio.jigyasu.app
VITE_MATH_URL=https://math.jigyasu.app
VITE_CHEM_URL=https://chem.jigyasu.app
VITE_COSMOS_URL=https://cosmos.jigyasu.app
VITE_CAMP_URL=https://camp.jigyasu.app
```

### 2. Individual Subject Apps

Each app (Physics, Toys, Bio, Math, Chem, Cosmos, Camp) needs similar configuration:

**vercel.json** (for each app):
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev",
  "regions": ["hkg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 3. Backend Service

**Challenge**: Backend uses Bun runtime, not natively supported by Vercel.

**Solutions**:

**Option A: Convert to Node.js (Recommended)**
- Rewrite backend to use Node.js instead of Bun
- Deploy as Vercel Serverless Function
- Use Vercel Postgres or Supabase for database

**Option B: Deploy Backend Separately**
- Deploy backend to Railway, Render, or Fly.io (supports Bun)
- Configure CORS to allow requests from Vercel domains
- Use environment variables for API endpoints

**Option C: Use Vercel Edge Functions**
- Convert backend logic to Edge Functions
- Limit to edge-compatible operations
- May require significant refactoring

**Recommendation**: Option A (Convert to Node.js) for seamless integration with Vercel ecosystem.

---

## Cloudflare Pages Alternative Configuration

### 1. Hub App (Main Application)

**wrangler.toml**:
```toml
name = "jigyasu-hub"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"

[build]
command = "pnpm build"
cwd = "apps/hub"

[[routes]]
pattern = "hub.jigyasu.app"
custom_domain = true

[[routes]]
pattern = "jigyasu.app"
custom_domain = true
```

**_headers** file:
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
```

### 2. Individual Apps

Each app deployed as separate Cloudflare Pages project with subdomain routing.

### 3. Backend Service

**Challenge**: Cloudflare Workers don't support Bun runtime.

**Solution**: Use Cloudflare Workers with Node.js compatibility layer or deploy backend separately to Railway/Render.

---

## Migration Steps

### Phase 1: Preparation (Week 1)

1. **Domain Setup**
   - Purchase/verify domain: jigyasu.app
   - Configure DNS records for subdomains
   - Set up SSL certificates (automatic on both platforms)

2. **Environment Variables**
   - Create `.env.production` files for each app
   - Configure API endpoints
   - Set up analytics tracking domains
   - Configure PWA manifest URLs

3. **Build Optimization**
   - Review build output sizes
   - Optimize images and assets
   - Configure code splitting
   - Test production builds locally

### Phase 2: Hub App Deployment (Week 2)

1. **Vercel Setup**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy Hub app
   cd apps/hub
   vercel --prod
   ```

2. **Configuration**
   - Add `vercel.json` to Hub app
   - Configure environment variables
   - Set up custom domain: hub.jigyasu.app
   - Configure rewrites for other services
   - Test PWA functionality

3. **Testing**
   - Verify deployment
   - Test PWA installation
   - Test navigation to other services
   - Verify analytics tracking

### Phase 3: Individual Apps Deployment (Week 3)

Deploy each subject app following similar process:

```bash
# Deploy Physics app
cd apps/physics
vercel --prod --scope jigyasu-physics

# Deploy Toys app
cd apps/toys
vercel --prod --scope jigyasu-toys

# Repeat for Bio, Math, Chem, Cosmos, Camp
```

Configure each with:
- Custom subdomain (physics.jigyasu.app, etc.)
- Environment variables
- Build settings
- Headers configuration

### Phase 4: Backend Deployment (Week 4)

**Option A: Convert to Node.js + Vercel**
1. Refactor backend to use Node.js runtime
2. Convert to Vercel Serverless Functions
3. Deploy as `api.jigyasu.app`
4. Configure CORS for frontend domains
5. Test API endpoints

**Option B: Separate Backend Deployment**
1. Deploy backend to Railway/Render (supports Bun)
2. Configure environment variables
3. Set up CORS for Vercel domains
4. Update frontend API URLs
5. Test API integration

### Phase 5: Integration Testing (Week 5)

1. **Cross-Service Navigation**
   - Test Hub → Physics navigation
   - Test Hub → Toys navigation
   - Test all cross-service links

2. **PWA Functionality**
   - Test offline capability
   - Test service worker caching
   - Test app installation

3. **Performance Testing**
   - Test 2G network simulation
   - Verify load times < 10 seconds
   - Test bundle sizes

4. **Analytics & Monitoring**
   - Verify Plausible tracking
   - Set up Vercel Analytics
   - Configure error tracking (Sentry)

---

## Cost Analysis

### Vercel (Hobby Plan - Free)
- **Frontend Apps**: 8 projects × $0 = $0
- **Backend**: 1 project × $0 = $0 (if using serverless functions)
- **Bandwidth**: 100GB/month included
- **Build Minutes**: 6,000/month included
- **Domains**: Unlimited custom domains included
- **SSL**: Automatic, free

**Estimated Monthly Cost**: $0 (within free tier limits)

### Cloudflare Pages (Free Plan)
- **Frontend Apps**: Unlimited projects × $0 = $0
- **Bandwidth**: Unlimited
- **Build Minutes**: 500/month included
- **Workers**: 100,000 requests/day included
- **Domains**: Unlimited custom domains included
- **SSL**: Automatic, free

**Estimated Monthly Cost**: $0 (within free tier limits)

### Additional Services (if needed)
- **Database**: Supabase (Free tier) or Vercel Postgres ($0-20/month)
- **Backend Hosting**: Railway ($5/month) or Render ($7/month) if separate deployment
- **Analytics**: Plausible ($9/month) or Vercel Analytics (Free)
- **Error Tracking**: Sentry ($26/month) or Vercel (Free tier limited)

---

## Recommendation: Vercel Multi-Project Deployment

**Why Vercel**:
1. **Better React/Vite Support**: Native integration with Vite
2. **Monorepo Support**: Built-in support for pnpm workspaces
3. **Preview Deployments**: Automatic previews for each PR
4. **Edge Functions**: Serverless capabilities for API
5. **Developer Experience**: Superior CLI and dashboard
6. **Analytics**: Built-in analytics and monitoring
7. **Ecosystem**: Better integration with React ecosystem

**Deployment Architecture**:
```
Vercel Account: jigyasu
├── Project: jigyasu-hub (hub.jigyasu.app)
├── Project: jigyasu-physics (physics.jigyasu.app)
├── Project: jigyasu-toys (toys.jigyasu.app)
├── Project: jigyasu-bio (bio.jigyasu.app)
├── Project: jigyasu-math (math.jigyasu.app)
├── Project: jigyasu-chem (chem.jigyasu.app)
├── Project: jigyasu-cosmos (cosmos.jigyasu.app)
├── Project: jigyasu-camp (camp.jigyasu.app)
└── Project: jigyasu-api (api.jigyasu.app)
```

**Next Steps**:
1. Set up Vercel account and team
2. Configure DNS for jigyasu.app
3. Deploy Hub app first (main entry point)
4. Deploy individual subject apps
5. Convert backend to Node.js or deploy separately
6. Configure cross-service navigation
7. Test PWA functionality
8. Monitor performance and analytics

---

## Risk Mitigation

### Technical Risks
- **Backend Bun Runtime**: Convert to Node.js or deploy separately
- **Cross-Service Communication**: Use proper CORS and API routing
- **PWA Service Worker**: Test thoroughly across browsers
- **Performance**: Monitor bundle sizes and load times

### Operational Risks
- **Domain Management**: Use Vercel's automatic DNS management
- **SSL Certificates**: Automatic on both platforms
- **Build Failures**: Set up build notifications and rollback procedures
- **Cost Overruns**: Monitor usage against free tier limits

### Migration Risks
- **Downtime**: Use blue-green deployment strategy
- **Data Loss**: Ensure local storage (IndexedDB) not affected
- **User Impact**: Communicate deployment schedule to users

---

## Success Metrics

### Technical Metrics
- **Deployment Time**: < 5 minutes per app
- **Build Time**: < 3 minutes per app
- **Load Time**: < 3 seconds (3G), < 10 seconds (2G)
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%

### User Metrics
- **PWA Installation Rate**: Track PWA installs
- **Offline Usage**: Monitor service worker cache hits
- **Cross-Service Navigation**: Track navigation between apps
- **Performance**: Monitor Core Web Vitals (LCP, FID, CLS)

### Business Metrics
- **Cost**: Stay within free tier limits ($0/month)
- **Scalability**: Handle 10,000+ concurrent users
- **Geographic Coverage**: Deploy to multiple regions if needed

---

## Rollback Plan

### Immediate Rollback
1. Use Vercel's built-in rollback to previous deployment
2. Revert DNS changes if needed
3. Monitor error rates and user feedback

### Disaster Recovery
1. Maintain local production builds
2. Use Git tags for stable releases
3. Document rollback procedures
4. Set up monitoring alerts

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Preparation | Week 1 | Domain setup, environment variables, build optimization |
| Hub Deployment | Week 2 | Hub app deployed, PWA tested, navigation configured |
| Individual Apps | Week 3 | All 7 subject apps deployed and tested |
| Backend Deployment | Week 4 | Backend deployed (Node.js or separate) |
| Integration Testing | Week 5 | Cross-service testing, performance validation, monitoring setup |

**Total Timeline**: 5 weeks for complete deployment
