# 🎓 OP FunBox - Educational Platform

A full-stack educational platform built with React, Vite, Express, and PostgreSQL.

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Wouter** - Routing

### Backend
- **Node.js + Express** - Server
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- npm or yarn package manager

### Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd main2
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy example files
   cp .env.example .env
   cp client/.env.example client/.env
   
   # Edit .env with your database URL
   # DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Database Setup**
   ```bash
   npm run db:push    # Push schema to database
   npm run db:seed    # Seed initial data (optional)
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   The app will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📦 Available Scripts

```bash
npm run dev          # Start development server (frontend + backend)
npm run build        # Build for production (both frontend & backend)
npm run build:client # Build frontend only
npm run build:server # Build backend only
npm run start        # Run production server
npm run check        # TypeScript type checking
npm run db:push      # Push database schema
npm run db:seed      # Seed database with initial data
```

## 🌍 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Quick Deploy:**
- **Backend**: Deploy to [Render](https://render.com)
- **Frontend**: Deploy to [Vercel](https://vercel.com)

## 📁 Project Structure

```
main2/
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API client
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Entry point
│   └── .env.example        # Frontend env vars template
│
├── server/                  # Backend application
│   ├── index.ts            # Express server setup
│   ├── routes.ts           # API routes
│   ├── db.ts               # Database connection
│   └── ...
│
├── shared/                  # Shared types and schemas
│   ├── schema.ts           # Database schemas
│   └── routes.ts           # API route definitions
│
├── script/                  # Utility scripts
│   └── seed-final.ts       # Database seeding script
│
├── .env.example            # Backend env vars template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── drizzle.config.ts       # Drizzle ORM configuration
```

## 🔧 Configuration

### Backend Environment Variables

Create `.env` in the root directory:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables

Create `client/.env`:

```bash
# Leave empty for local development (uses localhost:5000)
# Set to your backend URL in production
VITE_API_URL=
```

## 🛠️ Development

### API Client

All API calls use the centralized API client (`client/src/lib/api-client.ts`) which automatically handles:
- Base URL configuration
- Environment-specific URLs
- Request headers
- Credentials/cookies

### Database Schema Changes

1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. TypeScript types are automatically generated

### Adding New API Routes

1. Define route in `shared/routes.ts`
2. Implement handler in `server/routes.ts`
3. Use in frontend via hooks or components

## 🧪 Testing Production Build

```bash
# Build everything
npm run build

# Test backend
npm start

# Test frontend (in another terminal)
cd client
npm run preview
```

## 📝 Features

- 🎯 Student login and management
- 📚 Module-based learning system
- 📊 Progress tracking
- 🎮 Interactive quizzes and activities
- 📈 Admin dashboard with reports
- 🔒 Session-based authentication
- 📱 Responsive design

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

## 📄 License

MIT

## 🆘 Support

For issues or questions:
1. Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review the logs (browser console / server logs)
3. Create an issue in the repository

---

Built with ❤️ using React, Express, and PostgreSQL
