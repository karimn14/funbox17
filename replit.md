# Replit.md - Gamified LMS for Special Education

## Overview

This is a gamified Learning Management System (LMS) specifically designed for special education students (Tunagrahita). The application provides an accessible, child-friendly learning experience with video-based modules, interactive quizzes, and progress tracking. The design emphasizes large, readable text, pastel colors, and playful animations to create an engaging environment for students with intellectual disabilities.

Key features include:
- Auto-registration login system (students are created on first login)
- Video learning modules organized by category (Math, Language, Science, etc.)
- Interactive quiz system with hardware button simulation (WebSerial mock)
- Visual feedback with confetti celebrations and animations
- Learning history with statistics tracking
- Admin dashboard for monitoring student progress
- Smart feedback system identifying strengths and areas for improvement

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development and building
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, localStorage for session persistence
- **Styling**: Tailwind CSS with custom pastel color palette, CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and interactions
- **Celebrations**: canvas-confetti for quiz completion effects
- **Typography**: Fredoka (display) and Nunito (body) fonts for child-friendly readability

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: REST endpoints defined in shared routes configuration
- **Development**: tsx for TypeScript execution, Vite middleware for HMR

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**:
  - `students`: id, name, className, createdAt
  - `modules`: id, title, videoUrl, category, questions (JSONB)
  - `quizResults`: id, studentId, moduleId, score, stars, completedAt
- **Migrations**: Drizzle Kit with `db:push` command

### Authentication Pattern
- No traditional auth - students "login" by name/class, auto-registered if new
- Session stored in localStorage (`active_student` key)
- Admin access via PIN code (hardcoded "1234" for demo)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks (students, modules, web-serial)
│   ├── pages/           # Route components
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API endpoint handlers
│   ├── storage.ts       # Database operations
│   └── db.ts            # Drizzle connection
├── shared/              # Shared between client/server
│   ├── schema.ts        # Drizzle table definitions
│   └── routes.ts        # API route contracts with Zod
└── migrations/          # Database migration files
```

### Key Design Decisions
1. **Shared Route Definitions**: API contracts defined once in `shared/routes.ts` with Zod schemas, used by both client and server for type safety
2. **Storage Abstraction**: `IStorage` interface in `storage.ts` allows swapping implementations
3. **WebSerial Simulation**: Mock hook listens for keyboard (A/B/C/D or 1/2/3/4) to simulate hardware quiz buttons
4. **Accessibility Focus**: Large text sizes, high contrast, rounded corners, and clear visual feedback designed for students with intellectual disabilities

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Third-Party Services
- **YouTube**: Video content embedded via react-player for learning modules

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `canvas-confetti`: Celebration effects
- `react-player`: YouTube video embedding
- `lucide-react`: Icon library
- `drizzle-orm` + `drizzle-zod`: Database ORM with Zod integration
- `wouter`: Lightweight routing
- `zod`: Schema validation

### Development Tools
- `vite`: Frontend build tool with HMR
- `tsx`: TypeScript execution for server
- `tailwindcss`: Utility-first CSS framework
- `esbuild`: Production server bundling