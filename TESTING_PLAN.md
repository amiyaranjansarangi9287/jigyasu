# Jigyasu Component Testing Plan

## Vision & Mission Context
**Mission**: Every child in India — and every adult who missed their chance — deserves to experience the joy of truly understanding something. Not memorizing. Understanding.

**Core Values**: Wonder, Equity, Respect, Patience, Joy, Identity

## Component Architecture

### Main Applications (Individual Ports)
- **hub** (port 3100): Main application containing learnos and kidscamp
- **physics** (port 3001): Physics-specific learning modules
- **toys** (port 3002): Interactive toys and games
- **bio** (port 3003): Biology-specific learning modules  
- **math** (port 3004): Mathematics-specific learning modules
- **chem** (port 3005): Chemistry-specific learning modules
- **cosmos** (port 3006): Astronomy and space science
- **camp** (port 3007): Kids camp activities
- **backend**: Backend service (uses bun runtime)
- **web**: General web interface (default vite port)

### Hub Internal Structure
The hub app contains two main sections:
- **learnos**: Structured learning with age-specific worlds
  - lab: Laboratory experiments and exploration
  - academy: Advanced learning for older students
  - biology: Biological sciences
  - discovery: Exploratory learning
  - early: Early childhood content
  - explorer: Exploration activities
  - math: Mathematical concepts
  - physics: Physical sciences
  - tiny: Content for youngest learners
  
- **kidscamp**: Play-based learning for ages 3-12

## Testing Strategy

### Phase 1: Individual Component Testing
Test each app independently on its designated port to ensure:
- Application starts successfully
- Port binding works correctly
- Basic functionality is accessible
- No console errors
- Responsive design works

### Phase 2: Integration Testing
Test interactions between components:
- Hub routing to different learnos worlds
- Cross-component navigation
- Shared state management
- API communication with backend

### Phase 3: Mission Alignment Testing
Validate each component against core values:
- **Wonder**: Content starts with questions, not answers
- **Equity**: Works on 2G, offline-first, accessible design
- **Respect**: No shame-based assessment, no grades
- **Patience**: No timers, self-paced learning
- **Joy**: Delightful interactions, engaging content
- **Identity**: Indian context, local languages

## Startup Commands

### Start All Components (Parallel)
```bash
# From root directory
pnpm dev
```

### Start Individual Components
```bash
# Hub (contains learnos & kidscamp)
cd apps/hub && pnpm dev

# Physics
cd apps/physics && pnpm dev

# Toys  
cd apps/toys && pnpm dev

# Biology
cd apps/bio && pnpm dev

# Math
cd apps/math && pnpm dev

# Chemistry
cd apps/chem && pnpm dev

# Cosmos
cd apps/cosmos && pnpm dev

# Camp
cd apps/camp && pnpm dev

# Backend
cd apps/backend && pnpm dev

# Web
cd apps/web && pnpm dev
```

## Testing Checklist

### Hub Application (Port 3100)
- [ ] Landing page loads correctly
- [ ] Continue Learning feature works
- [ ] Recent Activity section displays
- [ ] LearnOS navigation works
- [ ] KidsCamp navigation works
- [ ] Age tier selection (3-5, 6-8, 9-12, 13-17, 18+)
- [ ] Download functionality
- [ ] Offline capability
- [ ] Multi-language support (6 Indian languages)

### LearnOS Worlds (within Hub)
- [ ] Lab world: Experiments and exploration
- [ ] Academy: Exam prep content
- [ ] Biology: Biological concepts
- [ ] Discovery: Exploratory learning
- [ ] Early: Early childhood content
- [ ] Explorer: Exploration activities
- [ ] Math: Mathematical concepts
- [ ] Physics: Physical sciences
- [ ] Tiny: Content for youngest learners

### KidsCamp (within Hub)
- [ ] Play-based activities load
- [ ] Age-appropriate content
- [ ] Parent-child activities
- [ ] Offline activities

### Subject-Specific Apps
- [ ] Physics (3001): Physics simulations and concepts
- [ ] Toys (3002): Interactive toys and games
- [ ] Bio (3003): Biology modules
- [ ] Math (3004): Mathematics learning
- [ ] Chem (3005): Chemistry experiments
- [ ] Cosmos (3006): Astronomy content
- [ ] Camp (3007): Camp activities

### Backend Service
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Authentication functions
- [ ] Data persistence

## Mission Validation Tests

### Wonder Testing
- [ ] Content starts with mysteries/questions
- [ ] Interactive exploration before answers
- [ ] "Aha moment" design patterns

### Equity Testing  
- [ ] 2G optimization (loads within 10 seconds)
- [ ] Offline-first functionality
- [ ] Shared device mode
- [ ] Low-storage mode
- [ ] Rural context examples

### Respect Testing
- [ ] No grades or scores
- [ ] Shame-free assessment
- [ ] No comparison with others
- [ ] Progress without judgment

### Patience Testing
- [ ] No countdown timers
- [ ] Infinite practice attempts
- [ ] Pause/resume functionality
- [ ] Self-paced progression

### Joy Testing
- [ ] Delightful micro-interactions
- [ ] Celebration of understanding
- [ ] Play-based learning
- [ ] Beautiful, premium design

### Identity Testing
- [ ] Indian scientific heritage
- [ ] Local festivals and context
- [ ] Indian languages (6 supported)
- [ ] Rupees and Indian economy
- [ ] Indian geography and problems

## Access URLs

Once started, applications will be available at:
- Hub: http://localhost:3100
- Physics: http://localhost:3001
- Toys: http://localhost:3002
- Bio: http://localhost:3003
- Math: http://localhost:3004
- Chem: http://localhost:3005
- Cosmos: http://localhost:3006
- Camp: http://localhost:3007
- Web: http://localhost:5173 (default vite port)
- Backend: Port depends on configuration

## Testing Priority

### High Priority (Core Mission)
1. Hub application (contains main learnos & kidscamp)
2. LearnOS lab world (core exploration)
3. KidsCamp (play-based learning)
4. Backend service (data persistence)

### Medium Priority (Subject Expansion)
5. Math app
6. Physics app
7. Bio app
8. Chem app

### Low Priority (Enrichment)
9. Toys app
10. Cosmos app
11. Camp app
12. Web app

## Notes
- Use pnpm for package management (workspace monorepo)
- All apps use Vite for development server
- Backend uses Bun runtime
- Testing should validate both technical functionality and mission alignment
- Focus on equity features (2G, offline, shared devices)
- Test with different personas (Aarav, Priya, Rahul, Sneha) from mission docs
