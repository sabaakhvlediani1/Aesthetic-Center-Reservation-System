import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./infra/database/sequelize.js";
import { setupAssociations } from "./infra/database/associations.js";
import staffRoutes from "./routes/staff.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setupAssociations();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.use("/api/staff", staffRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection failed", error);
  }
}

start();
