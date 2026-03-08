import { Router } from "express";
import { serviceController } from "../controllers/service.controller.js";

const router = Router();

router.get("/columns", serviceController.getColumns);
router.post("/columns", serviceController.addColumn);
router.put("/columns/reorder", serviceController.reorderColumns);
router.delete("/columns/:id", serviceController.deleteColumn);

router.get("/", serviceController.getAll);
router.post("/", serviceController.create);
router.put("/:id", serviceController.update);
router.delete("/:id", serviceController.delete);

export default router;
