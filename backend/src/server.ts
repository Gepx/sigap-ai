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
import AiRouter from "./routes/ai.route.js";
import ReviewItemRouter from "./routes/review_item.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

await connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

app.use("/api/auth", AuthRouter);
app.use("/api/ai", AiRouter);

app.use(authMiddleware);

app.use("/api/roles", RoleRouter);
app.use("/api/permissions", PermissionRouter);
app.use("/api/users", UserRouter);
app.use("/api/review-items", ReviewItemRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
