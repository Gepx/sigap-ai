import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { globalLimiter } from "./utils/rateLimiter.js";
import AuthRouter from "./routes/auth.route.js";
import RoleRouter from "./routes/role.route.js";
import PermissionRouter from "./routes/permission.route.js";
import UserRouter from "./routes/user.route.js";
import SessionRouter from "./routes/session.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

await connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

app.use("/api/auth", AuthRouter);

app.use(authMiddleware);

app.use("/api/roles", RoleRouter);
app.use("/api/permissions", PermissionRouter);
app.use("/api/users", UserRouter);
app.use("/api/sessions", SessionRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
