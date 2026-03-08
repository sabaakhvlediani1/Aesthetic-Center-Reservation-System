import { Router } from "express";
import { staffController } from "../controllers/staff.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get("/", staffController.getAll);

router.post("/", upload.single("photo"), staffController.create);

router.put("/:id", upload.single("photo"), staffController.update);

router.delete("/:id", staffController.delete);

export default router;