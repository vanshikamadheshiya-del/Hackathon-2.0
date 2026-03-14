import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import statusMonitor from "express-status-monitor";
import connectDB from "./config/database";
import "./config/passport";
import { requestLogger, performanceMonitor, errorTracker, metricsEndpoint } from "./middlewares/monitoring";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import chaosRoutes from "./routes/chaos.routes";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";


// Load environment variables
dotenv.config();

const app: Application = express();

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add Morgan HTTP request logging
app.use(morgan('combined'));

// Add custom monitoring middleware
app.use(requestLogger);
app.use(performanceMonitor);

// Add Express Status Monitor for real-time performance monitoring
app.use(statusMonitor({
  title: 'Admin Backend Monitor',
  path: '/status',
  spans: [{
    interval: 1,     // Every 1 second
    retention: 60    // Keep 60 data points
  }, {
    interval: 5,     // Every 5 seconds
    retention: 60
  }, {
    interval: 15,    // Every 15 seconds
    retention: 60
  }]
}));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://fullstack-app-alpha.vercel.app",
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Required for secure cookies behind Railway/Vercel proxies
}


app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    rolling: true,  //refresh session on every request
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Use your real MongoDB URI
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Add this middleware after session middleware
app.use((req, res, next) => {
  if (req.session) {
    const now = new Date().toLocaleString();
    console.log(`[${now}] Session refreshed for user:`, req.session.passport ? req.session.passport.user : "anonymous");
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/chaos", chaosRoutes);

// Prometheus metrics
app.get('/metrics', metricsEndpoint);

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Server is running healthy" });
});

// Add error tracking middleware (must be last)
app.use(errorTracker);

connectDB();

export default app;

 