import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
// CORRECT IMPORT PATHS (Pointing to LOCAL api/ directory)
import { registerRoutes } from "./routes"; 
import { serveStatic } from "./static";
import { createServer } from "http";
import 'dotenv/config';

const app = express();
const httpServer = createServer(app);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin && origin.startsWith(allowed as string))) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- SERVERLESS LAZY INIT ---
let routesRegistered = false;
const setupApp = async () => {
  if (!routesRegistered) {
    await registerRoutes(httpServer, app);
    
    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Internal Server Error:", err);
      if (res.headersSent) return next(err);
      return res.status(status).json({ message });
    });

    routesRegistered = true;
  }
};

// Vercel Middleware
app.use(async (req, res, next) => {
  await setupApp();
  next();
});

// Local Dev Fallback
if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
  (async () => {
    try {
      await setupApp();
      // Fix dynamic import path for local dev
      const { setupVite } = await import("./vite-setup");
      await setupVite(httpServer, app);
      
      const port = parseInt(process.env.PORT || "5000", 10);
      httpServer.listen(port, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
    }
  })();
}

export default app;